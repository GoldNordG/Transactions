import PDFDocument from "pdfkit";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function generatePDF(transaction) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];

    console.log("Generating PDF for transaction:", transaction.id);

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
    doc.on("error", reject);

    const formattedDate = format(new Date(transaction.date), "dd/MM/yyyy", {
      locale: fr,
    });

    doc.fontSize(25).text("Confirmation de votre transaction", {
      align: "center",
    });

    doc.moveDown();
    doc.fontSize(16).text(`Bonjour ${transaction.clientName},`);
    doc.moveDown();
    doc.text(`Votre transaction a été enregistrée avec succès.`);
    doc.moveDown();
    doc.text(`Détails de la transaction :`);
    doc.text(`- Date : ${formattedDate}`);
    doc.text(`- Numéro d’ordre : ${transaction.orderNumber}`);
    doc.text(`- Montant : ${transaction.amount}€`);
    doc.moveDown();
    doc.text(`Merci pour votre confiance !`);

    doc.end();
  });
}
