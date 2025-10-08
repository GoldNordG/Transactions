import { useState } from "react";

export default function TransactionSearch({ onSearch }) {
  const [filters, setFilters] = useState({
    location: "",
    startDate: "",
    endDate: "",
    carats: "",
  });
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const agences = [
    "Maubeuge",
    "Beauvais",
    "Fourmies",
    "Chaumont",
    "Compiegne",
    "Dourdan",
    "Dreux",
    "Aurillac",
    "Saint-Dizier",
    "Saint-Quentin",
    "Puy-En-Velay",
    "Vitry-Le-Francois",
  ];

  const caratsLabels = {
    "MET ARG": "Métal Argenté",
    ARG: "Argent",
    PLAT: "Platinium",
    9: "9K",
    14: "14K",
    18: "18K",
    22: "22K",
    24: "24K",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Appeler la fonction de recherche du parent
    onSearch(filters);

    // Filtrer les paramètres vides pour l'URL
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== "")
    );

    const params = new URLSearchParams(cleanFilters);

    try {
      // Appel API pour récupérer les statistiques agrégées
      const statsUrl = `/api/transactions/stats?${params.toString()}`;
      console.log("URL appelée:", statsUrl);

      const res = await fetch(statsUrl);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Erreur API:", errorText);
        throw new Error(`Erreur API: ${res.status}`);
      }

      const data = await res.json();
      console.log("Données stats reçues:", data);
      setStats(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      setError("Erreur lors de la récupération des statistiques");
      setStats([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({
      location: "",
      startDate: "",
      endDate: "",
      carats: "",
    });
    setStats([]);
    setError(null);
    onSearch({});
  };

  // Calculs des totaux
  const totalWeight = stats.reduce(
    (acc, row) => acc + (row._sum?.weight || 0),
    0
  );
  const totalAmount = stats.reduce(
    (acc, row) => acc + (row._sum?.subtotal || 0),
    0
  );
  const totalTransactions = stats.reduce(
    (acc, row) => acc + (row._count || 0),
    0
  );

  return (
    <div className="search-container">
      <h3>Rechercher des transactions</h3>

      <form onSubmit={handleSubmit}>
        <div className="search-grid">
          {/* Agence */}
          <div className="form-group">
            <label htmlFor="location">Lieu</label>
            <select
              id="location"
              name="location"
              value={filters.location}
              onChange={handleChange}
            >
              <option value="">Toutes les agences</option>
              {agences.map((agence) => (
                <option key={agence} value={agence}>
                  {agence}
                </option>
              ))}
            </select>
          </div>

          {/* Carats */}
          <div className="form-group">
            <label htmlFor="carats">Carats</label>
            <select
              id="carats"
              name="carats"
              value={filters.carats}
              onChange={handleChange}
            >
              <option value="">Tous</option>
              <option value="MET ARG">Métal Argenté</option>
              <option value="ARG">Argent</option>
              <option value="PLAT">Platinium</option>
              <option value="9">9K</option>
              <option value="14">14K</option>
              <option value="18">18K</option>
              <option value="22">22K</option>
              <option value="24">24K</option>
            </select>
          </div>

          {/* Dates */}
          <div className="form-group">
            <label htmlFor="startDate">Date de début</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filters.startDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">Date de fin</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={filters.endDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="button-group">
          <button type="submit" className="search-button" disabled={isLoading}>
            {isLoading ? "Recherche..." : "Rechercher"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="reset-button"
            disabled={isLoading}
          >
            Réinitialiser
          </button>
        </div>
      </form>

      {/* Affichage des erreurs */}
      {error && (
        <div className="error-message">
          <strong>Erreur:</strong> {error}
        </div>
      )}

      {/* Affichage des filtres actifs */}
      {(filters.location ||
        filters.carats ||
        filters.startDate ||
        filters.endDate) && (
        <div className="active-filters">
          <h4>Filtres actifs :</h4>
          <div className="filter-tags">
            {filters.location && (
              <span className="filter-tag">
                Lieu: {filters.location}
                <button
                  onClick={() =>
                    handleChange({ target: { name: "location", value: "" } })
                  }
                  className="remove-filter"
                >
                  ×
                </button>
              </span>
            )}
            {filters.carats && (
              <span className="filter-tag">
                Carats: {caratsLabels[filters.carats] || filters.carats}
                <button
                  onClick={() =>
                    handleChange({ target: { name: "carats", value: "" } })
                  }
                  className="remove-filter"
                >
                  ×
                </button>
              </span>
            )}
            {filters.startDate && (
              <span className="filter-tag">
                Depuis: {filters.startDate}
                <button
                  onClick={() =>
                    handleChange({ target: { name: "startDate", value: "" } })
                  }
                  className="remove-filter"
                >
                  ×
                </button>
              </span>
            )}
            {filters.endDate && (
              <span className="filter-tag">
                Jusqu&apos;à : {filters.endDate}
                <button
                  onClick={() =>
                    handleChange({ target: { name: "endDate", value: "" } })
                  }
                  className="remove-filter"
                >
                  ×
                </button>
              </span>
            )}
            <button onClick={handleReset} className="clear-all-filters">
              Effacer tous les filtres
            </button>
          </div>
        </div>
      )}

      {/* Résumé des totaux */}
      {stats.length > 0 && (
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-value">{totalTransactions}</div>
            <div className="summary-label">Transactions</div>
          </div>
          <div className="summary-card">
            <div className="summary-value">{totalWeight.toFixed(2)}g</div>
            <div className="summary-label">Poids total</div>
          </div>
          <div className="summary-card">
            <div className="summary-value">{totalAmount.toFixed(2)}€</div>
            <div className="summary-label">Montant total</div>
          </div>
          <div className="summary-card">
            <div className="summary-value">
              {totalWeight > 0
                ? (totalAmount / totalWeight).toFixed(2)
                : "0.00"}
              €/g
            </div>
            <div className="summary-label">Prix moyen</div>
          </div>
        </div>
      )}

      {/* Tableau des statistiques détaillées */}
      {stats.length > 0 && (
        <div className="stats-container">
          <h4>Statistiques détaillées par type de carats</h4>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Type de carats</th>
                  <th>Nb transactions</th>
                  <th>Poids total (g)</th>
                  <th>Poids moyen (g)</th>
                  <th>Montant total (€)</th>
                  <th>Prix par gramme (€/g)</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((row) => {
                  const weight = row._sum?.weight || 0;
                  const amount = row._sum?.subtotal || 0;
                  const count = row._count || 0;
                  const avgWeight = count > 0 ? weight / count : 0;
                  const pricePerGram = weight > 0 ? amount / weight : 0;

                  return (
                    <tr key={row.carats}>
                      <td className="text-left">
                        <strong>
                          {caratsLabels[row.carats] || row.carats}
                        </strong>
                      </td>
                      <td>{count}</td>
                      <td>{weight.toFixed(2)}</td>
                      <td>{avgWeight.toFixed(2)}</td>
                      <td>{amount.toFixed(2)}</td>
                      <td className="price-cell">{pricePerGram.toFixed(2)}</td>
                    </tr>
                  );
                })}
                {/* Ligne de total */}
                {stats.length > 1 && (
                  <tr className="total-row">
                    <td>
                      <strong>TOTAL</strong>
                    </td>
                    <td>
                      <strong>{totalTransactions}</strong>
                    </td>
                    <td>
                      <strong>{totalWeight.toFixed(2)}</strong>
                    </td>
                    <td>-</td>
                    <td>
                      <strong>{totalAmount.toFixed(2)}</strong>
                    </td>
                    <td className="price-cell">
                      <strong>
                        {totalWeight > 0
                          ? (totalAmount / totalWeight).toFixed(2)
                          : "0.00"}
                      </strong>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Graphique de répartition du poids */}
      {stats.length > 1 && (
        <div className="weight-distribution">
          <h4>Répartition du poids par type de carats</h4>
          <div className="weight-bars">
            {stats
              .sort((a, b) => (b._sum?.weight || 0) - (a._sum?.weight || 0))
              .map((item) => {
                const weight = item._sum?.weight || 0;
                const percentage =
                  totalWeight > 0 ? (weight / totalWeight) * 100 : 0;
                return (
                  <div key={item.carats} className="weight-bar-item">
                    <div className="weight-bar-label">
                      <span className="carat-name">
                        {caratsLabels[item.carats] || item.carats}
                      </span>
                      <span className="weight-info">
                        {weight.toFixed(1)}g ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="weight-bar-container">
                      <div
                        className="weight-bar"
                        style={{
                          width: `${Math.max(percentage, 2)}%`,
                          backgroundColor: `hsl(${
                            120 - percentage * 1.2
                          }, 70%, 50%)`,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Message si aucune donnée */}
      {!isLoading && stats.length === 0 && !error && (
        <div className="no-data">
          <p>
            Aucune statistique disponible. Effectuez une recherche pour voir les
            résultats.
          </p>
        </div>
      )}

      <style jsx>{`
        .search-container {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .search-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 10px;
          border: 2px solid #e1e5e9;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #4caf50;
          box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
        }

        .button-group {
          display: flex;
          gap: 12px;
          justify-content: flex-start;
        }

        .search-button,
        .reset-button {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }

        .search-button {
          background: linear-gradient(135deg, #4caf50, #45a049);
          color: white;
        }

        .search-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #45a049, #3d8b40);
          transform: translateY(-1px);
        }

        .search-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .reset-button {
          background: linear-gradient(135deg, #f44336, #d32f2f);
          color: white;
        }

        .reset-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #d32f2f, #b71c1c);
          transform: translateY(-1px);
        }

        .error-message {
          background: #ffebee;
          color: #c62828;
          padding: 12px;
          border-radius: 6px;
          margin: 15px 0;
          border-left: 4px solid #f44336;
        }

        .active-filters {
          background: linear-gradient(135deg, #e3f2fd, #f0f8ff);
          padding: 16px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #2196f3;
        }

        .active-filters h4 {
          margin: 0 0 12px 0;
          color: #1976d2;
        }

        .filter-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .filter-tag {
          background: linear-gradient(135deg, #2196f3, #1976d2);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .remove-filter {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          cursor: pointer;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 50%;
          font-size: 12px;
          line-height: 1;
          transition: background 0.2s;
        }

        .remove-filter:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .clear-all-filters {
          background: linear-gradient(135deg, #f44336, #d32f2f);
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .clear-all-filters:hover {
          background: linear-gradient(135deg, #d32f2f, #b71c1c);
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin: 20px 0;
        }

        .summary-card {
          background: white;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border-top: 4px solid #4caf50;
        }

        .summary-value {
          font-size: 28px;
          font-weight: bold;
          color: #2e7d32;
          margin-bottom: 8px;
        }

        .summary-label {
          color: #666;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stats-container {
          background: white;
          border-radius: 10px;
          padding: 20px;
          margin: 20px 0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .stats-container h4 {
          margin: 0 0 20px 0;
          color: #333;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 10px;
        }

        .table-responsive {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        th,
        td {
          padding: 12px;
          text-align: center;
          border-bottom: 1px solid #e0e0e0;
        }

        th {
          background: linear-gradient(135deg, #f5f5f5, #eeeeee);
          font-weight: 600;
          color: #333;
          position: sticky;
          top: 0;
        }

        .text-left {
          text-align: left !important;
        }

        .price-cell {
          font-weight: 600;
          color: #2e7d32;
        }

        .total-row {
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          border-top: 2px solid #dee2e6;
        }

        .total-row td {
          border-bottom: 2px solid #dee2e6;
        }

        tr:hover:not(.total-row) {
          background-color: #f8f9fa;
        }

        .weight-distribution {
          background: white;
          border-radius: 10px;
          padding: 20px;
          margin: 20px 0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .weight-distribution h4 {
          margin: 0 0 20px 0;
          color: #333;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 10px;
        }

        .weight-bars {
          space-y: 15px;
        }

        .weight-bar-item {
          margin-bottom: 20px;
        }

        .weight-bar-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .carat-name {
          font-weight: 600;
          color: #333;
        }

        .weight-info {
          color: #666;
          font-weight: 500;
        }

        .weight-bar-container {
          width: 100%;
          height: 24px;
          background: linear-gradient(90deg, #f5f5f5, #e0e0e0);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .weight-bar {
          height: 100%;
          border-radius: 12px;
          transition: width 0.6s ease-in-out;
          background: linear-gradient(
            90deg,
            currentColor,
            rgba(255, 255, 255, 0.2)
          );
          position: relative;
        }

        .weight-bar::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .no-data {
          background: white;
          padding: 40px;
          text-align: center;
          border-radius: 10px;
          margin: 20px 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .no-data p {
          color: #666;
          font-size: 16px;
          margin: 0;
        }

        @media (max-width: 768px) {
          .search-grid {
            grid-template-columns: 1fr;
          }

          .summary-cards {
            grid-template-columns: repeat(2, 1fr);
          }

          .button-group {
            flex-direction: column;
          }

          .filter-tags {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
