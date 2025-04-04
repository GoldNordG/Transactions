import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../mailer";
import { generatePDF } from "../pdfGenerator";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Vérifier l'authentification
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res
      .status(401)
      .json({ message: "Non authentifié. Veuillez vous connecter." });
  }

  if (req.method === "POST") {
    const {
      date,
      clientName,
      clientSurname,
      clientMail,
      phone,
      orderNumber,
      designation,
      weight,
      carats,
      unitPrice,
      amount,
      location,
    } = req.body;

    // Valider les données
    if (
      !date ||
      !clientName ||
      !clientSurname ||
      !orderNumber ||
      !designation ||
      !weight ||
      !carats ||
      !unitPrice ||
      !amount
    ) {
      return res.status(400).json({
        message: "Tous les champs obligatoires doivent être remplis.",
      });
    }

    // Définir la localisation en fonction du rôle de l'utilisateur
    let transactionLocation = location;

    // Si c'est un utilisateur d'agence, utiliser sa localisation
    if (session.user.role === "agency") {
      // Récupérer l'information complète de l'utilisateur
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });

      transactionLocation = user.location;
    }

    // Ajouter la nouvelle transaction avec l'ID utilisateur de la session
    const newTransaction = await prisma.transaction.create({
      data: {
        date: new Date(date),
        clientName,
        clientSurname,
        clientMail: clientMail || null,
        phone: phone || null,
        orderNumber,
        designation,
        weight: parseFloat(weight),
        carats: parseInt(carats),
        unitPrice: parseFloat(unitPrice),
        amount: parseFloat(amount),
        location: transactionLocation,
        userId: session.user.id,
      },
    });

    // Générer la facture pour l'admin
    const facturePDF = await generatePDF(newTransaction, "facture");

    // Générer le formulaire de rétractation pour le client
    const retractationPDF = await generatePDF(newTransaction, "retractation");

    // Formater la date
    const formattedDate = format(new Date(date), "dd/MM/yyyy", { locale: fr });

    // Envoyer la facture à l'admin
    const adminEmail = "goldnord.digital@gmail.com";
    const adminSubject = `Nouvelle transaction : ${orderNumber} à ${location} le ${formattedDate}`;
    const adminText = `
Une nouvelle transaction a été enregistrée.

Détails de la transaction :
- Date : ${formattedDate}
- Client : ${clientName} ${clientSurname}
- E-mail : ${clientMail || "Non spécifié"}
- Téléphone : ${phone || "Non spécifié"}
- Numéro d'ordre : ${orderNumber}
- Désignation : ${designation}
- Poids : ${weight} g
- Carats : ${carats}
- Prix unitaire : ${unitPrice} €
- Montant total : ${amount} €
- Lieu : ${transactionLocation || "Non spécifié"}
- Vendeur : ${session.user.email}
`;

    await sendEmail(
      adminEmail,
      adminSubject,
      adminText,
      facturePDF,
      `facture_${orderNumber}.pdf`
    );

    // Envoyer le formulaire de rétractation au client si l'email est fourni
    if (clientMail) {
      const clientSubject = "Votre formulaire de rétractation";
      const clientText = `Cher(e) ${clientName},

Conformément aux dispositions légales en vigueur, nous vous transmettons ci-joint le formulaire de rétractation relatif à votre commande ${orderNumber}.

Si vous souhaitez exercer votre droit de rétractation, nous vous invitons à compléter ce formulaire et à nous le retourner dans un délai de 14 jours à compter de la réception de votre commande.

Pour toute question ou assistance, notre service client reste à votre disposition.

Cordialement,
GOLD NORD`;

      await sendEmail(
        clientMail,
        clientSubject,
        clientText,
        retractationPDF,
        `retractation_${orderNumber}.pdf`
      );
    }

    res.status(201).json(newTransaction);
  } else if (req.method === "GET") {
    try {
      // Filtrer les transactions selon le rôle de l'utilisateur
      let transactions;

      if (session.user.role === "admin") {
        // L'admin voit toutes les transactions
        transactions = await prisma.transaction.findMany({
          include: {
            user: {
              select: {
                email: true,
                location: true,
              },
            },
          },
        });
      } else if (session.user.role === "agency") {
        // Récupérer l'utilisateur pour obtenir sa localisation
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
        });

        // L'agence ne voit que ses propres transactions
        transactions = await prisma.transaction.findMany({
          where: {
            location: user.location,
          },
          include: {
            user: {
              select: {
                email: true,
                location: true,
              },
            },
          },
        });
      } else {
        // Rôle non reconnu
        return res.status(403).json({ message: "Accès non autorisé" });
      }

      res.status(200).json(transactions);
    } catch (error) {
      console.error("Erreur lors de la récupération des transactions :", error);
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des transactions" });
    }
  } else {
    res.status(405).json({ message: "Méthode non autorisée" });
  }
}
