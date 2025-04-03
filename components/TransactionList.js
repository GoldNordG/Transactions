import { useEffect, useState } from "react";
import axios from "axios";

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get("/api/transactions");
      setTransactions(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des transactions", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div>
      <h2>Liste des Transactions</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Numéro d’ordre</th>
            <th>Nom du client</th>
            <th>Mail</th>
            <th>Téléphone</th>
            <th>Désignation</th>
            <th>Poids (g)</th>
            <th>Carats</th>
            <th>Prix unitaire (EUR)</th>
            <th>Montant total (EUR)</th>
            <th>Lieu</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{formatDate(transaction.date)}</td>
              <td>{transaction.orderNumber}</td>
              <td>{transaction.clientName}</td>
              <td>{transaction.clientMail || "Non spécifié"}</td>
              <td>{transaction.phone || "Non spécifié"}</td>
              <td>{transaction.designation}</td>
              <td>{transaction.weight} g</td>
              <td>{transaction.carats}</td>
              <td>{transaction.unitPrice} €</td>
              <td>{transaction.amount} €</td>
              <td>{transaction.location || "Non spécifié"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
