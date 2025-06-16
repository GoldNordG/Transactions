import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function AgencyBonusReport() {
  const [agencyStats, setAgencyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: getFirstDayOfMonth(),
    endDate: getLastDayOfMonth(),
  });
  const { data: session, status } = useSession();

  // Fonction pour obtenir le premier jour du mois courant
  function getFirstDayOfMonth() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];
  }

  // Fonction pour obtenir le dernier jour du mois courant
  function getLastDayOfMonth() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];
  }

  // Fonction pour récupérer les statistiques par agence
  const fetchAgencyStats = async () => {
    try {
      if (status !== "authenticated" || !session?.user) {
        return;
      }

      // Vérifier si l'utilisateur est admin ou superadmin
      const isAdminOrSuperAdmin =
        session.user.role === "admin" || session.user.role === "superadmin";

      if (!isAdminOrSuperAdmin) {
        setError("Vous n'avez pas les droits pour accéder à cette page.");
        setLoading(false);
        return;
      }

      setLoading(true);

      // Construction de l'URL avec les paramètres de date
      let url = "/api/agencies/stats";
      const params = new URLSearchParams();

      if (dateRange.startDate) params.append("startDate", dateRange.startDate);
      if (dateRange.endDate) params.append("endDate", dateRange.endDate);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const { data } = await axios.get(url, { timeout: 30000 });
      setAgencyStats(data);
      setError(null);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des statistiques d'agence",
        error
      );
      setError("Impossible de charger les statistiques. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      fetchAgencyStats();
    } else if (status === "unauthenticated") {
      setError("Vous devez être connecté pour accéder à cette page.");
    }
  }, [session, status, dateRange]);

  const handleDateChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value,
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  // Si la session est en cours de chargement
  if (status === "loading") {
    return <p>Chargement de la session...</p>;
  }

  // Si l'utilisateur n'est pas connecté
  if (status === "unauthenticated") {
    return <p>Veuillez vous connecter pour accéder à cette page.</p>;
  }

  // Vérifier si l'utilisateur est admin ou superadmin
  const isAdminOrSuperAdmin =
    session?.user?.role === "admin" || session?.user?.role === "superadmin";

  if (!isAdminOrSuperAdmin) {
    return <p>Vous n&apos;avez pas les droits pour accéder à cette page.</p>;
  }

  return (
    <div className="agency-bonus-container">
      <h2>Rapport des Primes par Agence</h2>

      <div className="date-filter">
        <div className="filter-row">
          <div className="filter-item">
            <label htmlFor="startDate">Date de début:</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
            />
          </div>
          <div className="filter-item">
            <label htmlFor="endDate">Date de fin:</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
            />
          </div>
          <button className="apply-filter" onClick={fetchAgencyStats}>
            Appliquer
          </button>
        </div>
      </div>

      {loading && (
        <p className="loading-indicator">Chargement des statistiques...</p>
      )}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && agencyStats.length === 0 && (
        <p>Aucune donnée disponible pour la période sélectionnée.</p>
      )}

      {!loading && !error && agencyStats.length > 0 && (
        <div className="reports-container">
          {agencyStats.map((agency) => (
            <div key={agency.location} className="agency-card">
              <h3>{agency.location}</h3>

              <div className="stats-summary">
                <div className="stat-item">
                  <span className="stat-label">Total des transactions:</span>
                  <span className="stat-value">{agency.transactionCount}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Poids total:</span>
                  <span className="stat-value">
                    {agency.totalWeight.toFixed(2)} g
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Montant total:</span>
                  <span className="stat-value primary">
                    {formatCurrency(agency.totalAmount)}
                  </span>
                </div>
              </div>

              <h4>Répartition par carats</h4>
              <div className="table-responsive">
                <table className="carat-table">
                  <thead>
                    <tr>
                      <th>Carats</th>
                      <th>Poids (g)</th>
                      <th>Montant (€)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agency.caratStats.map((caratStat) => (
                      <tr key={caratStat.carats}>
                        <td>{caratStat.carats}</td>
                        <td>{caratStat.weight.toFixed(2)} g</td>
                        <td>{formatCurrency(caratStat.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {agency.vendorStats && agency.vendorStats.length > 0 && (
                <>
                  <h4>Performance des vendeurs</h4>
                  <div className="table-responsive">
                    <table className="vendor-table">
                      <thead>
                        <tr>
                          <th>Vendeur</th>
                          <th>Transactions</th>
                          <th>Poids total (g)</th>
                          <th>Montant total (€)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {agency.vendorStats.map((vendor) => (
                          <tr key={vendor.userId}>
                            <td>{vendor.userEmail}</td>
                            <td>{vendor.transactionCount}</td>
                            <td>{vendor.totalWeight.toFixed(2)} g</td>
                            <td>{formatCurrency(vendor.totalAmount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .agency-bonus-container {
          padding: 20px;
        }

        .date-filter {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .filter-row {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          align-items: flex-end;
        }

        .filter-item {
          display: flex;
          flex-direction: column;
          min-width: 200px;
        }

        .filter-item label {
          margin-bottom: 5px;
          font-weight: 500;
        }

        .filter-item input {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .apply-filter {
          background-color: #4caf50;
          color: white;
          border: none;
          padding: 9px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }

        .apply-filter:hover {
          background-color: #45a049;
        }

        .loading-indicator {
          text-align: center;
          padding: 20px;
          color: #666;
        }

        .error-message {
          color: #d32f2f;
          background-color: #ffebee;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .reports-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
          gap: 20px;
        }

        .agency-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 20px;
          border: 1px solid #eee;
        }

        .agency-card h3 {
          margin-top: 0;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
          color: #333;
        }

        .stats-summary {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 20px;
        }

        .stat-item {
          background-color: #f8f8f8;
          border-radius: 6px;
          padding: 12px 15px;
          flex: 1;
          min-width: 120px;
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 14px;
          color: #666;
          margin-bottom: 5px;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }

        .stat-value.primary {
          color: #2e7d32;
        }

        .table-responsive {
          overflow-x: auto;
          margin-bottom: 20px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }

        th,
        td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        th {
          background-color: #f5f5f5;
          font-weight: 500;
        }

        tr:hover {
          background-color: #f9f9f9;
        }

        h4 {
          margin-top: 25px;
          margin-bottom: 10px;
          color: #444;
        }
      `}</style>
    </div>
  );
}
