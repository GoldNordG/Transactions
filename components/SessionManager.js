// components/SessionManager.js
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SessionManager() {
  const { status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Introduire un délai pour permettre à NextAuth de s'initialiser
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Ne déclencher la redirection que si:
    // 1. Le statut n'est pas en cours de chargement
    // 2. Le composant a terminé son délai d'initialisation
    // 3. L'utilisateur n'est pas authentifié
    // 4. L'utilisateur n'est pas déjà sur la page de login
    if (
      !isLoading &&
      status === "unauthenticated" &&
      !router.pathname.startsWith("/login")
    ) {
      console.log("Session expirée, redirection vers login");
      router.push("/login?session=expired");
    }
  }, [status, router, isLoading]);

  // Configuration de l'intercepteur Axios (inchangée)
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.log("Erreur 401 détectée, redirection vers login");
          if (!window.location.pathname.startsWith("/login")) {
            router.push("/login?session=expired");
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [router]);

  return null;
}
