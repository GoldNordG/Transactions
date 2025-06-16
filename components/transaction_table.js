import Image from "next/image";

// Composant pour le tableau des transactions
export default function TransactionTable({
  transactions,
  formatDate,
  getThumbnailUrl,
  getModalImageUrl,
  onImageClick,
  onDetailsClick,
}) {
  if (transactions.length === 0) {
    return <p>Aucune transaction à afficher.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Facture n°</th>
            <th>Nom du client</th>
            <th>Ordre n°</th>
            <th>Carats</th>
            <th>Poids (g)</th>
            <th>Prix au gramme (EUR)</th>
            <th>Total (EUR)</th>
            <th>Lieu</th>
            <th>Paiement</th>
            <th>Photo Bijou</th>
            <th>RIB/Cheque</th>
            <th>Informations</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => {
            return (
              <tr key={transaction.id}>
                <td>{formatDate(transaction.date)}</td>
                <td>{transaction.factureNumber}</td>
                <td>{transaction.clientName}</td>
                <td>{transaction.orderNumber}</td>
                <td>
                  {transaction.items && transaction.items.length > 0
                    ? transaction.items.map((item, i) => (
                        <div key={i} className="item-info">
                          {item.carats}
                          {i < transaction.items.length - 1 && <hr />}
                        </div>
                      ))
                    : "-"}
                </td>
                <td>
                  {transaction.items && transaction.items.length > 0
                    ? transaction.items.map((item, i) => (
                        <div key={i} className="item-info">
                          {item.weight} g
                          {i < transaction.items.length - 1 && <hr />}
                        </div>
                      ))
                    : "-"}
                </td>
                <td>
                  {transaction.items && transaction.items.length > 0
                    ? transaction.items.map((item, i) => (
                        <div key={i} className="item-info">
                          {item.unitPrice} €{item.unitPrice} €
                          {i < transaction.items.length - 1 && <hr />}
                        </div>
                      ))
                    : "-"}
                </td>
                <td>{transaction.total} €</td>
                <td>{transaction.location}</td>
                <td>{transaction.paymentMethod}</td>
                <td>
                  {transaction.jewelryImage && (
                    <Image
                      src={getThumbnailUrl(transaction.jewelryImage)}
                      alt="Bijou"
                      width={50}
                      height={50}
                      onClick={() =>
                        onImageClick(getModalImageUrl(transaction.jewelryImage))
                      }
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </td>
                <td>
                  {transaction.ribOrChequeImage && (
                    <Image
                      src={getThumbnailUrl(transaction.ribOrChequeImage)}
                      alt="RIB/Cheque"
                      width={50}
                      height={50}
                      onClick={() =>
                        onImageClick(
                          getModalImageUrl(transaction.ribOrChequeImage)
                        )
                      }
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </td>
                <td>
                  <button onClick={() => onDetailsClick(transaction)}>
                    Détails
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
