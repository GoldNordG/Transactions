import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import TransactionSearch from "./TransactionSearch";

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const { data: session } = useSession();

  const fetchTransactions = async (queryParams = {}) => {
    try {
      setLoading(true);

      // Construire l'URL avec les paramètres de requête
      let url = "/api/transactions";
      const params = new URLSearchParams();

      // Ajouter les filtres à l'URL si présents
      if (queryParams.location) params.append("location", queryParams.location);
      if (queryParams.startDate)
        params.append("startDate", queryParams.startDate);
      if (queryParams.endDate) params.append("endDate", queryParams.endDate);
      if (queryParams.carats) params.append("carats", queryParams.carats);

      // Ajouter les paramètres à l'URL s'il y en a
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const { data } = await axios.get(url);
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
      fetchTransactions(filters);
    }
  }, [session, filters]);

  const handleSearch = (searchFilters) => {
    setFilters(searchFilters);
    fetchTransactions(searchFilters);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Calculer les totaux pour les transactions affichées
  const calculateTotals = () => {
    if (!transactions.length)
      return { totalWeight: 0, totalAmount: 0, count: 0 };

    return transactions.reduce(
      (acc, transaction) => {
        return {
          totalWeight: acc.totalWeight + parseFloat(transaction.weight),
          totalAmount: acc.totalAmount + parseFloat(transaction.amount),
          count: acc.count + 1,
        };
      },
      { totalWeight: 0, totalAmount: 0, count: 0 }
    );
  };

  const totals = calculateTotals();

  if (loading && !transactions.length)
    return <p>Chargement des transactions...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h2>Liste des Transactions</h2>

      {/* Afficher le composant de recherche uniquement pour les administrateurs */}
      {session?.user?.role === "admin" && (
        <TransactionSearch onSearch={handleSearch} />
      )}

      {/* Afficher les totaux des transactions */}
      <div className="transaction-stats">
        <div className="stat-box">
          <span className="stat-label">Nombre de transactions</span>
          <span className="stat-value">{totals.count}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Poids total</span>
          <span className="stat-value">{totals.totalWeight.toFixed(2)} g</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Montant total</span>
          <span className="stat-value">{totals.totalAmount.toFixed(2)} €</span>
        </div>
      </div>

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

      <style jsx>{`
        .transaction-stats {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }
        .stat-box {
          background-color: #f0f8ff;
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 10px 15px;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .stat-label {
          font-size: 14px;
          color: #555;
        }
        .stat-value {
          font-size: 18px;
          font-weight: bold;
          margin-top: 5px;
        }
        .table-responsive {
          overflow-x: auto;
          margin-top: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th,
        td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f2f2f2;
          position: sticky;
          top: 0;
        }
        tr:hover {
          background-color: #f5f5f5;
        }
      `}</style>
    </div>
  );
}
