import PDFDocument from "pdfkit";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import path from "path";

// ✅ fonction utilitaire de formatage
const formatNumber = (n) => {
  const num = Number(n);
  return Number.isInteger(num) ? num.toString() : num.toFixed(2);
};

export function generatePDF(transaction, type = "facture") {
  console.log("=== DEBUG TRANSACTION ===");
  console.log("transaction:", JSON.stringify(transaction, null, 2));
  console.log("transaction.items:", transaction.items);
  console.log("transaction.amount:", transaction.amount);
  console.log("========================");

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
      doc.image(backgroundPath, 0, 0, {
        width: doc.page.width,
        height: doc.page.height,
      });

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
      console.error(
        "Erreur lors du chargement de l'image d'arrière-plan:",
        error
      );
    }

    const formattedDate = format(new Date(transaction.date), "dd/MM/yyyy", {
      locale: fr,
    });

    if (type === "facture") {
      doc
        .fontSize(18)
        .font("Helvetica-Bold")
        .text("FACTURE DE VENTE D'OR", { align: "center" });
      doc.moveDown(2);

      const leftColumnX = 80;
      const rightColumnX = doc.page.width / 2 + 20;

      // Acheteur
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

      // Vendeur
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

      const tableTop = doc.y;
      const tableWidth = doc.page.width - 160;

      // En-têtes
      doc.font("Helvetica-Bold");
      doc.text("Désignation", leftColumnX, tableTop, {
        width: tableWidth * 0.35,
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

      doc
        .moveTo(leftColumnX, tableTop + 20)
        .lineTo(leftColumnX + tableWidth, tableTop + 20)
        .stroke();

      let yPosition = tableTop + 30;
      const lineHeight = 20;

      if (transaction.items && transaction.items.length > 0) {
        transaction.items.forEach((item) => {
          doc.font("Helvetica");
          doc.text(item.designation, leftColumnX, yPosition, {
            width: tableWidth * 0.35,
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

          // ✅ utilise la valeur du formulaire (subtotal), fallback sur calcul
          doc.text(
            formatNumber(
              item.subtotal ?? item.total ?? item.weight * item.unitPrice
            ),
            leftColumnX + tableWidth * 0.85,
            yPosition,
            { width: tableWidth * 0.15, align: "right" }
          );

          yPosition += lineHeight;
        });
      } else {
        doc
          .font("Helvetica")
          .text("Aucun article spécifié", leftColumnX, yPosition, {
            width: tableWidth,
            align: "center",
          });
        yPosition += lineHeight;
      }

      doc
        .moveTo(leftColumnX, yPosition + 10)
        .lineTo(leftColumnX + tableWidth, yPosition + 10)
        .stroke();
      yPosition += 30;

      // ✅ total avec formatage
      doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .text(
          `Total TTC : ${formatNumber(transaction.amount)} €`,
          leftColumnX,
          yPosition,
          {
            width: tableWidth,
            align: "right",
          }
        );

      yPosition += 40;

      doc.fontSize(12).font("Helvetica");
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
      const leftColumnX = 80;
      const tableWidth = doc.page.width - 160;

      doc
        .fontSize(20)
        .font("Helvetica-Bold")
        .text("FORMULAIRE DE RÉTRACTATION", { align: "center" });
      doc.moveDown(0.3);
      doc
        .fontSize(16)
        .font("Helvetica-Bold")
        .text(
          "Contrat de rétractation prévu à l'article L.224-97 du Code de la consommation",
          { align: "center" }
        );
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

      doc.text(`Montant total : ${formatNumber(transaction.amount)} €`);
      doc.text(`Date de la vente : ${formattedDate}`);
      doc.text(`Facture n° : ${transaction.factureNumber}`);
      doc.moveDown(2);

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
        `Si vous souhaitez exercer votre droit de rétractation dans les 48 heures à compter de la réception du contrat,`
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
      doc.text(`Montant total : ${formatNumber(transaction.amount)} €`);
      doc.text(`Fait à ${transaction.location}, le ${formattedDate}`);
    }

    const totalPages = doc.bufferedPageRange().count;
    for (let i = 0; i < totalPages; i++) {
      doc.switchToPage(i);
      doc
        .fontSize(10)
        .text(`Page ${i + 1}`, doc.page.width - 120, doc.page.height - 70, {
          align: "right",
          lineBreak: false,
        });
    }

    doc.end();
  });
}
