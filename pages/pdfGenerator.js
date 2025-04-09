import PDFDocument from "pdfkit";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import fs from "fs";
import path from "path";

export function generatePDF(transaction, type = "facture") {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      margins: {
        top: 100,
        bottom: 100,
        left: 80,
        right: 80,
      },
    });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
    doc.on("error", reject);

    // Chemin vers le fichier d'arrière-plan
    const backgroundPath = path.join(
      process.cwd(),
      "public",
      "images",
      "goldnord-letterhead.jpg"
    );

    try {
      // Ajout de l'image d'arrière-plan sur chaque page
      doc.on("pageAdded", () => {
        doc.image(backgroundPath, 0, 0, {
          width: doc.page.width,
          height: doc.page.height,
        });
      });

      // Ajout de l'arrière-plan à la première page
      doc.image(backgroundPath, 0, 0, {
        width: doc.page.width,
        height: doc.page.height,
      });
    } catch (error) {
      console.error(
        "Erreur lors du chargement de l'image d'arrière-plan:",
        error
      );
    }

    const formattedDate = format(new Date(transaction.date), "dd/MM/yyyy", {
      locale: fr,
    });

    if (type === "facture") {
      // Titre de la facture
      doc
        .fontSize(18)
        .font("Helvetica-Bold")
        .text("FACTURE DE VENTE D'OR", { align: "center" });
      doc.moveDown(2);

      // Informations du vendeur et acheteur en colonnes
      const leftColumnX = 80;
      const rightColumnX = doc.page.width / 2 + 20;

      // Colonne gauche - Vendeur
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Vendeur (professionnel) :", leftColumnX);
      doc
        .font("Helvetica")
        .text("Nom de l'entreprise : GOLD NORD", leftColumnX);
      doc.text(`SIRET : 492 735 741 00026`, leftColumnX);
      doc.text(`RCS Valenciennes 411 034 549`, leftColumnX);
      doc.text(`Téléphone : 03 27 59 80 76`, leftColumnX);
      doc.text(`E-mail : administrateur@goldnord.fr`, leftColumnX);
      doc.text(`Adresse : 85 bis avenue de France`, leftColumnX);
      doc.text(`59600 Maubeuge`, leftColumnX);

      // Colonne droite - Acheteur
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Acheteur (client) :", rightColumnX);
      doc
        .font("Helvetica")
        .text(`Nom : ${transaction.clientName}`, rightColumnX);
      doc.text(
        `Téléphone : ${transaction.phone || "Non spécifié"}`,
        rightColumnX
      );
      doc.text(
        `E-mail : ${transaction.clientMail || "Non spécifié"}`,
        rightColumnX
      );
      doc.text(`Adresse : ${transaction.adresse}`, rightColumnX);
      doc.text(`${transaction.codePostal} ${transaction.ville}`, rightColumnX);

      doc.moveDown(2);

      // Tableau des détails de la transaction
      const tableTop = doc.y;
      const tableWidth = doc.page.width - 160; // Largeur totale du tableau

      // En-têtes du tableau
      doc.font("Helvetica-Bold");
      doc.text("Désignation", leftColumnX, tableTop, {
        width: tableWidth * 0.35,
        align: "left",
      });
      doc.text("Poids (g)", leftColumnX + tableWidth * 0.35, tableTop, {
        width: tableWidth * 0.15,
        align: "center",
      });
      doc.text("Titre (carats)", leftColumnX + tableWidth * 0.5, tableTop, {
        width: tableWidth * 0.2,
        align: "center",
      });
      doc.text("Prix /u (€)", leftColumnX + tableWidth * 0.7, tableTop, {
        width: tableWidth * 0.15,
        align: "right",
      });
      doc.text("Total (€)", leftColumnX + tableWidth * 0.85, tableTop, {
        width: tableWidth * 0.15,
        align: "right",
      });

      // Ligne de séparation
      doc
        .moveTo(leftColumnX, tableTop + 20)
        .lineTo(leftColumnX + tableWidth, tableTop + 20)
        .stroke();

      // Données du tableau
      doc.font("Helvetica");
      doc.text(transaction.designation, leftColumnX, tableTop + 30, {
        width: tableWidth * 0.35,
        align: "left",
      });
      doc.text(
        transaction.weight.toString(),
        leftColumnX + tableWidth * 0.35,
        tableTop + 30,
        { width: tableWidth * 0.15, align: "center" }
      );
      doc.text(
        transaction.carats,
        leftColumnX + tableWidth * 0.5,
        tableTop + 30,
        { width: tableWidth * 0.2, align: "center" }
      );
      doc.text(
        `${transaction.unitPrice}`,
        leftColumnX + tableWidth * 0.7,
        tableTop + 30,
        { width: tableWidth * 0.15, align: "right" }
      );
      doc.text(
        `${transaction.amount}`,
        leftColumnX + tableWidth * 0.85,
        tableTop + 30,
        { width: tableWidth * 0.15, align: "right" }
      );

      // Ligne de séparation
      doc
        .moveTo(leftColumnX, tableTop + 50)
        .lineTo(leftColumnX + tableWidth, tableTop + 50)
        .stroke();

      // Total
      doc.moveDown(3);
      doc
        .font("Helvetica-Bold")
        .text(`Total TTC : ${transaction.amount} €`, { align: "right" });

      // Informations supplémentaires
      doc.moveDown(2);
      doc.font("Helvetica");
      doc.text(`Date de la transaction : ${formattedDate}`);
      doc.text(`Mode de paiement : ${transaction.paiement}`);
      doc.text(`Facture n° : ${transaction.orderNumber}`);
      doc.text(`Lieu : ${transaction.location || "Non spécifié"}`);
    } else if (type === "retractation") {
      // Générer le formulaire de rétractation
      doc
        .fontSize(24)
        .font("Helvetica-Bold")
        .text("FORMULAIRE DE RÉTRACTATION", { align: "center" });
      doc.moveDown(2);

      doc.fontSize(12).font("Helvetica-Bold").text("À l'attention de :");
      doc.font("Helvetica").text(`GOLD NORD`);
      doc.text(`85 bis avenue de France 59600 Maubeuge`);
      doc.moveDown();

      doc.text(
        `Je soussigné(e) ${transaction.clientName}, demeurant au ${transaction.adresse} ${transaction.codePostal} ${transaction.ville}, vous informe par la présente que je me rétracte du contrat de vente suivant :`
      );
      doc.moveDown();

      doc.text(`- Nature du bien : ${transaction.designation}`);
      doc.text(`- Poids : ${transaction.weight} g`);
      doc.text(`- Carats : ${transaction.carats}`);
      doc.text(`- Date de la vente : ${formattedDate}`);
      doc.text(`- Montant : ${transaction.amount} €`);
      doc.text(`- Facture n° : ${transaction.orderNumber}`);
      doc.moveDown(2);

      doc.text(
        `Fait à ${transaction.location || "Maubeuge"}, le ${formattedDate}`
      );
      doc.moveDown(2);

      doc.text("Signature du client : __________________________");
      doc.moveDown();
    }

    doc.end();
  });
}
