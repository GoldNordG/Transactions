import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function SessionManager() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Si le statut passe de "authenticated" à "unauthenticated"
    if (status === "unauthenticated" && !router.pathname.startsWith("/login")) {
      router.push("/login?session=expired");
    }
  }, [status, router]);

  return null;
}

// Dans _app.js, ajoutez ce composant
import SessionManager from "../components/SessionManager";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <SessionManager />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
