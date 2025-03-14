import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function useAuth() {
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Ne rien faire pendant le chargement
    if (!session) {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      signIn();
    }
  }, [session, status, router]);

  return session;
}
