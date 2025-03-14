import nodemailer from "nodemailer";

export async function sendEmail(to, subject, text, attachmentPath) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: `"Gold Nord" <${process.env.EMAIL_USER}>`, // adresse de l'expéditeur
    to: to, // liste des destinataires
    subject: subject, // Sujet de l'e-mail
    text: text, // texte brut du corps de l'e-mail
    attachments: [
      {
        filename: `transaction.pdf`,
        path: attachmentPath,
        contentType: "application/pdf",
      },
    ],
  });

  console.log("Message sent: %s", info.messageId);
}
