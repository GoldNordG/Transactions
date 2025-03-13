import fs from "fs";
import path from "path";

const transactionsFilePath = path.join(
  process.cwd(),
  "data",
  "transactions.json"
);

export default function handler(req, res) {
  if (req.method === "POST") {
    const { date, clientName, orderNumber, amount } = req.body;
    const newTransaction = {
      id: Date.now(),
      date,
      clientName,
      orderNumber,
      amount,
    };

    const transactions = JSON.parse(
      fs.readFileSync(transactionsFilePath, "utf-8")
    );
    transactions.push(newTransaction);
    fs.writeFileSync(transactionsFilePath, JSON.stringify(transactions));

    res.status(201).json(newTransaction);
  } else if (req.method === "GET") {
    const transactions = JSON.parse(
      fs.readFileSync(transactionsFilePath, "utf-8")
    );
    res.status(200).json(transactions);
  } else {
    res.status(405).end(); // Méthode non autorisée
  }
}
