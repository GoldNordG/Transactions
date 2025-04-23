import PDFDocument from "pdfkit";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import path from "path";

export function generatePDF(transaction, type = "facture") {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      margins: { top: 100, bottom: 100, left: 80, right: 80 },
      bufferPages: true,
    });

    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    const backgroundPath = path.join(
      process.cwd(),
      "public",
      "images",
      "goldnord-letterhead.jpg"
    );

    try {
      let isFirstPage = true;
      doc.on("pageAdded", () => {
        if (isFirstPage) {
          isFirstPage = false;
          return;
        }
        doc.image(backgroundPath, 0, 0, {
          width: doc.page.width,
          height: doc.page.height,
        });
      });
    } catch (error) {
      console.error("Erreur chargement image:", error);
    }

    try {
      // Ajout de l'image d'arrière-plan sur la première page
      doc.image(backgroundPath, 0, 0, {
        width: doc.page.width,
        height: doc.page.height,
      });

      // Pour les pages suivantes, on utilise un événement mais SANS récursion
      let isFirstPage = true;
      doc.on("pageAdded", () => {
        if (isFirstPage) {
          isFirstPage = false;
          return; // Ne pas ajouter l'arrière-plan sur la première page (déjà fait)
        }

        doc.image(backgroundPath, 0, 0, {
          width: doc.page.width,
          height: doc.page.height,
        });
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

      // Colonne gauche - Acheteur
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Acheteur (professionnel) :", leftColumnX);
      doc
        .font("Helvetica")
        .text("Nom de l'entreprise : GOLD NORD", leftColumnX);
      doc.text(`SIRET : 492 735 741 00026`, leftColumnX);
      doc.text(`RCS Valenciennes 411 034 549`, leftColumnX);
      doc.text(`Téléphone : 03 27 59 80 76`, leftColumnX);
      doc.text(`E-mail : administrateur@goldnord.fr`, leftColumnX);
      doc.text(`Adresse : 85 bis avenue de France`, leftColumnX);
      doc.text(`59600 Maubeuge`, leftColumnX);

      // Colonne droite - Vendeur
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Vendeur (client) :", rightColumnX);
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
      doc.text(
        `Adresse : ${transaction.adresse || "Non spécifié"}`,
        rightColumnX
      );
      doc.text(
        `${transaction.codePostal || ""} ${transaction.ville || ""}`,
        rightColumnX
      );

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
      doc.text("Prix /g (€)", leftColumnX + tableWidth * 0.7, tableTop, {
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

      // Données du tableau - utiliser la liste d'items
      let yPosition = tableTop + 30;
      const lineHeight = 20;

      // S'assurer que transaction.items existe
      if (transaction.items && transaction.items.length > 0) {
        transaction.items.forEach((item) => {
          doc.font("Helvetica");
          doc.text(item.designation, leftColumnX, yPosition, {
            width: tableWidth * 0.35,
            align: "left",
          });
          doc.text(
            item.weight.toString(),
            leftColumnX + tableWidth * 0.35,
            yPosition,
            { width: tableWidth * 0.15, align: "center" }
          );
          doc.text(item.carats, leftColumnX + tableWidth * 0.5, yPosition, {
            width: tableWidth * 0.2,
            align: "center",
          });
          doc.text(
            `${item.unitPrice}`,
            leftColumnX + tableWidth * 0.7,
            yPosition,
            { width: tableWidth * 0.15, align: "right" }
          );
          doc.text(
            `${(parseFloat(item.weight) * parseFloat(item.unitPrice)).toFixed(
              2
            )}`,
            leftColumnX + tableWidth * 0.85,
            yPosition,
            { width: tableWidth * 0.15, align: "right" }
          );

          yPosition += lineHeight;
        });
      } else {
        // Fallback si aucun item n'est disponible
        doc.font("Helvetica");
        doc.text("Aucun article spécifié", leftColumnX, yPosition, {
          width: tableWidth,
          align: "center",
        });
        yPosition += lineHeight;
      }

      // Ligne de séparation après les items
      doc
        .moveTo(leftColumnX, yPosition + 10)
        .lineTo(leftColumnX + tableWidth, yPosition + 10)
        .stroke();

      // Ajuster la position Y pour le total
      yPosition += 30;

      // Affichage du total en gros et en gras, bien visible
      doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .text(`Total TTC : ${transaction.amount} €`, leftColumnX, yPosition, {
          width: tableWidth,
          align: "right",
        });

      // Espacement après le total
      yPosition += 40;

      // Section finale avec les informations sur toute la largeur
      doc.fontSize(12).font("Helvetica");

      // Informations de transaction sur toute la largeur
      doc.text(
        `Date de la transaction : ${formattedDate}`,
        leftColumnX,
        yPosition
      );
      yPosition += 20;
      doc.text(
        `Mode de paiement : ${transaction.paiement}`,
        leftColumnX,
        yPosition
      );
      yPosition += 20;
      doc.text(
        `Facture n° : ${transaction.factureNumber}`,
        leftColumnX,
        yPosition
      );
      yPosition += 20;
      doc.text(
        `Lieu : ${transaction.location || "Non spécifié"}`,
        leftColumnX,
        yPosition
      );
    } else if (type === "retractation") {
      // Définir les marges pour la section rétractation
      const leftColumnX = 80;
      const tableWidth = doc.page.width - 160;

      // Formulaire de rétractation existant...
      doc
        .fontSize(20)
        .font("Helvetica-Bold")
        .text("FORMULAIRE DE RÉTRACTATION", { align: "center" });
      doc.moveDown(0.3);

      doc.fontSize(12).font("Helvetica-Bold").text("À l'attention de :");
      doc.font("Helvetica").text(`GOLD NORD`);
      doc.text(`85 bis avenue de France 59600 Maubeuge`);
      doc.moveDown();

      doc.text(
        `Je soussigné(e) ${transaction.clientName}, demeurant au ${
          transaction.adresse || ""
        } ${transaction.codePostal || ""} ${
          transaction.ville || ""
        }, vous informe par la présente que je me rétracte du contrat de vente suivant :`
      );
      doc.moveDown();

      // Si nous avons plusieurs items, créer une liste
      if (transaction.items && transaction.items.length > 0) {
        transaction.items.forEach((item, index) => {
          doc.text(`- Article ${index + 1} : ${item.designation}`);
          doc.text(`  Poids : ${item.weight} g`);
          doc.text(`  Carats : ${item.carats}`);
          doc.text(`  Prix unitaire : ${item.unitPrice} €/g`);
          doc.text(
            `  Sous-total : ${(
              parseFloat(item.weight) * parseFloat(item.unitPrice)
            ).toFixed(2)} €`
          );
          doc.moveDown(0.5);
        });
      } else {
        // Fallback
        doc.text(
          `- Nature du bien : ${transaction.designation || "Non spécifié"}`
        );
        doc.text(`- Poids : ${transaction.weight || 0} g`);
        doc.moveDown();
      }

      doc.moveDown();
      doc.text(`Montant total : ${transaction.amount} €`);
      doc.text(`Date de la vente : ${formattedDate}`);
      doc.text(`Facture n° : ${transaction.factureNumber}`);
      doc.moveDown(2);

      // Ajouter le coupon de rétractation
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Coupon de rétractation", { align: "center" });
      doc
        .moveTo(leftColumnX, doc.y + 10)
        .lineTo(leftColumnX + tableWidth, doc.y + 10)
        .stroke();
      doc.moveDown(1);

      doc.font("Helvetica").text("(Découper ici)", { align: "center" });
      doc.moveDown(2);

      doc.text(
        `Si vous souhaitez exercer votre droit de rétractation dans les 48 heures à compter de la signature du contrat,`
      );
      doc.text(
        `vous pouvez utiliser le formulaire détachable prévu à cet effet.`
      );
      doc.text(
        `Ce formulaire ne s'applique pas à la vente d'Or investissement.`
      );
      doc.moveDown();

      doc.text(
        `Je soussigné(e) Mr/Mme ${transaction.clientName}, demeurant à ${transaction.adresse},`
      );
      doc.text(
        `vous informe par la présente que je me rétracte du contrat de vente mentionné ci-dessus.`
      );
      doc.moveDown();

      doc.text(`Date de la vente : ${formattedDate}`);
      doc.text(`Numéro d'ordre : ${transaction.orderNumber}`);
      doc.text(`Fait à ${transaction.location}, le ${formattedDate}`);
    }

    // Numérotation des pages - à faire à la fin avant doc.end()
    // Récupérer le nombre total de pages
    const totalPages = doc.bufferedPageRange().count;

    for (let i = 0; i < totalPages; i++) {
      doc.switchToPage(i);

      // Positionner le numéro de page dans le pied de page, mais plus haut
      // pour éviter qu'il ne se retrouve sur une autre page
      doc.fontSize(10).text(
        `Page ${i + 1}`,
        doc.page.width - 120,
        doc.page.height - 70, // Augmenter la distance du bas
        {
          align: "right",
          lineBreak: false, // Empêcher le saut de ligne
        }
      );
    }
    // Terminer le document
    doc.end();
  });
}
