import fs from "fs";
import path from "path";
import { sendEmail } from "../mailer"; // Importer la fonction d'envoi d'e-mail
import { generatePDF } from "../pdfGenerator"; // Importer la fonction de génération de PDF
import { v4 as uuidv4 } from "uuid"; // Importer uuid pour générer des identifiants uniques

const transactionsFilePath = path.join(
  process.cwd(),
  "data",
  "transactions.json"
);

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { date, clientName, clientMail, orderNumber, amount } = req.body;

      // Valider les données
      if (!date || !clientName || !clientMail || !orderNumber || !amount) {
        console.error("Validation error: Missing required fields");
        return res
          .status(400)
          .json({ message: "Tous les champs sont obligatoires" });
      }

      // Lire les transactions existantes
      let transactions = [];
      if (fs.existsSync(transactionsFilePath)) {
        transactions = JSON.parse(
          fs.readFileSync(transactionsFilePath, "utf-8")
        );
      }

      // Ajouter la nouvelle transaction
      const transactionId = uuidv4();
      const newTransaction = {
        id: transactionId,
        date,
        clientName,
        clientMail,
        orderNumber,
        amount,
        validated: false, // Ajouter le champ validated
      };
      transactions.push(newTransaction);

      // Enregistrer les transactions dans le fichier
      fs.writeFileSync(transactionsFilePath, JSON.stringify(transactions));
      console.log("Transaction saved successfully");

      // Générer le PDF
      console.log("Generating PDF for transaction:", newTransaction);
      const pdfPath = generatePDF(newTransaction);
      console.log("PDF generated at:", pdfPath);

      // Générer le lien de validation
      const validationLink = `http://localhost:3000/api/validate-transaction?id=${transactionId}`;

      // Envoyer un e-mail au client avec le PDF en pièce jointe et le lien de validation
      const subject = "Confirmation de votre transaction";
      const text = `Bonjour ${clientName},\n\nVotre transaction a été enregistrée avec succès.\n\nDétails de la transaction :\n- Date : ${date}\n- Numéro d’ordre : ${orderNumber}\n- Montant : ${amount}€\n\nMerci pour votre confiance !\n\nVeuillez valider votre transaction en cliquant sur le lien suivant : ${validationLink}`;

      console.log("Sending email to:", clientMail);
      try {
        await sendEmail(clientMail, subject, text, pdfPath);
        console.log("Email sent successfully");
      } catch (emailError) {
        console.error("Error sending email:", emailError);
      }

      // Répondre avec la nouvelle transaction
      res.status(201).json(newTransaction);
    } else if (req.method === "GET") {
      // Lire les transactions existantes
      let transactions = [];
      if (fs.existsSync(transactionsFilePath)) {
        transactions = JSON.parse(
          fs.readFileSync(transactionsFilePath, "utf-8")
        );
      }

      // Répondre avec la liste des transactions
      res.status(200).json(transactions);
    } else {
      // Méthode non autorisée
      res.status(405).json({ message: "Méthode non autorisée" });
    }
  } catch (error) {
    console.error("Erreur dans l’API transactions :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}
