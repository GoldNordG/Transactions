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
      doc.text(`Nom de l'entreprise : [Nom]`);
      doc.text(`Adresse : [Adresse complète]`);
      doc.text(`SIRET : [Numéro]`);
      doc.text(`Téléphone : [Numéro]`);
      doc.text(`E-mail : [Adresse]`);
      doc.moveDown();

      // Informations de l'acheteur
      doc.fontSize(16).text("Acheteur (client) :", { underline: true });
      doc.text(`Nom : ${transaction.clientName}`);
      doc.text(`Adresse : [Adresse complète]`);
      doc.text(`Téléphone : [Numéro]`);
      doc.text(`E-mail : ${transaction.clientMail}`);
      doc.moveDown();

      // Détails de la transaction
      doc.fontSize(16).text("DÉTAIL DE LA TRANSACTION :", { underline: true });
      doc.text(`Désignation du bien : [Ex. : Bague en or]`);
      doc.text(`Poids (g) : [5]`);
      doc.text(`Titre (carats) : [18K]`);
      doc.text(`Prix unitaire (EUR) : [XX EUR/g]`);
      doc.text(`Montant (EUR) : ${transaction.amount}€`);
      doc.moveDown();
      doc.text(`Total TTC : ${transaction.amount}€`);
      doc.moveDown();

      // Informations supplémentaires
      doc.text(`Date de la transaction : ${formattedDate}`);
      doc.text(`Mode de paiement : [Espèces / Virement / Chèque]`);
      doc.text(`Facture n° : ${transaction.orderNumber}`);
      doc.moveDown();
    } else if (type === "retractation") {
      // Générer le formulaire de rétractation
      doc.fontSize(25).text("FORMULAIRE DE RÉTRACTATION", { align: "center" });
      doc.moveDown();

      doc.text("À l'attention de :");
      doc.text(`[Nom de l'entreprise]`);
      doc.text(`[Adresse complète]`);
      doc.moveDown();
      doc.text(
        `Je soussigné(e) ${transaction.clientName}, demeurant à [Adresse complète], vous informe par la présente que je me rétracte du contrat de vente suivant :`
      );
      doc.moveDown();
      doc.text(`- Nature du bien : [Exemple : bijou en or, pièce]`);
      doc.text(`- Date de la vente : ${formattedDate}`);
      doc.text(`- Montant : ${transaction.amount}€`);
      doc.text(`- Facture n° : ${transaction.orderNumber}`);
      doc.moveDown();
      doc.text(`Fait à [Ville], le ${formattedDate}`);
      doc.moveDown();
      doc.text("Signature du client : __________________________");
      doc.moveDown();
    }

    doc.end();
  });
}
