// pages/api/pdfGenerator.js
import { generatePDF } from "../../lib/generatePDF"; // déplace la fonction ici (voir ci-dessous)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { transaction, type } = req.body;

  if (!transaction) {
    return res.status(400).json({ error: "Missing transaction data" });
  }

  try {
    const pdfBuffer = await generatePDF(transaction, type || "facture");
    const base64PDF = pdfBuffer.toString("base64");

    res.status(200).json({ success: true, pdfBase64: base64PDF });
  } catch (error) {
    console.error("Erreur de génération PDF:", error);
    res.status(500).json({ error: "PDF generation failed" });
  }
}
