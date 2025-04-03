import axios from "axios";
import { useForm } from "react-hook-form";
import styles from "../styles/TransactionForm.module.css";

export default function TransactionForm({ onTransactionAdded }) {
  const { register, handleSubmit, reset, watch, setError, clearErrors } =
    useForm();

  // Observer les champs pour la validation conditionnelle
  const watchPhone = watch("phone");
  const watchEmail = watch("clientMail");

  const onSubmit = async (data) => {
    try {
      // Validation conditionnelle : au moins un des deux champs doit être rempli
      if (!data.phone && !data.clientMail) {
        setError("phone", {
          type: "manual",
          message:
            "Veuillez remplir au moins un des champs : Téléphone ou Adresse mail.",
        });
        setError("clientMail", {
          type: "manual",
          message:
            "Veuillez remplir au moins un des champs : Téléphone ou Adresse mail.",
        });
        return;
      } else {
        clearErrors("phone");
        clearErrors("clientMail");
      }

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
          <label>Prenom du client</label>
          <input
            {...register("clientSurname")}
            placeholder="Prenom du client"
            required
          />
        </div>
        <div>
          <label>Mail du client</label>
          <input {...register("clientMail")} placeholder="Mail du client" />
        </div>
        <div>
          <label>Téléphone</label>
          <input {...register("phone")} placeholder="Téléphone" />
        </div>
        <div>
          <label>Désignation du bien vendu</label>
          <input
            {...register("designation")}
            placeholder="Désignation du bien vendu"
            required
          />
        </div>
        <div>
          <label>Poids (g)</label>
          <input
            {...register("weight")}
            type="number"
            placeholder="Poids (g)"
            step="0.01"
            required
          />
        </div>
        <div>
          <label>Carats</label>
          <input
            {...register("carats")}
            type="number"
            placeholder="Carats"
            required
          />
        </div>
        <div>
          <label>Prix unitaire (EUR)</label>
          <input
            {...register("unitPrice")}
            type="number"
            placeholder="Prix unitaire (EUR)"
            step="0.01"
            required
          />
        </div>
        <div>
          <label>Montant total (EUR)</label>
          <input
            {...register("amount")}
            type="number"
            placeholder="Montant total (EUR)"
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
