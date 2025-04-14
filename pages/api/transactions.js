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
    try {
      const {
        date,
        clientName,
        factureNumber,
        clientMail,
        phone,
        adresse,
        codePostal,
        ville,
        orderNumber,
        amount,
        paiement,
        location,
        jewelryPhotoUrl,
        paymentProofUrl,
        items, // Le tableau d'items du formulaire
      } = req.body;

      // Valider les données de base
      if (
        !date ||
        !clientName ||
        !factureNumber ||
        !orderNumber ||
        !adresse ||
        !codePostal ||
        !ville ||
        !amount ||
        !paiement ||
        !items ||
        !Array.isArray(items) ||
        items.length === 0
      ) {
        return res.status(400).json({
          message: "Tous les champs obligatoires doivent être remplis.",
        });
      }

      // Vérifier que chaque item contient les informations nécessaires
      for (const item of items) {
        if (
          !item.designation ||
          !item.carats ||
          !item.weight ||
          !item.unitPrice
        ) {
          return res.status(400).json({
            message: "Informations manquantes pour un ou plusieurs articles",
          });
        }
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

      // Calculer le poids total
      const totalWeight = items.reduce(
        (sum, item) => sum + parseFloat(item.weight),
        0
      );

      const newTransaction = await prisma.transaction.create({
        data: {
          date: new Date(date),
          clientName,
          factureNumber,
          clientMail: clientMail || null,
          phone: phone || null,
          adresse,
          codePostal,
          ville,
          orderNumber,
          // Pour la compatibilité avec le code existant, on utilise la désignation du premier item
          // ou une concaténation des désignations
          designation:
            items.length === 1
              ? items[0].designation
              : items.map((i) => i.designation).join(", "),
          weight: totalWeight,
          // No carats and unitPrice fields in Transaction model
          amount: parseFloat(amount),
          paiement,
          location: transactionLocation,
          userId: session.user.id,
          jewelryPhotoUrl: jewelryPhotoUrl || null,
          paymentProofUrl: paymentProofUrl || null,
          // Ajouter les items en relation
          items: {
            create: items.map((item) => ({
              designation: item.designation,
              carats: item.carats,
              weight: parseFloat(item.weight),
              unitPrice: parseFloat(item.unitPrice),
              subtotal: parseFloat(item.weight) * parseFloat(item.unitPrice),
            })),
          },
        },
        include: {
          items: true, // Inclure les items dans la réponse
        },
      });

      // Générer la facture pour l'admin
      const facturePDF = await generatePDF(
        {
          ...newTransaction,
          items: newTransaction.items, // S'assurer que les items sont inclus pour le PDF
        },
        "facture"
      );

      const retractationPDF = await generatePDF(
        {
          ...newTransaction,
          items: newTransaction.items,
        },
        "retractation"
      );

      // Formater la date
      const formattedDate = format(new Date(date), "dd/MM/yyyy", {
        locale: fr,
      });

      // Envoyer la facture à l'admin
      const adminEmail = "goldnord.digital@gmail.com";
      const adminSubject = `Nouvelle transaction : ${orderNumber} à ${transactionLocation} le ${formattedDate}`;

      // Créer le texte pour chaque item
      const itemsText = items
        .map(
          (item) => `
- Désignation : ${item.designation}
- Poids : ${item.weight} g
- Carats : ${item.carats}
- Prix unitaire : ${item.unitPrice} €/g
- Sous-total : ${(parseFloat(item.weight) * parseFloat(item.unitPrice)).toFixed(
            2
          )} €
`
        )
        .join("\n");

      const adminText = `
Une nouvelle transaction a été enregistrée.

Détails de la transaction :
- Date : ${formattedDate}
- Client : ${clientName}
- E-mail : ${clientMail || "Non spécifié"}
- Téléphone : ${phone || "Non spécifié"}
- Numéro d'ordre : ${orderNumber}
- Lieu : ${transactionLocation || "Non spécifié"}
- Mode de paiement : ${paiement}
- Vendeur : ${session.user.email}

Articles :
${itemsText}

Total : ${amount} €
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

Si vous souhaitez exercer votre droit de rétractation, nous vous invitons à compléter ce formulaire et à nous le retourner dans un délai de 48 Heures à compter de la réception de votre commande.

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
    } catch (error) {
      console.error("Erreur lors de la création de la transaction:", error);
      res.status(500).json({
        message: "Erreur lors de l'enregistrement de la transaction",
        error: error.message,
      });
    }
  } else if (req.method === "GET") {
    try {
      // Extraire les paramètres de requête pour les filtres
      const { location, startDate, endDate, carats } = req.query;

      // Construire l'objet de filtrage pour Prisma
      let whereClause = {};

      // Filtrer selon le rôle de l'utilisateur
      if (session.user.role === "agency") {
        // Récupérer l'utilisateur pour obtenir sa localisation
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
        });

        whereClause.location = user.location;
      } else if (session.user.role !== "admin") {
        // Rôle non reconnu
        return res.status(403).json({ message: "Accès non autorisé" });
      }

      // Ajouter des filtres supplémentaires si spécifiés
      if (location) {
        whereClause.location = {
          contains: location,
          mode: "insensitive", // Recherche insensible à la casse
        };
      }

      if (carats) {
        // Correct approach: search only within items since carats is no longer in Transaction
        whereClause.items = {
          some: {
            carats,
          },
        };
      }

      // Filtre de plage de dates
      if (startDate || endDate) {
        whereClause.date = {};

        if (startDate) {
          whereClause.date.gte = new Date(startDate);
        }

        if (endDate) {
          // Ajouter un jour à la date de fin pour inclure toute la journée
          const endDateTime = new Date(endDate);
          endDateTime.setDate(endDateTime.getDate() + 1);
          whereClause.date.lt = endDateTime;
        }
      }

      // Exécuter la requête avec les filtres
      const transactions = await prisma.transaction.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              email: true,
              location: true,
            },
          },
          items: true, // Inclure les items
        },
        orderBy: {
          date: "desc",
        },
      });

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
