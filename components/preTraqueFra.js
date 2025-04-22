import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function PreTraqueFra() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  // État pour la modal de détails de transaction
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  // État pour indiquer si une mise à jour est en cours
  const [updating, setUpdating] = useState(false);

  // Définir les catégories de montants
  const categories = [
    { name: "10 000 € - 20 000 €", min: 10000, max: 20000 },
    { name: "20 000 € - 50 000 €", min: 20000, max: 50000 },
    { name: "50 000 € - 150 000 €", min: 50000, max: 150000 },
    { name: "Plus de 150 000 €", min: 150000, max: Infinity },
  ];

  useEffect(() => {
    if (session) {
      fetchTransactions();
    }
  }, [session]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/transactions");

      // Filtrer les transactions avec un montant ≥ 10 000 € ET non vérifiées (fraudChecked = false)
      const highValueTransactions = data.filter(
        (transaction) =>
          transaction.amount >= 10000 && !transaction.fraudChecked
      );
      setTransactions(highValueTransactions);
      setError(null);
    } catch (error) {
      console.error("Erreur lors de la récupération des transactions", error);
      setError("Impossible de charger les transactions. Veuillez réessayer.");
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

  // Grouper les transactions par catégorie
  const getTransactionsByCategory = (min, max) => {
    return transactions.filter(
      (transaction) => transaction.amount >= min && transaction.amount < max
    );
  };

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

  // Fonction pour valider ou invalider une fraude
  const updateFraudStatus = async (transactionId, isFraud) => {
    if (session?.user?.role !== "superadmin") {
      console.log("Accès non autorisé");
      return;
    }

    try {
      setUpdating(true);

      const numericId = parseInt(transactionId, 10);
      if (isNaN(numericId)) {
        throw new Error("ID de transaction invalide");
      }

      // Ajouter des en-têtes pour s'assurer que la réponse sera JSON
      const response = await axios.put(
        `/api/transactions/${numericId}/fraud-status`,
        { isFraud },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Supprimer la transaction de l'état local car elle est maintenant vérifiée
        setTransactions((prevTransactions) =>
          prevTransactions.filter((transaction) => transaction.id !== numericId)
        );

        // Fermer la modal si c'était cette transaction qui était ouverte
        if (selectedTransaction && selectedTransaction.id === numericId) {
          setSelectedTransaction(null);
        }
      }
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du statut de fraude:",
        error
      );

      // Gérer l'erreur 401 spécifiquement
      if (error.response?.status === 401) {
        alert(
          "Votre session a expiré. Vous allez être redirigé vers la page de connexion."
        );
        window.location.href = "/login?session=expired";
      } else {
        alert(
          `Erreur: ${error.response?.data?.error || "Une erreur est survenue"}`
        );
      }
    } finally {
      setUpdating(false);
    }
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

  if (loading && !transactions.length)
    return <p>Chargement des transactions...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="pre-traque-fra-container">
      <h2>Transactions à risque (Pré-Traque Fra)</h2>
      <p className="info-text">
        Ce rapport affiche les transactions non vérifiées dont le montant est
        supérieur ou égal à 10 000 €, classées par catégories.
      </p>

      {transactions.length === 0 ? (
        <p>
          Aucune transaction supérieure à 10 000 € en attente de vérification.
        </p>
      ) : (
        <div className="categories-container">
          {categories.map((category, index) => {
            const categoryTransactions = getTransactionsByCategory(
              category.min,
              category.max
            );
            const totalAmount = getTotalAmount(categoryTransactions);

            return (
              <div key={index} className="category-section">
                <h3>{category.name}</h3>
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
                          {session?.user?.role === "superadmin" && (
                            <th>Vendeur</th>
                          )}
                          {session?.user?.role === "superadmin" && (
                            <th>Statut Fraude</th>
                          )}
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoryTransactions.map((transaction) => (
                          <tr key={transaction.id}>
                            <td>{formatDate(transaction.date)}</td>
                            <td>{transaction.factureNumber}</td>
                            <td>{transaction.clientName}</td>
                            <td className="amount">
                              {transaction.amount.toLocaleString("fr-FR")} €
                            </td>
                            <td>{transaction.location || "Non spécifié"}</td>
                            <td>{transaction.paiement}</td>
                            {session?.user?.role === "superadmin" && (
                              <td>
                                {transaction.user?.email ||
                                  "Utilisateur inconnu"}
                              </td>
                            )}
                            {session?.user?.role === "superadmin" && (
                              <td className="fraud-status-column">
                                <div className="fraud-validation-buttons">
                                  <button
                                    className="validate-button validate-fraud"
                                    onClick={() =>
                                      updateFraudStatus(transaction.id, true)
                                    }
                                    disabled={updating}
                                  >
                                    Fraude
                                  </button>
                                  <button
                                    className="validate-button validate-no-fraud"
                                    onClick={() =>
                                      updateFraudStatus(transaction.id, false)
                                    }
                                    disabled={updating}
                                  >
                                    Légitime
                                  </button>
                                </div>
                              </td>
                            )}
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
                    Aucune transaction dans cette catégorie.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

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

            {session?.user?.role === "superadmin" && (
              <div className="fraud-status-section">
                <h4>Statut de fraude</h4>
                <div className="fraud-validation-buttons">
                  <button
                    className="validate-button validate-fraud"
                    onClick={() => {
                      updateFraudStatus(selectedTransaction.id, true);
                    }}
                    disabled={updating}
                  >
                    Marquer comme fraude
                  </button>
                  <button
                    className="validate-button validate-no-fraud"
                    onClick={() => {
                      updateFraudStatus(selectedTransaction.id, false);
                    }}
                    disabled={updating}
                  >
                    Marquer comme légitime
                  </button>
                </div>
              </div>
            )}

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
                            <td>{item.unitPrice} €</td>
                            <td>{item.subtotal} €</td>
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
                    <Image
                      src={getThumbnailUrl(selectedTransaction.jewelryPhotoUrl)}
                      alt="Photo du bijou"
                      className="detail-image"
                      width={100} // Ajoutez une largeur appropriée
                      height={75}
                    />
                  </div>
                )}

                {selectedTransaction.paymentProofUrl && (
                  <div className="detail-image-container">
                    <h4>Preuve de paiement</h4>
                    <Image
                      src={getThumbnailUrl(selectedTransaction.paymentProofUrl)}
                      alt="Preuve de paiement"
                      className="detail-image"
                      width={100} // Ajoutez une largeur appropriée
                      height={75}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
