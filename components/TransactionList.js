import { useEffect, useState } from "react";
import axios from "axios";
import TransactionForm from "./TransactionForm"; // Import unique

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

      {/* Formulaire d'ajout de transaction (une seule instance) */}
      <TransactionForm onTransactionAdded={fetchTransactions} />

      {/* Tableau des transactions */}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Numéro d’ordre</th>
            <th>Nom du client</th>
            <th>Mail du client</th>
            <th>Montant</th>
            <th>Lieu</th>
            <th>Validée</th> {/* Nouvelle colonne pour l'état de validation */}
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{formatDate(transaction.date)}</td>
              <td>{transaction.orderNumber}</td>
              <td>{transaction.clientName}</td>
              <td>{transaction.clientMail}</td>
              <td>{transaction.amount}€</td>
              <td>{transaction.location || "Non spécifié"}</td>
              <td>{transaction.validated ? "Oui" : "Non"}</td>{" "}
              {/* Afficher l'état de validation */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
