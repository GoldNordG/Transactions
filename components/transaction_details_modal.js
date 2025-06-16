import Image from "next/image";

// Composant pour la modal de détails de transaction
export default function TransactionDetailsModal({ 
  selectedTransaction, 
  onClose, 
  onImageClick, 
  isAdminOrSuperAdmin,
  getThumbnailUrl,
  getModalImageUrl,
  formatDate 
}) {
  if (!selectedTransaction) return null;

  return (
    <div className="transaction-modal" onClick={onClose}>
      <div
        className="transaction-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h3>Détails de la transaction</h3>
        <div className="transaction-details">
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Date:</span>
              <span className="detail-value">
                {formatDate(selectedTransaction.date)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">N° d&apos;ordre:</span>
              <span className="detail-value">
                {selectedTransaction.orderNumber}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">N° de facture:</span>
              <span className="detail-value">
                {selectedTransaction.factureNumber}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Client:</span>
              <span className="detail-value">
                {selectedTransaction.clientName}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">
                {selectedTransaction.clientMail || "Non spécifié"}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Téléphone:</span>
              <span className="detail-value">
                {selectedTransaction.phone || "Non spécifié"}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Adresse:</span>
              <span className="detail-value">
                {selectedTransaction.adresse || "Non spécifié"}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Code postal:</span>
              <span className="detail-value">
                {selectedTransaction.codePostal || "Non spécifié"}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Ville:</span>
              <span className="detail-value">
                {selectedTransaction.ville || "Non spécifié"}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Désignation:</span>
              <span className="detail-value">
                {selectedTransaction.designation || "Non spécifié"}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Montant total:</span>
              <span className="detail-value">
                {selectedTransaction.amount} €
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Agence:</span>
              <span className="detail-value">
                {selectedTransaction.location || "Non spécifié"}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Mode de paiement:</span>
              <span className="detail-value">
                {selectedTransaction.paiement}
              </span>
            </div>
            {isAdminOrSuperAdmin && (
              <div className="detail-item">
                <span className="detail-label">Vendeur:</span>
                <span className="detail-value">
                  {selectedTransaction.user?.email || "Utilisateur inconnu"}
                </span>
              </div>
            )}
          </div>

          {/* Afficher tous les items si présents */}
          {selectedTransaction.items &&
            selectedTransaction.items.length > 0 && (
              <div className="detail-items">
                <h4>Articles</h4>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Désignation</th>
                      <th>Carats</th>
                      <th>Poids</th>
                      <th>Prix unitaire</th>
                      <th>Sous-total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTransaction.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.designation}</td>
                        <td>{item.carats}</td>
                        <td>{item.weight} g</td>
                        <td>{item.unitPrice} €</td>
                        <td>{item.subtotal} €</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          <div className="detail-images">
            {/* Photos de bijoux multiples (nouveau format) */}
            {selectedTransaction.jewelryPhotos &&
              selectedTransaction.jewelryPhotos.length > 0 && (
                <div className="detail-image-container">
                  <h4>
                    Photos des bijoux (
                    {selectedTransaction.jewelryPhotos.length})
                  </h4>
                  <div className="jewelry-photos-grid">
                    {selectedTransaction.jewelryPhotos
                      .sort((a, b) => a.photoOrder - b.photoOrder) // Trier par ordre
                      .map((photo, index) => (
                        <div key={photo.id} className="jewelry-photo-item">
                          <Image
                            src={getThumbnailUrl(photo.photoUrl)}
                            alt={
                              photo.description ||
                              `Photo bijou ${index + 1}`
                            }
                            onClick={() =>
                              onImageClick(
                                getModalImageUrl(photo.photoUrl)
                              )
                            }
                            className="detail-image"
                            width={150}
                            height={100}
                          />
                          <span className="photo-number">
                            Photo {photo.photoOrder}
                          </span>
                          {photo.description && (
                            <span className="photo-description">
                              {photo.description}
                            </span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

            {/* Fallback pour l'ancien format avec une seule photo */}
            {(!selectedTransaction.jewelryPhotos ||
              selectedTransaction.jewelryPhotos.length === 0) &&
              selectedTransaction.jewelryPhotoUrl && (
                <div className="detail-image-container">
                  <h4>Photo du bijou</h4>
                  <Image
                    src={getThumbnailUrl(
                      selectedTransaction.jewelryPhotoUrl
                    )}
                    alt="Photo du bijou"
                    onClick={() =>
                      onImageClick(
                        getModalImageUrl(
                          selectedTransaction.jewelryPhotoUrl
                        )
                      )
                    }
                    className="detail-image"
                    width={300}
                    height={200}
                  />
                </div>
              )}

            {/* Preuve de paiement */}
            {selectedTransaction.paymentProofUrl && (
              <div className="detail-image-container">
                <h4>Preuve de paiement</h4>
                <Image
                  src={getThumbnailUrl(selectedTransaction.paymentProofUrl)}
                  alt="Preuve de paiement"
                  onClick={() =>
                    onImageClick(
                      getModalImageUrl(selectedTransaction.paymentProofUrl)
                    )
                  }
                  className="detail-image"
                  width={300}
                  height={200}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .transaction-modal {
          position: fixed;
          z-index: 1000;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .transaction-modal-content {
          position: relative;
          background-color: white;
          padding: 20px;
          width: 90%;
          max-width: 800px;
          max-height: 90%;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          overflow-y: auto;
        }
        .close-button {
          position: absolute;
          top: 10px;
          right: 15px;
          color: #333;
          font-size: 28px;
          font-weight: bold;
          cursor: pointer;
          z-index: 1010;
          background-color: white;
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
        }
        .close-button:hover {
          color: #000;
          background-color: #eee;
        }
        .transaction-details {
          margin-top: 15px;
        }
        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 10px;
        }
        .detail-item {
          display: flex;
          margin-bottom: 8px;
          padding: 8px;
          background-color: #f9f9f9;
          border-radius: 4px;
        }
        .detail-label {
          font-weight: bold;
          margin-right: 8px;
          min-width: 120px;
        }
        .detail-value {
          flex: 1;
        }
        .detail-images {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-top: 20px;
        }
        .detail-image-container {
          flex: 1;
          min-width: 200px;
          max-width: 300px;
        }
        .detail-image-container h4 {
          margin-bottom: 10px;
        }
        .detail-image {
          width: 100%;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
        }
        .detail-image:hover {
          border-color: #999;
        }
        .detail-items {
          margin-top: 20px;
          margin-bottom: 20px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        .items-table th,
        .items-table td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        .items-table th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        .jewelry-photos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 10px;
        }
        .jewelry-photo-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .photo-number {
          font-size: 12px;
          color: #666;
          margin-top: 5px;
        }
        .photo-description {
          font-size: 11px;
          color: #888;
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
}