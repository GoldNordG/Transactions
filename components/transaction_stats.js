// Composant pour afficher les statistiques des transactions
export default function TransactionStats({ totalStats }) {
  return (
    <>
      {/* Afficher les totaux des transactions par type d'or */}
      <div className="transaction-stats">
        <div className="stat-box">
          <span className="stat-label">Nombre total de transactions</span>
          <span className="stat-value">{totalStats.totalCount}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Montant total</span>
          <span className="stat-value">
            {totalStats.totalAmount.toFixed(2)} €
          </span>
        </div>
      </div>

      {/* Statistiques détaillées par type d'or */}
      <div className="gold-stats">
        <div className="gold-stat-category">
          <h3>Or (Dentaire + 9k + 14k + 18k)</h3>
          <div className="gold-stat-row">
            <div className="stat-box-small">
              <span className="stat-label">Articles</span>
              <span className="stat-value">{totalStats.lowKarat.count}</span>
            </div>
            <div className="stat-box-small">
              <span className="stat-label">Poids total</span>
              <span className="stat-value">
                {totalStats.lowKarat.weight.toFixed(2)} g
              </span>
            </div>
            <div className="stat-box-small">
              <span className="stat-label">Montant</span>
              <span className="stat-value">
                {totalStats.lowKarat.amount.toFixed(2)} €
              </span>
            </div>
          </div>
        </div>

        <div className="gold-stat-category">
          <h3>Or 22 carats</h3>
          <div className="gold-stat-row">
            <div className="stat-box-small">
              <span className="stat-label">Articles</span>
              <span className="stat-value">{totalStats.gold22k.count}</span>
            </div>
            <div className="stat-box-small">
              <span className="stat-label">Poids total</span>
              <span className="stat-value">
                {totalStats.gold22k.weight.toFixed(2)} g
              </span>
            </div>
            <div className="stat-box-small">
              <span className="stat-label">Montant</span>
              <span className="stat-value">
                {totalStats.gold22k.amount.toFixed(2)} €
              </span>
            </div>
          </div>
        </div>

        <div className="gold-stat-category">
          <h3>Or 24 carats</h3>
          <div className="gold-stat-row">
            <div className="stat-box-small">
              <span className="stat-label">Articles</span>
              <span className="stat-value">{totalStats.gold24k.count}</span>
            </div>
            <div className="stat-box-small">
              <span className="stat-label">Poids total</span>
              <span className="stat-value">
                {totalStats.gold24k.weight.toFixed(2)} g
              </span>
            </div>
            <div className="stat-box-small">
              <span className="stat-label">Montant</span>
              <span className="stat-value">
                {totalStats.gold24k.amount.toFixed(2)} €
              </span>
            </div>
          </div>
        </div>
      </div>

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
        .gold-stats {
          margin-bottom: 20px;
        }
        .gold-stat-category {
          margin-bottom: 15px;
          border: 1px solid #e0e0e0;
          border-radius: 5px;
          padding: 15px;
          background-color: #fafafa;
        }
        .gold-stat-category h3 {
          margin: 0 0 10px 0;
          color: #333;
        }
        .gold-stat-row {
          display: flex;
          gap: 15px;
        }
        .stat-box-small {
          background-color: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 8px 12px;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 120px;
        }
        .stat-box-small .stat-label {
          font-size: 12px;
          color: #666;
        }
        .stat-box-small .stat-value {
          font-size: 16px;
          font-weight: bold;
          margin-top: 3px;
        }
      `}</style>
    </>
  );
}
