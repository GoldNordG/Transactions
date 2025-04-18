// components/SessionManager.js
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios"; // Assurez-vous d'importer axios

export default function SessionManager() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Gestion de la session expirée
    if (status === "unauthenticated" && !router.pathname.startsWith("/login")) {
      console.log("Session expirée, redirection vers login");
      router.push("/login?session=expired");
    }
  }, [status, router]);

  // Configurer l'intercepteur Axios pour gérer les erreurs 401
  useEffect(() => {
    // Ajout d'un intercepteur global pour les réponses Axios
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Si on reçoit une erreur 401 (non authentifié)
        if (error.response?.status === 401) {
          console.log("Erreur 401 détectée, redirection vers login");

          // Éviter les boucles infinies si déjà sur la page de login
          if (!window.location.pathname.startsWith("/login")) {
            router.push("/login?session=expired");
          }
        }
        return Promise.reject(error);
      }
    );

    // Nettoyage de l'intercepteur lors du démontage du composant
    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [router]);

  return null;
}
