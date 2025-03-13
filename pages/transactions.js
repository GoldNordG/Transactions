import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";

export default function Transactions() {
  return (
    <div>
      <h1>Suivi des Transactions</h1>
      <TransactionForm />
      <TransactionList />
    </div>
  );
}
