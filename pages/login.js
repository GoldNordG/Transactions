import { signIn, useSession } from "next-auth/react";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        setError("Identifiants invalides. Veuillez réessayer.");
      } else {
        setError("Une erreur est survenue. Veuillez réessayer plus tard.");
      }
      setLoading(false);
    } else if (result?.ok) {
      // Si la connexion est réussie, rediriger vers la page d'accueil
      router.push("/");
    }
  };
  // Dans login.js
  useEffect(() => {
    // Vérifier si la session a expiré
    if (router.query.session === "expired") {
      setError("Votre session a expiré. Veuillez vous reconnecter.");
    }
  }, [router.query]);

  if (status === "loading" || status === "authenticated") {
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
