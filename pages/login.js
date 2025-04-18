// pages/login.js
import { signIn, useSession, getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Rediriger si déjà connecté
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Vérifier si la session a expiré (paramètre dans l'URL)
  useEffect(() => {
    if (router.query.session === "expired") {
      setError("Votre session a expiré. Veuillez vous reconnecter.");
    } else if (router.query.error) {
      // Gérer d'autres erreurs possibles
      setError("Erreur d'authentification. Veuillez vous reconnecter.");
    }
  }, [router.query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          setError("Email ou mot de passe incorrect");
        } else {
          setError("Une erreur est survenue lors de la connexion");
        }
      } else if (result?.ok) {
        // Mise à jour de la session avant redirection
        const newSession = await getSession();
        if (newSession) {
          router.push("/");
        } else {
          setError("Problème d'initialisation de session");
        }
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setError("Une erreur inattendue s'est produite");
    } finally {
      setLoading(false);
    }
  };

  // Afficher un message de chargement pendant la vérification de statut
  if (status === "loading") {
    return <div>Chargement...</div>;
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Gold Nord</h1>
        <h2>Connexion</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe :</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Chargement..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
