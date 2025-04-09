import PDFDocument from "pdfkit";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function generatePDF(transaction, type = "facture") {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
    doc.on("error", reject);

    const formattedDate = format(new Date(transaction.date), "dd/MM/yyyy", {
      locale: fr,
    });

    if (type === "facture") {
      // Générer la facture
      doc.fontSize(25).text("FACTURE DE VENTE D'OR", { align: "center" });
      doc.moveDown();

      // Informations du vendeur
      doc.fontSize(16).text("Vendeur (professionnel) :", { underline: true });
      doc.text(`Nom de l'entreprise : GOLDNORD`);
      doc.text(`Adresse : [Adresse complète]`);
      doc.text(`SIRET : 492 735 741 00026- RCS 411 034 549`);
      doc.text(`Téléphone : 03 27 59 80 76`);
      doc.text(`E-mail : administrateur@goldnord.fr`);
      doc.moveDown();

      // Informations de l'acheteur
      doc.fontSize(16).text("Acheteur (client) :", { underline: true });
      doc.text(`Nom : Mr/Mme ${transaction.clientName}`);
      doc.text(`Téléphone : ${transaction.phone || "Non spécifié"}`);
      doc.text(`E-mail : ${transaction.clientMail || "Non spécifié"}`);
      doc.moveDown();

      // Détails de la transaction
      doc.fontSize(16).text("DÉTAIL DE LA TRANSACTION :", { underline: true });
      doc.text(`Désignation du bien : ${transaction.designation}`);
      doc.text(`Poids (g) : ${transaction.weight}`);
      doc.text(`Titre (carats) : ${transaction.carats}`);
      doc.text(`Prix unitaire (EUR) : ${transaction.unitPrice} €`);
      doc.text(`Montant (EUR) : ${transaction.amount} €`);
      doc.moveDown();
      doc.text(`Total TTC : ${transaction.amount} €`);
      doc.moveDown();

      // Informations supplémentaires
      doc.text(`Date de la transaction : ${formattedDate}`);
      doc.text(`Mode de paiement : ${transaction.paiement}`);
      doc.text(`Facture n° : ${transaction.orderNumber}`);
      doc.text(`Lieu : ${transaction.location || "Non spécifié"}`);
      doc.moveDown();
    } else if (type === "retractation") {
      // Générer le formulaire de rétractation
      doc.fontSize(25).text("FORMULAIRE DE RÉTRACTATION", { align: "center" });
      doc.moveDown();

      doc.text("À l'attention de :");
      doc.text(`GOLDNORD`);
      doc.text(`[Adresse complète]`);
      doc.moveDown();
      doc.text(
        `Je soussigné(e) Mr/Mme ${transaction.clientName}, demeurant au ${transaction.adresse} ${transaction.codePostal} ${transaction.ville}, vous informe par la présente que je me rétracte du contrat de vente suivant :`
      );
      doc.moveDown();
      doc.text(`- Nature du bien : ${transaction.designation}`);
      doc.text(`- Poids : ${transaction.weight} g`);
      doc.text(`- Carats : ${transaction.carats}`);
      doc.text(`- Date de la vente : ${formattedDate}`);
      doc.text(`- Montant : ${transaction.amount} €`);
      doc.text(`- Facture n° : ${transaction.orderNumber}`);
      doc.moveDown();
      doc.text(
        `Fait à ${transaction.location || "[Ville]"}, le ${formattedDate}`
      );
      doc.moveDown();
      doc.text("Signature du client : __________________________");
      doc.moveDown();
    }

    doc.end();
  });
}
