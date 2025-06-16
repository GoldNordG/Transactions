import { useState } from "react";

export default function TransactionSearch({ onSearch }) {
  const [filters, setFilters] = useState({
    location: "",
    startDate: "",
    endDate: "",
    carats: "",
  });

  // Liste des agences disponibles
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
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      location: "",
      startDate: "",
      endDate: "",
      carats: "",
    });
    onSearch({}); // Réinitialise la recherche
  };

  return (
    <div className="search-container">
      <h3>Rechercher des transactions</h3>
      <form onSubmit={handleSubmit}>
        <div className="search-grid">
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
          <button type="submit" className="search-button">
            Rechercher
          </button>
          <button type="button" onClick={handleReset} className="reset-button">
            Réinitialiser
          </button>
        </div>
      </form>

      <style jsx>{`
        .search-container {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .search-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
        }
        .form-group {
          margin-bottom: 10px;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
        }
        .form-group input,
        .form-group select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .button-group {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }
        .search-button {
          background-color: #4caf50;
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 4px;
          cursor: pointer;
        }
        .reset-button {
          background-color: #f44336;
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
