import axios from "axios";
import { useForm } from "react-hook-form";
import styles from "../styles/TransactionForm.module.css";

export default function TransactionForm({ onTransactionAdded }) {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      // Envoyer les données à l'API
      await axios.post("/api/transactions", data);

      // Afficher un message de succès
      alert("Transaction enregistrée avec succès !");

      // Réinitialiser le formulaire après soumission
      reset();

      // Émettre un événement pour informer le composant parent
      if (onTransactionAdded) {
        onTransactionAdded();
      }
    } catch (error) {
      // Gérer les erreurs
      console.error("Erreur lors de l’enregistrement de la transaction", error);
      alert(
        "Une erreur est survenue lors de l’enregistrement de la transaction."
      );
    }
  };

  return (
    <div className={styles["form-container"]}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Date de la transaction</label>
          <input
            {...register("date")}
            type="date"
            placeholder="Date"
            required
          />
        </div>
        <div>
          <label>Numéro d’ordre</label>
          <input
            {...register("orderNumber")}
            placeholder="Numéro d’ordre"
            type="number"
            required
          />
        </div>
        <div>
          <label>Nom du client</label>
          <input
            {...register("clientName")}
            placeholder="Nom du client"
            required
          />
        </div>
        <div>
          <label>Mail du client</label>
          <input
            {...register("clientMail")}
            placeholder="Mail du client"
            required
          />
        </div>

        <div>
          <label>Montant de la transaction</label>
          <input
            {...register("amount")}
            type="number"
            placeholder="Montant"
            step="0.01"
            required
          />
        </div>

        <div>
          <label>Lieu</label>
          <input {...register("location")} placeholder="Lieu" />
        </div>

        <button type="submit">Enregistrer</button>
      </form>
    </div>
  );
}
