import { useEffect, useState } from "react";
import axios from "axios";

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data } = await axios.get("/api/transactions");
      setTransactions(data);
    };
    fetchTransactions();
  }, []);

  return (
    <div>
      <h2>Liste des Transactions</h2>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            {transaction.clientName} - {transaction.amount}€
          </li>
        ))}
      </ul>
    </div>
  );
}
