import { useSession, signIn } from "next-auth/react";
import TransactionList from "../components/TransactionList";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    signIn();
    return null; // Render nothing while redirecting
  }

  return (
    <div>
      <h1>Suivi des Transactions</h1>
      <TransactionList />
    </div>
  );
}
