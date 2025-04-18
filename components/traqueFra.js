import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function TraqueFra() {
  const [fraudTransactions, setFraudTransactions] = useState([]);
  const [legitimateTransactions, setLegitimateTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  // État pour la modal de détails de transaction
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  // État pour la modal d'image en plein écran
  const [selectedImage, setSelectedImage] = useState(null);

  // Définir les catégories de montants (identiques à PreTraqueFra.js)
  const categories = [
    { name: "10 000 € - 20 000 €", min: 10000, max: 20000 },
    { name: "20 000 € - 50 000 €", min: 20000, max: 50000 },
    { name: "50 000 € - 150 000 €", min: 50000, max: 150000 },
    { name: "Plus de 150 000 €", min: 150000, max: Infinity },
  ];

  useEffect(() => {
    console.log("Session dans TraqueFra:", session);
    console.log("Rôle utilisateur:", session?.user?.role);

    // Modifiez cette ligne pour forcer l'appel API à des fins de test
    if (true) {
      // au lieu de if (session?.user?.role === "superadmin")
      console.log("Tentative d'appel API fetchFraudData");
      fetchFraudData();
    }
  }, [session]);

  const fetchFraudData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/transactions/fraud-status");
      console.log("Données reçues:", data);

      // Séparer les transactions frauduleuses et légitimes
      const frauds = data.filter(
        (transaction) => transaction.fraudChecked && transaction.isFraud
      );
      const legitimate = data.filter(
        (transaction) => transaction.fraudChecked && !transaction.isFraud
      );

      console.log("Fraudes:", frauds.length);
      console.log("Légitimes:", legitimate.length);

      setFraudTransactions(frauds);
      setLegitimateTransactions(legitimate);
      setError(null);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données de fraude",
        error
      );
      setError(
        "Impossible de charger les données de fraude. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Grouper les transactions par catégorie (comme dans PreTraqueFra.js)
  const getTransactionsByCategory = (transactionsList, min, max) => {
    return transactionsList.filter(
      (transaction) => transaction.amount >= min && transaction.amount < max
    );
  };

  // Calculer le montant total pour une liste de transactions
  const getTotalAmount = (transactionsList) => {
    return transactionsList.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
  };

  // Ouvrir la modal de détails
  const openDetailsModal = (transaction) => {
    setSelectedTransaction(transaction);
  };

  // Fermer la modal de détails
  const closeDetailsModal = () => {
    setSelectedTransaction(null);
  };

  // Extraire l'ID Google Drive de l'URL pour créer une URL de miniature
  const getThumbnailUrl = (url) => {
    if (!url) return null;

    // Extraire l'ID du fichier Google Drive de l'URL
    const match = url.match(/\/d\/([^/]+)/);
    if (match && match[1]) {
      // Utiliser l'API Google Drive pour les miniatures
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w100`;
    }
    return url;
  };

  // Ouvrir l'image en modal
  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  // Fermer la modal d'image
  const closeImageModal = () => {
    setSelectedImage(null);
  };

  if (session?.user?.role !== "superadmin") {
    return (
      <p>
        Accès non autorisé. Seuls les Super Administrateurs peuvent accéder à
        cette page.
      </p>
    );
  }

  if (loading && !fraudTransactions.length && !legitimateTransactions.length)
    return <p>Chargement des transactions...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="traque-fra-container">
      <h2>Traque Fra - Résultats des validations</h2>
      <p className="info-text">
        Ce rapport affiche les résultats des vérifications de fraude effectuées
        sur les transactions à risque.
      </p>

      {/* Section des transactions frauduleuses */}
      <div className="fraud-section">
        <h3>
          Transactions frauduleuses identifiées ({fraudTransactions.length})
        </h3>
        {fraudTransactions.length === 0 ? (
          <p className="no-data">Aucune transaction frauduleuse identifiée.</p>
        ) : (
          <div className="categories-container">
            {categories.map((category, index) => {
              const categoryTransactions = getTransactionsByCategory(
                fraudTransactions,
                category.min,
                category.max
              );
              const totalAmount = getTotalAmount(categoryTransactions);

              return (
                <div key={`fraud-${index}`} className="category-section">
                  <h4>{category.name}</h4>
                  <div className="category-stats">
                    <span className="stat-item">
                      Nombre: {categoryTransactions.length}
                    </span>
                    <span className="stat-item">
                      Total: {totalAmount.toLocaleString("fr-FR")} €
                    </span>
                  </div>

                  {categoryTransactions.length > 0 ? (
                    <div className="table-responsive">
                      <table className="transactions-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>N° Facture</th>
                            <th>Client</th>
                            <th>Montant</th>
                            <th>Lieu</th>
                            <th>Paiement</th>
                            <th>Vendeur</th>
                            <th>Photo Bijou</th>
                            <th>RIB/Cheque</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categoryTransactions.map((transaction) => (
                            <tr key={transaction.id} className="fraud-row">
                              <td>{formatDate(transaction.date)}</td>
                              <td>{transaction.factureNumber}</td>
                              <td>{transaction.clientName}</td>
                              <td className="amount">
                                {transaction.amount.toLocaleString("fr-FR")} €
                              </td>
                              <td>{transaction.location || "Non spécifié"}</td>
                              <td>{transaction.paiement}</td>
                              <td>
                                {transaction.user?.email ||
                                  "Utilisateur inconnu"}
                              </td>
                              <td>
                                {transaction.jewelryPhotoUrl ? (
                                  <div className="thumbnail-container">
                                    <img
                                      src={getThumbnailUrl(
                                        transaction.jewelryPhotoUrl
                                      )}
                                      alt="Photo bijou"
                                      className="thumbnail"
                                      onClick={() =>
                                        openImageModal(
                                          transaction.jewelryPhotoUrl
                                        )
                                      }
                                    />
                                  </div>
                                ) : (
                                  <span>-</span>
                                )}
                              </td>
                              <td>
                                {transaction.paymentProofUrl ? (
                                  <div className="thumbnail-container">
                                    <img
                                      src={getThumbnailUrl(
                                        transaction.paymentProofUrl
                                      )}
                                      alt="Preuve paiement"
                                      className="thumbnail"
                                      onClick={() =>
                                        openImageModal(
                                          transaction.paymentProofUrl
                                        )
                                      }
                                    />
                                  </div>
                                ) : (
                                  <span>-</span>
                                )}
                              </td>
                              <td>
                                <button
                                  className="details-button"
                                  onClick={() => openDetailsModal(transaction)}
                                >
                                  Détails
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="no-data">
                      Aucune transaction frauduleuse dans cette catégorie.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section des transactions légitimes */}
      <div className="legitimate-section">
        <h3>
          Transactions validées comme légitimes ({legitimateTransactions.length}
          )
        </h3>
        {legitimateTransactions.length === 0 ? (
          <p className="no-data">Aucune transaction validée comme légitime.</p>
        ) : (
          <div className="categories-container">
            {categories.map((category, index) => {
              const categoryTransactions = getTransactionsByCategory(
                legitimateTransactions,
                category.min,
                category.max
              );
              const totalAmount = getTotalAmount(categoryTransactions);

              return (
                <div key={`legitimate-${index}`} className="category-section">
                  <h4>{category.name}</h4>
                  <div className="category-stats">
                    <span className="stat-item">
                      Nombre: {categoryTransactions.length}
                    </span>
                    <span className="stat-item">
                      Total: {totalAmount.toLocaleString("fr-FR")} €
                    </span>
                  </div>

                  {categoryTransactions.length > 0 ? (
                    <div className="table-responsive">
                      <table className="transactions-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>N° Facture</th>
                            <th>Client</th>
                            <th>Montant</th>
                            <th>Lieu</th>
                            <th>Paiement</th>
                            <th>Vendeur</th>
                            <th>Photo Bijou</th>
                            <th>RIB/Cheque</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categoryTransactions.map((transaction) => (
                            <tr key={transaction.id} className="legitimate-row">
                              <td>{formatDate(transaction.date)}</td>
                              <td>{transaction.factureNumber}</td>
                              <td>{transaction.clientName}</td>
                              <td className="amount">
                                {transaction.amount.toLocaleString("fr-FR")} €
                              </td>
                              <td>{transaction.location || "Non spécifié"}</td>
                              <td>{transaction.paiement}</td>
                              <td>
                                {transaction.user?.email ||
                                  "Utilisateur inconnu"}
                              </td>
                              <td>
                                {transaction.jewelryPhotoUrl ? (
                                  <div className="thumbnail-container">
                                    <img
                                      src={getThumbnailUrl(
                                        transaction.jewelryPhotoUrl
                                      )}
                                      alt="Photo bijou"
                                      className="thumbnail"
                                      onClick={() =>
                                        openImageModal(
                                          transaction.jewelryPhotoUrl
                                        )
                                      }
                                    />
                                  </div>
                                ) : (
                                  <span>-</span>
                                )}
                              </td>
                              <td>
                                {transaction.paymentProofUrl ? (
                                  <div className="thumbnail-container">
                                    <img
                                      src={getThumbnailUrl(
                                        transaction.paymentProofUrl
                                      )}
                                      alt="Preuve paiement"
                                      className="thumbnail"
                                      onClick={() =>
                                        openImageModal(
                                          transaction.paymentProofUrl
                                        )
                                      }
                                    />
                                  </div>
                                ) : (
                                  <span>-</span>
                                )}
                              </td>
                              <td>
                                <button
                                  className="details-button"
                                  onClick={() => openDetailsModal(transaction)}
                                >
                                  Détails
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="no-data">
                      Aucune transaction légitime dans cette catégorie.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal pour afficher les détails complets d'une transaction */}
      {selectedTransaction && (
        <div className="transaction-modal" onClick={closeDetailsModal}>
          <div
            className="transaction-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="close-button" onClick={closeDetailsModal}>
              &times;
            </span>
            <h3>Détails de la transaction</h3>

            <div
              className={`fraud-status-banner ${
                selectedTransaction.isFraud ? "fraud" : "legitimate"
              }`}
            >
              {selectedTransaction.isFraud
                ? "⚠️ TRANSACTION FRAUDULEUSE ⚠️"
                : "✓ TRANSACTION LÉGITIME"}
            </div>

            <div className="transaction-details">
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">
                    {formatDate(selectedTransaction.date)}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">N° d'ordre:</span>
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
                    {selectedTransaction.amount.toLocaleString("fr-FR")} €
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
                <div className="detail-item">
                  <span className="detail-label">Vendeur:</span>
                  <span className="detail-value">
                    {selectedTransaction.user?.email || "Utilisateur inconnu"}
                  </span>
                </div>
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
                            <td>{item.unitPrice.toLocaleString("fr-FR")} €</td>
                            <td>{item.subtotal.toLocaleString("fr-FR")} €</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              <div className="detail-images">
                {selectedTransaction.jewelryPhotoUrl && (
                  <div className="detail-image-container">
                    <h4>Photo du bijou</h4>
                    <img
                      src={getThumbnailUrl(selectedTransaction.jewelryPhotoUrl)}
                      alt="Photo du bijou"
                      className="detail-image"
                      onClick={() =>
                        openImageModal(selectedTransaction.jewelryPhotoUrl)
                      }
                    />
                  </div>
                )}

                {selectedTransaction.paymentProofUrl && (
                  <div className="detail-image-container">
                    <h4>Preuve de paiement</h4>
                    <img
                      src={getThumbnailUrl(selectedTransaction.paymentProofUrl)}
                      alt="Preuve de paiement"
                      className="detail-image"
                      onClick={() =>
                        openImageModal(selectedTransaction.paymentProofUrl)
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour l'affichage d'image */}
      {selectedImage && (
        <div className="image-modal" onClick={() => closeImageModal()}>
          <div className="modal-content">
            <span className="close-button" onClick={() => closeImageModal()}>
              &times;
            </span>
            <iframe
              src={selectedImage}
              title="Document Google Drive"
              width="100%"
              height="100%"
            />
          </div>
        </div>
      )}

      <style jsx>{`
        .thumbnail-container {
          width: 50px;
          height: 50px;
          overflow: hidden;
          border-radius: 4px;
          border: 1px solid #ddd;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .thumbnail {
          max-width: 100%;
          max-height: 100%;
          object-fit: cover;
        }
        .image-modal {
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
        .modal-content {
          position: relative;
          background-color: white;
          padding: 0;
          width: 90%;
          height: 90%;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          overflow: hidden;
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
      `}</style>
    </div>
  );
}
