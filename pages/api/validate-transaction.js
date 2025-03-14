import fs from "fs";
import path from "path";

const transactionsFilePath = path.join(
  process.cwd(),
  "data",
  "transactions.json"
);

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "Transaction ID is required" });
    }

    // Lire les transactions existantes
    let transactions = [];
    if (fs.existsSync(transactionsFilePath)) {
      transactions = JSON.parse(fs.readFileSync(transactionsFilePath, "utf-8"));
    }

    // Trouver et valider la transaction
    const transactionIndex = transactions.findIndex((t) => t.id === id);
    if (transactionIndex === -1) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    transactions[transactionIndex].validated = true;

    // Enregistrer les transactions mises à jour dans le fichier
    fs.writeFileSync(transactionsFilePath, JSON.stringify(transactions));
    console.log("Transaction validated successfully");

    // Rediriger vers la page de remerciement
    res.writeHead(302, { Location: "/thank-you" });
    res.end();
  } catch (error) {
    console.error("Erreur dans l’API validate-transaction :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}
