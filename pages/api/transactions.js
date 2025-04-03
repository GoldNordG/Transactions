import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../mailer"; // Importer la fonction d'envoi d'e-mail
import { generatePDF } from "../pdfGenerator"; // Importer la fonction de génération de PDF
import { format } from "date-fns";
import { fr } from "date-fns/locale";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Supprimez ou commentez la vérification de la session
  // const session = await getServerSession(req, res, authOptions);

  // if (!session) {
  //   return res
  //     .status(401)
  //     .json({ message: "Non authentifié. Veuillez vous connecter." });
  // }

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
      userId,
    } = req.body;

    console.log("Request body:", req.body);

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

    console.log("Data being sent to Prisma:", {
      date: new Date(date),
      clientName,
      clientMail,
      phone,
      orderNumber,
      designation,
      weight: parseFloat(weight),
      carats: parseInt(carats),
      unitPrice: parseFloat(unitPrice),
      amount: parseFloat(amount),
      location,
      userId,
    });

    // Ajouter la nouvelle transaction
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
        location: location || null,
        userId: userId || null,
      },
    });

    console.log("Transaction saved successfully");

    // Générer la facture pour l'admin
    const facturePDF = await generatePDF(newTransaction, "facture");

    // Générer le formulaire de rétractation pour le client
    const retractationPDF = await generatePDF(newTransaction, "retractation");

    // Formater la date
    const formattedDate = format(new Date(date), "dd/MM/yyyy", { locale: fr });

    // Envoyer la facture à l'admin
    const adminEmail = "goldnord.digital@gmail.com"; // Remplacez par votre adresse e-mail
    const adminSubject = `Nouvelle transaction : ${orderNumber}`;
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
- Lieu : ${location || "Non spécifié"}
- Vendeur : ${userId || "Non spécifié"}
`;

    await sendEmail(
      adminEmail,
      adminSubject,
      adminText,
      facturePDF,
      `facture_${orderNumber}.pdf`
    );

    // Envoyer le formulaire de rétractation au client
    const clientSubject = "Votre formulaire de rétractation";
    const clientText = `Cher(e) ${clientName},

Conformément aux dispositions légales en vigueur, nous vous transmettons ci-joint le formulaire de rétractation relatif à votre commande ${orderNumber}.

Si vous souhaitez exercer votre droit de rétractation, nous vous invitons à compléter ce formulaire et à nous le retourner dans un délai de nombre de jours à compter de la réception de votre commande.

Pour toute question ou assistance, notre service client reste à votre disposition à coordonnées du service client.

Cordialement,
GOLD NORD`;

    await sendEmail(
      clientMail,
      clientSubject,
      clientText,
      retractationPDF,
      `retractation_${orderNumber}.pdf`
    );

    res.status(201).json(newTransaction);
  } else if (req.method === "GET") {
    try {
      const transactions = await prisma.transaction.findMany();
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
