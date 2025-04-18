import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import SessionManager from "../components/SessionManager";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <SessionManager />
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
