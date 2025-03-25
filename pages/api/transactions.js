import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../mailer"; // Importer la fonction d'envoi d'e-mail
import { generatePDF } from "../pdfGenerator"; // Importer la fonction de génération de PDF
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res
      .status(401)
      .json({ message: "Non authentifié. Redirection vers la page de login." });
  }

  if (req.method === "POST") {
    const { date, clientName, clientMail, orderNumber, amount, location } =
      req.body;

    console.log("Request body:", req.body);

    // Valider les données
    if (
      !date ||
      !clientName ||
      !clientMail ||
      !orderNumber ||
      !amount ||
      !location
    ) {
      console.error("Validation error: Missing required fields");
      return res
        .status(400)
        .json({ message: "Tous les champs sont obligatoires" });
    }

    console.log("Data being sent to Prisma:", {
      date: new Date(date),
      clientName,
      clientMail,
      orderNumber,
      amount: parseFloat(amount),
      location,
    });

    // Ajouter la nouvelle transaction
    const newTransaction = await prisma.transaction.create({
      data: {
        date: new Date(date),
        clientName,
        clientMail,
        orderNumber,
        amount: parseFloat(amount),
        location,
        userId: session.user.id, // Associer la transaction à l'utilisateur connecté
      },
    });

    console.log("Transaction saved successfully");

    // Générer le PDF en mémoire
    console.log("Generating PDF for transaction:", newTransaction);
    const pdfBuffer = await generatePDF(newTransaction);
    console.log("PDF generated in memory");

    // Générer le lien de validation
    const validationLink = `http://localhost:3000/api/validate-transaction?id=${newTransaction.id}`;

    // Formater la date
    const formattedDate = format(new Date(date), "dd/MM/yyyy", {
      locale: fr,
    });

    // Envoyer un e-mail au client avec le PDF en pièce jointe et le lien de validation
    const subject = "Confirmation de votre transaction";
    const text = `Bonjour ${clientName},\n\nVotre transaction a été enregistrée avec succès.\n\nDétails de la transaction :\n- Date : ${formattedDate}\n- Numéro d’ordre : ${orderNumber}\n- Montant : ${amount}€\n\nMerci pour votre confiance !\n\nVeuillez valider votre transaction en cliquant sur le lien suivant : ${validationLink}`;
    const filename = `transaction_${orderNumber}.pdf`;

    console.log("Sending email to:", clientMail);
    try {
      await sendEmail(clientMail, subject, text, pdfBuffer, filename);
      console.log("Email sent successfully");
    } catch (emailError) {
      console.error("Error sending email:", emailError);
    }

    // Envoyer un e-mail à vous-même avec la facture de la transaction
    const adminEmail = "goldnord.digital@gmail.com"; // Remplacez par votre adresse e-mail
    const adminSubject = `Nouvelle transaction enregistrée : ${orderNumber}`;
    const adminText = `Une nouvelle transaction a été enregistrée.\n\nDétails de la transaction :\n- Date : ${formattedDate}\n- Nom du client : ${clientName}\n- Email du client : ${clientMail}\n- Numéro d’ordre : ${orderNumber}\n- Montant : ${amount}€\n\nLa facture est jointe à cet e-mail.`;

    console.log("Sending email to admin:", adminEmail);
    try {
      await sendEmail(adminEmail, adminSubject, adminText, pdfBuffer, filename);
      console.log("Admin email sent successfully");
    } catch (adminEmailError) {
      console.error("Error sending admin email:", adminEmailError);
    }

    // Répondre avec la nouvelle transaction
    res.status(201).json(newTransaction);
  } else if (req.method === "GET") {
    try {
      let transactions;

      if (session.user.role === "admin") {
        // L'administrateur peut voir toutes les transactions
        transactions = await prisma.transaction.findMany();
      } else if (session.user.role === "agency") {
        // Les agences ne peuvent voir que leurs propres transactions
        transactions = await prisma.transaction.findMany({
          where: {
            userId: session.user.id,
          },
        });
      } else {
        return res.status(403).json({ message: "Accès interdit" });
      }

      res.status(200).json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des transactions" });
    }
  } else {
    res.status(405).json({ message: "Méthode non autorisée" });
  }
}
