import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/transactions");
      setTransactions(data);
      setError(null);
    } catch (error) {
      console.error("Erreur lors de la récupération des transactions", error);
      setError("Impossible de charger les transactions. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchTransactions();
    }
  }, [session]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) return <p>Chargement des transactions...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h2>Liste des Transactions</h2>
      {transactions.length === 0 ? (
        <p>Aucune transaction à afficher.</p>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Ordre</th>
                <th>Nom du client</th>
                <th>Prénom du client</th>
                <th>Mail</th>
                <th>Téléphone</th>
                <th>Désignation</th>
                <th>Poids (g)</th>
                <th>Carats</th>
                <th>Prix unitaire (EUR)</th>
                <th>Montant total (EUR)</th>
                <th>Lieu</th>
                {session?.user?.role === "admin" && <th>Vendeur</th>}
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{formatDate(transaction.date)}</td>
                  <td>{transaction.orderNumber}</td>
                  <td>{transaction.clientName}</td>
                  <td>{transaction.clientSurname}</td>
                  <td>{transaction.clientMail || "Non spécifié"}</td>
                  <td>{transaction.phone || "Non spécifié"}</td>
                  <td>{transaction.designation}</td>
                  <td>{transaction.weight} g</td>
                  <td>{transaction.carats}</td>
                  <td>{transaction.unitPrice} €</td>
                  <td>{transaction.amount} €</td>
                  <td>{transaction.location || "Non spécifié"}</td>
                  {session?.user?.role === "admin" && (
                    <td>{transaction.user?.email || "Utilisateur inconnu"}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
