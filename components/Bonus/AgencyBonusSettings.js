import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function AgencyBonusSettings() {
  const [bonusRates, setBonusRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingRate, setEditingRate] = useState(null);
  const { data: session, status } = useSession();

  const fetchBonusRates = async () => {
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
      const { data } = await axios.get("/api/bonuses/rates");
      setBonusRates(data);
      setError(null);
    } catch (error) {
      console.error("Erreur lors de la récupération des taux de prime", error);
      setError("Impossible de charger les taux de prime. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      fetchBonusRates();
    } else if (status === "unauthenticated") {
      setError("Vous devez être connecté pour accéder à cette page.");
    }
  }, [session, status]);

  const handleEditRate = (rate) => {
    setEditingRate({
      ...rate,
      bonusPercentage: rate.bonusPercentage * 100, // Convertir en pourcentage pour l'interface
    });
  };

  const handleCancelEdit = () => {
    setEditingRate(null);
    setError(null);
    setSuccess(null);
  };

  const handleInputChange = (e) => {
    setEditingRate({
      ...editingRate,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!editingRate.carats) {
      setError("Le nombre de carats est requis.");
      return false;
    }

    if (
      isNaN(parseFloat(editingRate.bonusPercentage)) ||
      parseFloat(editingRate.bonusPercentage) < 0
    ) {
      setError("Le pourcentage de prime doit être un nombre positif.");
      return false;
    }

    return true;
  };

  const handleSaveRate = async () => {
    try {
      if (!validateForm()) return;

      setLoading(true);
      setError(null);
      setSuccess(null);

      const rateToSave = {
        ...editingRate,
        bonusPercentage: parseFloat(editingRate.bonusPercentage) / 100, // Convertir le pourcentage en décimal pour le backend
      };

      if (editingRate.id) {
        // Mise à jour d'un taux existant
        await axios.put(`/api/bonuses/rates/${editingRate.id}`, rateToSave);
        setSuccess("Le taux de prime a été mis à jour avec succès.");
      } else {
        // Création d'un nouveau taux
        await axios.post("/api/bonuses/rates", rateToSave);
        setSuccess("Le nouveau taux de prime a été créé avec succès.");
      }

      fetchBonusRates();
      setEditingRate(null);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du taux de prime", error);
      setError(
        "Impossible de sauvegarder le taux de prime. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRate = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce taux de prime ?")) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`/api/bonuses/rates/${id}`);
      setSuccess("Le taux de prime a été supprimé avec succès.");
      fetchBonusRates();
    } catch (error) {
      console.error("Erreur lors de la suppression du taux de prime", error);
      setError("Impossible de supprimer le taux de prime. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingRate({
      id: null,
      carats: "",
      bonusPercentage: 0,
      minWeightThreshold: 0,
      description: "",
    });
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
    <div className="bonus-settings-container">
      <h2>Configuration des Primes</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {loading && !editingRate && (
        <p className="loading-indicator">Chargement...</p>
      )}

      {!loading && !editingRate && (
        <>
          <button className="add-button" onClick={handleAddNew}>
            Ajouter un nouveau taux de prime
          </button>

          {bonusRates.length === 0 ? (
            <p>Aucun taux de prime configuré.</p>
          ) : (
            <div className="table-responsive">
              <table className="rates-table">
                <thead>
                  <tr>
                    <th>Carats</th>
                    <th>Description</th>
                    <th>Pourcentage</th>
                    <th>Seuil min. (g)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bonusRates.map((rate) => (
                    <tr key={rate.id}>
                      <td>{rate.carats}</td>
                      <td>{rate.description || "-"}</td>
                      <td>{(rate.bonusPercentage * 100).toFixed(2)}%</td>
                      <td>{rate.minWeightThreshold || 0} g</td>
                      <td className="actions-cell">
                        <button
                          className="edit-button"
                          onClick={() => handleEditRate(rate)}
                        >
                          Modifier
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteRate(rate.id)}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {editingRate && (
        <div className="edit-form-container">
          <h3>
            {editingRate.id
              ? "Modifier le taux de prime"
              : "Ajouter un taux de prime"}
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="carats">Carats *</label>
              <input
                type="text"
                id="carats"
                name="carats"
                value={editingRate.carats}
                onChange={handleInputChange}
                required
                placeholder="ex: 18K, 24K, etc."
              />
            </div>

            <div className="form-group">
              <label htmlFor="bonusPercentage">Pourcentage de prime (%)*</label>
              <input
                type="number"
                id="bonusPercentage"
                name="bonusPercentage"
                value={editingRate.bonusPercentage}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="minWeightThreshold">
                Seuil minimum de poids (g)
              </label>
              <input
                type="number"
                id="minWeightThreshold"
                name="minWeightThreshold"
                value={editingRate.minWeightThreshold || 0}
                onChange={handleInputChange}
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                name="description"
                value={editingRate.description || ""}
                onChange={handleInputChange}
                placeholder="Description optionnelle"
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="cancel-button" onClick={handleCancelEdit}>
              Annuler
            </button>
            <button className="save-button" onClick={handleSaveRate}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .bonus-settings-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .error-message {
          background-color: #ffebee;
          color: #d32f2f;
          padding: 10px 15px;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .success-message {
          background-color: #e8f5e9;
          color: #2e7d32;
          padding: 10px 15px;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .loading-indicator {
          text-align: center;
          color: #666;
          padding: 20px;
        }

        .add-button {
          background-color: #4caf50;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 4px;
          cursor: pointer;
          margin-bottom: 20px;
          font-weight: 500;
        }

        .add-button:hover {
          background-color: #45a049;
        }

        .table-responsive {
          overflow-x: auto;
          margin-top: 20px;
        }

        .rates-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }

        .rates-table th,
        .rates-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        .rates-table th {
          background-color: #f5f5f5;
          font-weight: 500;
        }

        .rates-table tr:hover {
          background-color: #f9f9f9;
        }

        .actions-cell {
          display: flex;
          gap: 8px;
        }

        .edit-button {
          background-color: #2196f3;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .edit-button:hover {
          background-color: #1976d2;
        }

        .delete-button {
          background-color: #f44336;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .delete-button:hover {
          background-color: #d32f2f;
        }

        .edit-form-container {
          background-color: #f8f8f8;
          border-radius: 8px;
          padding: 20px;
          margin-top: 20px;
          border: 1px solid #eee;
        }

        .form-row {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 15px;
        }

        .form-group {
          flex: 1;
          min-width: 250px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .form-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-top: 20px;
        }

        .cancel-button {
          background-color: #9e9e9e;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }

        .cancel-button:hover {
          background-color: #757575;
        }

        .save-button {
          background-color: #4caf50;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }

        .save-button:hover {
          background-color: #45a049;
        }

        @media (max-width: 768px) {
          .form-group {
            min-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
