import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import TransactionSearch from "./TransactionSearch";

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const { data: session, status } = useSession(); // Ajout du statut de session
  // État pour la modal d'image
  const [selectedImage, setSelectedImage] = useState(null);
  // État pour la modal de détails de transaction
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20; // Nombre d'éléments par page

  // États pour les statistiques totales
  const [totalStats, setTotalStats] = useState({
    totalWeight: 0,
    totalAmount: 0,
    count: 0,
  });

  const fetchTransactions = async (queryParams = {}, page = 1) => {
    try {
      // Vérifier si la session est chargée et si l'utilisateur est connecté
      if (status !== "authenticated" || !session?.user) {
        console.log("Utilisateur non authentifié, annulation de la requête");
        return;
      }

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
      if (queryParams.clientName)
        params.append("clientName", queryParams.clientName);

      // Ajouter systématiquement l'ID utilisateur pour la sécurité côté client
      // Même si l'API vérifiera également l'autorisation côté serveur
      const isAdminOrSuperAdmin =
        session.user.role === "admin" || session.user.role === "superadmin";

      if (!isAdminOrSuperAdmin) {
        console.log("Utilisateur standard, filtrage par ID:", session.user.id);
        params.append("userId", session.user.id);
      } else {
        console.log(
          "Admin/Superadmin détecté, affichage de toutes les transactions"
        );
      }

      // Ajouter les paramètres de pagination
      params.append("page", page);
      params.append("limit", itemsPerPage);

      // Ajouter les paramètres à l'URL s'il y en a
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      console.log("Requête API:", url);

      // Définir un timeout plus long pour éviter les erreurs de timeout pour les requêtes volumineuses
      const { data } = await axios.get(url, { timeout: 50000 }); // 50 secondes de timeout

      // Vérifier si les données reçues correspondent à l'utilisateur actuel
      if (data && !isAdminOrSuperAdmin) {
        console.log(`Données reçues pour l'utilisateur ${session.user.id}`);
      }

      setTransactions(data.transactions || data);

      // Si l'API retourne des métadonnées de pagination
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages);
        setTotalItems(data.pagination.totalItems);
        setTotalStats({
          totalWeight: data.stats?.totalWeight || 0,
          totalAmount: data.stats?.totalAmount || 0,
          count: data.pagination.totalItems || 0,
        });
      } else {
        // Si l'API ne gère pas encore la pagination, calculer les stats localement
        const localStats = calculateTotals(data);
        setTotalStats(localStats);
        setTotalPages(1);
        setTotalItems(data.length);
      }

      setError(null);
    } catch (error) {
      console.error("Erreur lors de la récupération des transactions", error);
      setError("Impossible de charger les transactions. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Attendre que la session soit complètement chargée avant de faire la requête
    if (status === "authenticated" && session?.user) {
      console.log(
        "Session chargée, utilisateur:",
        session.user.email,
        "rôle:",
        session.user.role
      );
      fetchTransactions(filters, currentPage);
    } else if (status === "loading") {
      console.log("Chargement de la session...");
    } else if (status === "unauthenticated") {
      console.log("Utilisateur non authentifié");
      setError("Vous devez être connecté pour voir les transactions.");
    }
  }, [session, status, filters, currentPage]);

  const handleSearch = (searchFilters) => {
    setFilters(searchFilters);
    setCurrentPage(1); // Réinitialiser à la première page lors d'une nouvelle recherche
    if (status === "authenticated") {
      fetchTransactions(searchFilters, 1);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0); // Remonter en haut de la page
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

  // Ouvrir l'image en grand
  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  // Fermer l'image en grand
  const closeImageModal = () => {
    setSelectedImage(null);
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

  // Calculer les totaux pour les transactions affichées localement
  const calculateTotals = (transactionData = transactions) => {
    if (!transactionData.length)
      return { totalWeight: 0, totalAmount: 0, count: 0 };

    return transactionData.reduce(
      (acc, transaction) => {
        return {
          totalWeight: acc.totalWeight + parseFloat(transaction.weight || 0),
          totalAmount: acc.totalAmount + parseFloat(transaction.amount || 0),
          count: acc.count + 1,
        };
      },
      { totalWeight: 0, totalAmount: 0, count: 0 }
    );
  };

  // Si la session est en cours de chargement
  if (status === "loading") {
    return <p>Chargement de la session...</p>;
  }

  // Si l'utilisateur n'est pas connecté
  if (status === "unauthenticated") {
    return <p>Veuillez vous connecter pour voir les transactions.</p>;
  }

  if (loading && !transactions.length)
    return <p>Chargement des transactions...</p>;
  if (error) return <p className="error">{error}</p>;

  // Vérifier si l'utilisateur est admin ou superadmin
  const isAdminOrSuperAdmin =
    session?.user?.role === "admin" || session?.user?.role === "superadmin";

  return (
    <div>
      <h2>Liste des Transactions</h2>

      {/* Afficher le nom et le rôle de l'utilisateur connecté pour le débogage */}
      <div className="user-info">
        <strong>Utilisateur connecté:</strong> {session.user.email}
        <span className="user-role">({session.user.role})</span>
      </div>

      {/* Afficher le composant de recherche uniquement pour les administrateurs et superadmins */}
      {isAdminOrSuperAdmin && <TransactionSearch onSearch={handleSearch} />}

      {/* Indiquer si des filtres sont actifs */}
      {Object.keys(filters).length > 0 && (
        <div className="filters-active">
          <span>Filtres actifs</span>
          <button
            className="clear-filters"
            onClick={() => {
              setFilters({});
              setCurrentPage(1);
              fetchTransactions({}, 1);
            }}
          >
            Effacer les filtres
          </button>
        </div>
      )}

      {/* État de chargement */}
      {loading && <p className="loading-indicator">Chargement...</p>}

      {/* Afficher les totaux des transactions */}
      <div className="transaction-stats">
        <div className="stat-box">
          <span className="stat-label">Nombre de transactions</span>
          <span className="stat-value">{totalStats.count}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Poids total</span>
          <span className="stat-value">
            {totalStats.totalWeight.toFixed(2)} g
          </span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Montant total</span>
          <span className="stat-value">
            {totalStats.totalAmount.toFixed(2)} €
          </span>
        </div>
      </div>

      {/* Pagination en haut */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            «
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            ‹
          </button>
          <span className="pagination-info">
            Page {currentPage} sur {totalPages} ({totalItems} transactions)
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            ›
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            »
          </button>
        </div>
      )}

      {transactions.length === 0 ? (
        <p>Aucune transaction à afficher.</p>
      ) : (
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
                              {item.unitPrice} €
                              {i < transaction.items.length - 1 && <hr />}
                            </div>
                          ))
                        : "-"}
                    </td>
                    <td>{transaction.amount} €</td>
                    <td>{transaction.location || "Non spécifié"}</td>
                    <td>{transaction.paiement}</td>
                    <td>
                      {transaction.jewelryPhotoUrl ? (
                        <div className="thumbnail-container">
                          <Image
                            src={getThumbnailUrl(transaction.jewelryPhotoUrl)}
                            alt="Photo bijou"
                            className="thumbnail"
                            onClick={() =>
                              openImageModal(transaction.jewelryPhotoUrl)
                            }
                            width={50}
                            height={50}
                          />
                        </div>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td>
                      {transaction.paymentProofUrl ? (
                        <div className="thumbnail-container">
                          <Image
                            src={getThumbnailUrl(transaction.paymentProofUrl)}
                            alt="Preuve paiement"
                            className="thumbnail"
                            onClick={() =>
                              openImageModal(transaction.paymentProofUrl)
                            }
                            width={50}
                            height={50}
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination en bas */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            «
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            ‹
          </button>
          <span className="pagination-info">
            Page {currentPage} sur {totalPages} ({totalItems} transactions)
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            ›
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            »
          </button>
        </div>
      )}

      {/* Modal pour afficher l'image en grand */}
      {selectedImage && (
        <div className="image-modal" onClick={closeImageModal}>
          <div className="modal-content">
            <span className="close-button" onClick={closeImageModal}>
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
                {selectedTransaction.jewelryPhotoUrl && (
                  <div className="detail-image-container">
                    <h4>Photo du bijou</h4>
                    <Image
                      src={getThumbnailUrl(selectedTransaction.jewelryPhotoUrl)}
                      alt="Photo du bijou"
                      onClick={() =>
                        openImageModal(selectedTransaction.jewelryPhotoUrl)
                      }
                      className="detail-image"
                      width={300}
                      height={200}
                    />
                  </div>
                )}

                {selectedTransaction.paymentProofUrl && (
                  <div className="detail-image-container">
                    <h4>Preuve de paiement</h4>
                    <Image
                      src={getThumbnailUrl(selectedTransaction.paymentProofUrl)}
                      alt="Preuve de paiement"
                      onClick={() =>
                        openImageModal(selectedTransaction.paymentProofUrl)
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
        </div>
      )}
      <style jsx>{`
        /* liste styles */
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
          border: 1px solid #eee;
          border-radius: 5px;
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
        .image-modal,
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
        .details-button {
          background-color: #4caf50;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }
        .details-button:hover {
          background-color: #45a049;
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
        .item-info {
          padding: 2px 0;
        }
        .item-info hr {
          margin: 5px 0;
          border: 0;
          border-top: 1px dashed #ddd;
        }

        /* Styles pour la pagination */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 20px 0;
          gap: 10px;
        }
        .pagination-button {
          padding: 5px 10px;
          border: 1px solid #ddd;
          background-color: #f8f8f8;
          cursor: pointer;
          border-radius: 3px;
          min-width: 30px;
          text-align: center;
        }
        .pagination-button:hover:not(:disabled) {
          background-color: #e0e0e0;
        }
        .pagination-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .pagination-info {
          padding: 0 10px;
          color: #666;
        }

        /* Styles pour l'indicateur de filtres actifs */
        .filters-active {
          background-color: #fff8e1;
          padding: 8px 12px;
          border-radius: 4px;
          margin-bottom: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .clear-filters {
          background-color: #f44336;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }
        .clear-filters:hover {
          background-color: #d32f2f;
        }

        /* Style pour l'indicateur de chargement */
        .loading-indicator {
          text-align: center;
          color: #666;
          padding: 10px;
          background-color: #f9f9f9;
          border-radius: 4px;
          margin: 10px 0;
        }
      `}</style>
    </div>
  );
}
