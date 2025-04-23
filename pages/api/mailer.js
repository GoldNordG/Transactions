// pages/api/mailer.js
import { sendEmail } from "../../lib/mailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { to, subject, text, pdfBufferBase64, filename } = req.body;

  if (!to || !subject || !text || !pdfBufferBase64 || !filename) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const pdfBuffer = Buffer.from(pdfBufferBase64, "base64");
    const info = await sendEmail(to, subject, text, pdfBuffer, filename);
    res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
}
