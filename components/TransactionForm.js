import axios from "axios";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";

export default function TransactionForm({ onTransactionAdded }) {
  const { data: session } = useSession();
  const [userInfo, setUserInfo] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [jewelryPreview, setJewelryPreview] = useState(null);
  const [paymentPreview, setPaymentPreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    setValue,
  } = useForm();
  const jewelryFileInputRef = useRef(null);
  const paymentFileInputRef = useRef(null);

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

  // Gérer le téléchargement de la photo du bijou
  const handleJewelryPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Prévisualisation de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setJewelryPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Gérer le téléchargement de la preuve de paiement
  const handlePaymentProofUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Prévisualisation de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsUploading(true);

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
        setIsUploading(false);
        return;
      } else {
        clearErrors("phone");
        clearErrors("clientMail");
      }

      // Si c'est un utilisateur d'agence, définir automatiquement la localisation
      if (session?.user?.role === "agency" && userInfo?.location) {
        data.location = userInfo.location;
      }

      // Télécharger les fichiers s'ils existent
      let jewelryPhotoUrl = null;
      let paymentProofUrl = null;

      if (jewelryFileInputRef.current?.files?.[0]) {
        const jewelryFormData = new FormData();
        jewelryFormData.append("file", jewelryFileInputRef.current.files[0]);
        jewelryFormData.append("fileType", "jewelry");
        jewelryFormData.append(
          "location",
          data.location || userInfo?.location || "unknown"
        );

        const jewelryUploadResponse = await axios.post(
          "/api/upload",
          jewelryFormData
        );
        jewelryPhotoUrl = jewelryUploadResponse.data.fileUrl;
      }

      if (paymentFileInputRef.current?.files?.[0]) {
        const paymentFormData = new FormData();
        paymentFormData.append("file", paymentFileInputRef.current.files[0]);
        paymentFormData.append("fileType", "payment");
        paymentFormData.append(
          "location",
          data.location || userInfo?.location || "unknown"
        );

        const paymentUploadResponse = await axios.post(
          "/api/upload",
          paymentFormData
        );
        paymentProofUrl = paymentUploadResponse.data.fileUrl;
      }

      // Ajouter les URLs des fichiers aux données de la transaction
      data.jewelryPhotoUrl = jewelryPhotoUrl;
      data.paymentProofUrl = paymentProofUrl;

      // Envoyer les données à l'API
      await axios.post("/api/transactions", data);

      // Afficher un message de succès
      alert("Transaction enregistrée avec succès !");

      // Réinitialiser le formulaire après soumission
      reset();
      setJewelryPreview(null);
      setPaymentPreview(null);

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
    } finally {
      setIsUploading(false);
    }
  };

  if (!session) {
    return <p>Veuillez vous connecter pour ajouter une transaction.</p>;
  }

  return (
    <div className="form-container">
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
          <label>Numéro de Facture</label>
          <input
            {...register("factureNumber")}
            placeholder="Numéro de Facture"
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
          <input {...register("clientMail")} placeholder="Mail du client" />
        </div>
        <div>
          <label>Téléphone</label>
          <input {...register("phone")} placeholder="Téléphone" />
        </div>
        <div>
          <label>Adresse</label>
          <input {...register("adresse")} placeholder="Adresse" />
        </div>
        <div>
          <label>Code postal</label>
          <input {...register("codePostal")} placeholder="code Postal" />
        </div>
        <div>
          <label>Ville</label>
          <input {...register("ville")} placeholder="Ville" />
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
          <label>Titre (carats)</label>
          <select {...register("carats")} required>
            <option value="">Sélectionner...</option>
            <option value="24">24K</option>
            <option value="22">22K</option>
            <option value="18">18K</option>
            <option value="14">14K</option>
            <option value="9">9K</option>
            <option value="ARG">Argent</option>
            <option value="MET ARG">Métal Argenté</option>
            <option value="PLAT">Platinium</option>
          </select>
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
          <label>Mode de paiement</label>
          <select {...register("paiement")} required>
            <option value="">Sélectionner...</option>
            <option value="cheque">Chèque</option>
            <option value="virement">Virement</option>
          </select>
        </div>

        {/* Section photo du bijou */}
        <div className="file-upload-container">
          <label>Photo du bijou</label>
          <input
            type="file"
            accept="image/*"
            ref={jewelryFileInputRef}
            onChange={handleJewelryPhotoUpload}
          />
          {jewelryPreview && (
            <div className="image-preview">
              <img src={jewelryPreview} alt="Prévisualisation du bijou" />
            </div>
          )}
        </div>

        {/* Section preuve de paiement */}
        <div className="file-upload-container">
          <label>Preuve de paiement (RIB/Chèque)</label>
          <input
            type="file"
            accept="image/*"
            ref={paymentFileInputRef}
            onChange={handlePaymentProofUpload}
          />
          {paymentPreview && (
            <div className="image-preview">
              <img
                src={paymentPreview}
                alt="Prévisualisation de la preuve de paiement"
              />
            </div>
          )}
        </div>

        {/* Montrer le champ de localisation seulement pour les administrateurs */}
        {session.user.role === "admin" && (
          <div>
            <label>Agence</label>
            <input {...register("location")} placeholder="Agence" />
          </div>
        )}
        {session.user.role === "agency" && userInfo?.location && (
          <div>
            <label>Agence</label>
            <input value={userInfo.location} disabled />
          </div>
        )}

        <button type="submit" disabled={isUploading}>
          {isUploading ? "Téléchargement en cours..." : "Enregistrer"}
        </button>
      </form>

      <style jsx>{`
        .file-upload-container {
          margin-bottom: 15px;
        }
        .image-preview {
          margin-top: 10px;
          max-width: 300px;
        }
        .image-preview img {
          width: 100%;
          height: auto;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 5px;
        }
      `}</style>
    </div>
  );
}
