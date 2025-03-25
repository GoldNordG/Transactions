import { getServerSession } from "../utils/getServerSession";

export { getServerSession as getServerSideProps };

export default function ProtectedPage({ session }) {
  console.log("Session reçue dans le composant :", session);

  if (!session || !session.user) {
    return <p>Chargement ou utilisateur non authentifié...</p>;
  }

  return (
    <div>
      <h1>
        Bienvenue, {session.user.email} (Rôle : {session.user.role})
      </h1>
    </div>
  );
}
