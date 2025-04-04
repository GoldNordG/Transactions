import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import { signOut } from "next-auth/react";

// Dans votre header

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);

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
          {session.user.role === "admin" ? (
            <p>Connecté en tant qu'Administrateur | {session.user.email}</p>
          ) : (
            <p>Connecté en tant qu'Agence {session.user.email}</p>
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

        <section className="transaction-list">
          <TransactionList />
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
      `}</style>
    </div>
  );
}
