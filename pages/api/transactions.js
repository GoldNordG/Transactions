import { sendEmail } from "../../lib/mailer";
import { generatePDF } from "../../lib/generatePDF";
import { uploadInvoiceToDrive } from "../../lib/driveUtils"; // AJOUT de l'import
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
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
        jewelryPhotoUrls,
        paymentProofUrl,
        items,
      } = req.body;

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

      let transactionLocation = location;
      if (session.user.role === "agency") {
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
        });
        if (user?.location) transactionLocation = user.location;
      }

      const totalWeight = items.reduce(
        (sum, item) => sum + parseFloat(item.weight),
        0
      );

      const validJewelryPhotoUrls = Array.isArray(jewelryPhotoUrls)
        ? jewelryPhotoUrls.filter((url) => url && url.trim() !== "")
        : [];

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
          designation:
            items.length === 1
              ? items[0].designation
              : items.map((i) => i.designation).join(", "),
          weight: totalWeight,
          amount: parseFloat(amount),
          paiement,
          location: transactionLocation,
          user: {
            connect: { id: session.user.id },
          },
          paymentProofUrl: paymentProofUrl || null,

          jewelryPhotos:
            validJewelryPhotoUrls.length > 0
              ? {
                  create: validJewelryPhotoUrls.map((url, index) => ({
                    photoUrl: url,
                    photoOrder: index + 1,
                    description: null,
                  })),
                }
              : undefined,
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
          items: true,
          jewelryPhotos: true,
        },
      });

      // Générer les PDFs
      const facturePDF = await generatePDF(
        { ...newTransaction, items: newTransaction.items },
        "facture"
      );
      const retractationPDF = await generatePDF(
        { ...newTransaction, items: newTransaction.items },
        "retractation"
      );

      // NOUVEAU : Sauvegarder les PDFs sur Google Drive
      let factureGoogleDriveUrl = null;
      let retractationGoogleDriveUrl = null;

      try {
        console.log("Début de l'upload des PDFs vers Google Drive...");

        // Upload de la facture
        const factureUploadResult = await uploadInvoiceToDrive(
          facturePDF,
          `facture_${factureNumber}.pdf`,
          transactionLocation,
          orderNumber,
          clientName
        );
        factureGoogleDriveUrl = factureUploadResult.fileUrl;
        console.log("Facture uploadée avec succès:", factureGoogleDriveUrl);

        // Upload du formulaire de rétractation
        const retractationUploadResult = await uploadInvoiceToDrive(
          retractationPDF,
          `retractation_${orderNumber}.pdf`,
          transactionLocation,
          orderNumber,
          clientName
        );
        retractationGoogleDriveUrl = retractationUploadResult.fileUrl;
        console.log(
          "Rétractation uploadée avec succès:",
          retractationGoogleDriveUrl
        );

        // Optionnel: Mettre à jour la transaction avec les URLs Google Drive
        await prisma.transaction.update({
          where: { id: newTransaction.id },
          data: {
            factureGoogleDriveUrl: factureGoogleDriveUrl,
            retractationGoogleDriveUrl: retractationGoogleDriveUrl,
          },
        });
      } catch (driveError) {
        console.error("Erreur lors de l'upload vers Google Drive:", driveError);
        // Ne pas interrompre le processus si l'upload Drive échoue
        // L'email et la transaction seront quand même créés
      }

      const formattedDate = format(new Date(date), "dd/MM/yyyy", {
        locale: fr,
      });

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

      const photoInfo =
        validJewelryPhotoUrls.length > 0
          ? `\nPhotos des bijoux : ${validJewelryPhotoUrls.length} photo(s) attachée(s)`
          : "";

      await sendEmail(
        "facturation.goldnord@gmail.com",
        `Agence ${location} n° d'ordre : ${orderNumber} le ${formattedDate}, (${clientName})`,
        `Une nouvelle transaction a été enregistrée.

Détails de la transaction :
- Date : ${formattedDate}
- Client : ${clientName}
- E-mail : ${clientMail || "Non spécifié"}
- Téléphone : ${phone || "Non spécifié"}
- Numéro d'ordre : ${orderNumber}
- Lieu : ${transactionLocation || "Non spécifié"}
- Mode de paiement : ${paiement}
- Vendeur : ${session.user.email}${photoInfo}

Articles :
${itemsText}

Total : ${amount} €`,
        facturePDF,
        `facture_${orderNumber}.pdf`
      );

      if (session.user.email) {
        await sendEmail(
          session.user.email,
          `Gold Nord - Facture n° ${factureNumber} (Transaction ${orderNumber})`,
          `Bonjour,

Voici une copie de la facture pour la transaction que vous venez d'enregistrer.

Détails de la transaction :
- Date : ${formattedDate}
- Client : ${clientName}
- N° de facture : ${factureNumber}
- N° d'ordre : ${orderNumber}
- Total : ${amount} €

Cordialement,
GOLD NORD`,
          facturePDF,
          `facture_${factureNumber}.pdf`
        );
      }

      if (clientMail) {
        await sendEmail(
          clientMail,
          "Gold Nord - Votre formulaire de rétractation",
          `Cher(e) ${clientName},

Conformément aux dispositions légales en vigueur, nous vous transmettons ci-joint le formulaire de rétractation relatif à votre commande ${orderNumber}.

Si vous souhaitez exercer votre droit de rétractation, nous vous invitons à compléter ce formulaire et à nous le retourner dans un délai de 48 Heures à compter de la réception de votre commande.

Pour toute question ou assistance, notre service client reste à votre disposition.

Cordialement,
GOLD NORD`,
          retractationPDF,
          `retractation_${orderNumber}.pdf`
        );
      }

      res.status(201).json({
        ...newTransaction,
        factureGoogleDriveUrl,
        retractationGoogleDriveUrl,
      });
    } catch (error) {
      console.error("Erreur lors de la création de la transaction:", error);
      res.status(500).json({
        message: "Erreur lors de l'enregistrement de la transaction",
        error: error.message,
      });
    }
  } else if (req.method === "GET") {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;
      const filters = {};

      if (session.user.role === "agency") {
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
        });
        if (user?.location) filters.location = user.location;
      } else if (["admin", "superadmin"].includes(session.user.role)) {
        if (req.query.location?.trim()) {
          filters.location = {
            contains: req.query.location,
            mode: "insensitive",
          };
        }
      } else {
        filters.userId = session.user.id;
      }

      if (req.query.clientName) {
        filters.clientName = {
          contains: req.query.clientName,
          mode: "insensitive",
        };
      }

      if (req.query.carats) {
        filters.items = { some: { carats: req.query.carats } };
      }

      if (req.query.startDate || req.query.endDate) {
        filters.date = {};
        if (req.query.startDate) {
          filters.date.gte = new Date(req.query.startDate);
        }
        if (req.query.endDate) {
          const endDate = new Date(req.query.endDate);
          endDate.setDate(endDate.getDate() + 1);
          filters.date.lt = endDate;
        }
      }

      const totalItems = await prisma.transaction.count({ where: filters });
      const totalPages = Math.ceil(totalItems / limit);

      const transactions = await prisma.transaction.findMany({
        where: filters,
        include: {
          items: true,
          jewelryPhotos: {
            orderBy: { photoOrder: "asc" },
          },
          user: { select: { email: true, location: true, role: true } },
        },
        orderBy: { date: "desc" },
        skip,
        take: limit,
      });

      const totalStats = await prisma.transaction.aggregate({
        where: filters,
        _sum: {
          amount: true,
          weight: true,
        },
      });

      res.status(200).json({
        transactions,
        pagination: {
          totalItems,
          totalPages,
          currentPage: page,
          pageSize: limit,
        },
        stats: {
          totalAmount: parseFloat(totalStats._sum.amount || 0),
          totalWeight: parseFloat(totalStats._sum.weight || 0),
          count: totalItems,
        },
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des transactions:", error);
      res.status(500).json({
        message: "Erreur lors de la récupération des transactions",
        error: error.message,
      });
    }
  } else {
    res.status(405).json({ message: "Méthode non autorisée" });
  }
}
