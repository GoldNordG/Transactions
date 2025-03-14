import PDFDocument from "pdfkit";
import fs from "fs";

export function generatePDF(transaction) {
  const doc = new PDFDocument();
  const filePath = `./data/transaction_${transaction.id}.pdf`;

  console.log("Generating PDF at:", filePath);

  const writeStream = fs.createWriteStream(filePath);
  writeStream.on("finish", () => {
    console.log("PDF generated successfully at:", filePath);
  });

  doc.pipe(writeStream);

  doc.fontSize(25).text("Confirmation de votre transaction", {
    align: "center",
  });

  doc.moveDown();
  doc.fontSize(16).text(`Bonjour ${transaction.clientName},`);
  doc.moveDown();
  doc.text(`Votre transaction a été enregistrée avec succès.`);
  doc.moveDown();
  doc.text(`Détails de la transaction :`);
  doc.text(`- Date : ${transaction.date}`);
  doc.text(`- Numéro d’ordre : ${transaction.orderNumber}`);
  doc.text(`- Montant : ${transaction.amount}€`);
  doc.moveDown();
  doc.text(`Merci pour votre confiance !`);

  doc.end();

  return filePath;
}
