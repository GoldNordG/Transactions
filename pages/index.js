import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";

export default function ProtectedPage() {
  return (
    <div>
      <h1>Bienvenue sur la page des transactions</h1>
      {/* Formulaire pour ajouter une transaction */}
      <TransactionForm />
      {/* Liste des transactions */}
      <TransactionList />
    </div>
  );
}
