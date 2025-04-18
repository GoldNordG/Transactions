import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import PreTraqueFra from "../components/PreTraqueFra";
import { signOut } from "next-auth/react";
import TraqueFra from "../components/TraqueFra";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("transactions");

  useEffect(() => {
    // Rediriger vers la page de connexion si non authentifié
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Afficher un message de chargement pendant la vérification de l'authentification
  if (status === "loading") {
    return <div>Chargement...</div>;
  }

  if (!session) {
    return null; // Éviter de montrer du contenu pendant la redirection
  }

  return (
    <div className="container">
      <header>
        <h1>Système de Gestion Gold Nord</h1>
        <div className="user-info">
          {session.user.role === "superadmin" ? (
            <p>
              Connecté en tant que Super Administrateur | {session.user.email}
            </p>
          ) : session.user.role === "admin" ? (
            <p>Connecté en tant qu'Administrateur | {session.user.email}</p>
          ) : (
            <p>Connecté en tant qu'Agence {session.user.location}</p>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="logout-button"
          >
            Se déconnecter
          </button>
        </div>
      </header>

      <main>
        <section>
          <h2>Ajouter une nouvelle transaction</h2>
          <TransactionForm
            onTransactionAdded={() => {
              // Force refresh des transactions lorsqu'une nouvelle est ajoutée
              window.location.reload();
            }}
          />
        </section>

        {/* Onglets de navigation */}
        <div className="tabs-container">
          <div className="tabs">
            <button
              className={`tab-button ${
                activeTab === "transactions" ? "active" : ""
              }`}
              onClick={() => setActiveTab("transactions")}
            >
              Liste des Transactions
            </button>
            {/* N'afficher l'onglet "Pré-Traque Fra" que pour les superadmins */}
            {session.user.role === "superadmin" && (
              <button
                className={`tab-button ${
                  activeTab === "preTraqueFra" ? "active" : ""
                }`}
                onClick={() => setActiveTab("preTraqueFra")}
              >
                Pré-Traque Fra
              </button>
            )}
            {/* N'afficher l'onglet "Pré-Traque Fra" que pour les superadmins */}
            {session.user.role === "superadmin" && (
              <button
                className={`tab-button ${
                  activeTab === "traqueFra" ? "active" : ""
                }`}
                onClick={() => setActiveTab("traqueFra")}
              >
                Traque Fra
              </button>
            )}
          </div>
        </div>

        {/* Contenu des onglets */}
        {/* Contenu des onglets */}
        <section className="tab-content">
          {activeTab === "transactions" && <TransactionList />}
          {activeTab === "preTraqueFra" &&
            session.user.role === "superadmin" && <PreTraqueFra />}
          {activeTab === "traqueFra" && session.user.role === "superadmin" && (
            <TraqueFra />
          )}
        </section>
      </main>

      <style jsx>{`
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 10px;
        }
        .user-info {
          text-align: right;
        }
        .logout-button {
          margin-left: 10px;
          padding: 5px 10px;
          background-color: #f44336;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .logout-button:hover {
          background-color: #d32f2f;
        }
        .tabs-container {
          margin: 30px 0 20px;
        }
        .tabs {
          display: flex;
          border-bottom: 1px solid #ddd;
        }
        .tab-button {
          padding: 10px 20px;
          cursor: pointer;
          background: transparent;
          border: none;
          border-bottom: 3px solid transparent;
          font-size: 16px;
          transition: all 0.3s;
          margin-right: 5px;
        }
        .tab-button.active {
          color: #4caf50;
          border-bottom: 3px solid #4caf50;
          font-weight: bold;
        }
        .tab-button:hover:not(.active) {
          background-color: #f9f9f9;
          border-bottom: 3px solid #ddd;
        }
        .tab-content {
          padding: 20px 0;
        }
      `}</style>
    </div>
  );
}
