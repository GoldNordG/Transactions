// pages/admin/bonus.js
import { useState } from "react";
import { useSession } from "next-auth/react";
import AgencyBonusReport from "../../components/Bonus/AgencyBonusReport";
import AgencyBonusSettings from "../../components/Bonus/AgencyBonusSettings";

export default function BonusAdminPage() {
  const [activeTab, setActiveTab] = useState("report"); // "report" ou "settings"
  const { data: session, status } = useSession();

  // Vérifier si l'utilisateur est connecté et a les droits
  if (status === "loading") {
    return <p>Chargement de la session...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Veuillez vous connecter pour accéder à cette page.</p>;
  }

  const isAdminOrSuperAdmin =
    session?.user?.role === "admin" || session?.user?.role === "superadmin";

  if (!isAdminOrSuperAdmin) {
    return <p>Vous n&apos;avez pas les droits pour accéder à cette page.</p>;
  }

  return (
    <div className="bonus-admin-container">
      <h1>Gestion des Primes</h1>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "report" ? "active" : ""}`}
          onClick={() => setActiveTab("report")}
        >
          Rapports des Primes
        </button>
        <button
          className={`tab-button ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          Configuration des Primes
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "report" && <AgencyBonusReport />}
        {activeTab === "settings" && <AgencyBonusSettings />}
      </div>

      <style jsx>{`
        .bonus-admin-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        h1 {
          margin-bottom: 20px;
        }

        .tabs {
          display: flex;
          border-bottom: 1px solid #ddd;
          margin-bottom: 20px;
        }

        .tab-button {
          background: none;
          border: none;
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          font-weight: 500;
        }

        .tab-button:hover {
          background-color: #f5f5f5;
        }

        .tab-button.active {
          border-bottom: 3px solid #4caf50;
          color: #4caf50;
        }

        .tab-content {
          background-color: white;
          border-radius: 8px;
          padding: 1px; /* Petit hack pour éviter le collapsing des marges */
        }
      `}</style>
    </div>
  );
}
