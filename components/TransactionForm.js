import axios from "axios";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import styles from "../styles/TransactionForm.module.css";

export default function TransactionForm({ onTransactionAdded }) {
  const { data: session } = useSession();
  const [userInfo, setUserInfo] = useState(null);
  const { register, handleSubmit, reset, watch, setError, clearErrors } =
    useForm();

  // Observer les champs pour la validation conditionnelle
  const watchPhone = watch("phone");
  const watchEmail = watch("clientMail");

  useEffect(() => {
    // Récupérer les informations de l'utilisateur si connecté
    const fetchUserInfo = async () => {
      if (session?.user?.id) {
        try {
          const response = await axios.get(`/api/user`);
          setUserInfo(response.data);
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des données utilisateur",
            error
          );
        }
      }
    };

    if (session) {
      fetchUserInfo();
    }
  }, [session]);

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

      // Si c'est un utilisateur d'agence, définir automatiquement la localisation
      if (session?.user?.role === "agency" && userInfo?.location) {
        data.location = userInfo.location;
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
      console.error("Erreur lors de l'enregistrement de la transaction", error);
      alert(
        "Une erreur est survenue lors de l'enregistrement de la transaction."
      );
    }
  };

  if (!session) {
    return <p>Veuillez vous connecter pour ajouter une transaction.</p>;
  }

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
          <label>Numéro d'ordre</label>
          <input
            {...register("orderNumber")}
            placeholder="Numéro d'ordre"
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

        {/* Montrer le champ de localisation seulement pour les administrateurs */}
        {session.user.role === "admin" && (
          <div>
            <label>Lieu</label>
            <input {...register("location")} placeholder="Lieu" />
          </div>
        )}
        {session.user.role === "agency" && userInfo?.location && (
          <div>
            <label>Lieu</label>
            <input value={userInfo.location} disabled />
          </div>
        )}

        <button type="submit">Enregistrer</button>
      </form>
    </div>
  );
}
