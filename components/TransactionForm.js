import { useForm } from "react-hook-form";
import axios from "axios";

export default function TransactionForm() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post("/api/transactions", data);
      alert("Transaction enregistrée avec succès !");
      reset();
    } catch (error) {
      console.error("Erreur lors de l’enregistrement de la transaction", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("date")} type="date" placeholder="Date" required />
      <input {...register("clientName")} placeholder="Nom du client" required />
      <input
        {...register("orderNumber")}
        placeholder="Numéro d’ordre"
        required
      />
      <input
        {...register("amount")}
        type="number"
        placeholder="Montant"
        required
      />
      <button type="submit">Enregistrer</button>
    </form>
  );
}
