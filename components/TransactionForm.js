import axios from "axios";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";

export default function TransactionForm({ onTransactionAdded }) {
  const { data: session } = useSession();
  const [userInfo, setUserInfo] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [jewelryPreview, setJewelryPreview] = useState(null);
  const [paymentPreview, setPaymentPreview] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    setValue,
    control,
    getValues,
  } = useForm({
    defaultValues: {
      items: [
        {
          designation: "",
          carats: "",
          weight: "",
          unitPrice: "",
          subtotal: "0",
        },
      ],
    },
    mode: "onChange", // Activer la validation au changement
  });

  // Utilisation de useFieldArray pour gérer les éléments multiples
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const jewelryFileInputRef = useRef(null);
  const paymentFileInputRef = useRef(null);

  // Observer les items pour calculer le total
  const watchItems = watch("items");

  // Recalculer tous les sous-totaux et le total
  const recalculateAll = () => {
    const values = getValues();
    let newTotal = 0;

    if (values.items && values.items.length > 0) {
      values.items.forEach((item, index) => {
        const weight = parseFloat(item.weight) || 0;
        const price = parseFloat(item.unitPrice) || 0;
        const subtotal = weight * price;

        // Mettre à jour le sous-total de cet item
        setValue(`items.${index}.subtotal`, subtotal.toFixed(2));

        // Ajouter au total
        newTotal += subtotal;
      });
    }

    // Mettre à jour le total
    setTotalAmount(newTotal);
    setValue("amount", newTotal.toFixed(2));
  };

  // Appeler recalculateAll à chaque modification des items
  useEffect(() => {
    recalculateAll();
  }, [watchItems]);

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

  // Ajouter un nouvel item
  const addItem = () => {
    append({
      designation: "",
      carats: "",
      weight: "",
      unitPrice: "",
      subtotal: "0",
    });
  };

  // Gérer les changements de valeur et forcer le recalcul
  const handleValueChange = (index, field) => (e) => {
    const value = e.target.value;
    setValue(`items.${index}.${field}`, value);

    // Recalculer le sous-total et le total
    setTimeout(recalculateAll, 0);
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
        // Ajouter les informations du client et de la commande
        jewelryFormData.append("orderNumber", data.orderNumber);
        jewelryFormData.append("clientName", data.clientName);

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
        // Ajouter les informations du client et de la commande
        paymentFormData.append("orderNumber", data.orderNumber);
        paymentFormData.append("clientName", data.clientName);

        const paymentUploadResponse = await axios.post(
          "/api/upload",
          paymentFormData
        );
        paymentProofUrl = paymentUploadResponse.data.fileUrl;
      }

      // Ajouter les URLs des fichiers aux données de la transaction
      data.jewelryPhotoUrl = jewelryPhotoUrl;
      data.paymentProofUrl = paymentProofUrl;

      // S'assurer que items est bien formaté pour l'API
      // Calculer le poids total pour la compatibilité
      const totalWeight = data.items.reduce(
        (sum, item) => sum + parseFloat(item.weight || 0),
        0
      );
      data.weight = totalWeight;

      // Envoyer les données à l'API
      await axios.post("/api/transactions", data);

      // Afficher un message de succès
      alert("Transaction enregistrée avec succès !");

      // Réinitialiser le formulaire après soumission
      reset({
        items: [
          {
            designation: "",
            carats: "",
            weight: "",
            unitPrice: "",
            subtotal: "0",
          },
        ],
      });
      setJewelryPreview(null);
      setPaymentPreview(null);
      setTotalAmount(0);

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
        <div className="form-section">
          <h3>Informations client</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Date de la transaction</label>
              <input
                {...register("date")}
                type="date"
                placeholder="Date"
                required
              />
            </div>
            <div className="form-group">
              <label>Numéro de Facture</label>
              <input
                {...register("factureNumber")}
                placeholder="Numéro de Facture"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Numéro d'ordre</label>
              <input
                {...register("orderNumber")}
                placeholder="Numéro d'ordre"
                type="number"
                required
              />
            </div>
            <div className="form-group">
              <label>Nom du client</label>
              <input
                {...register("clientName")}
                placeholder="Nom du client"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Mail du client</label>
              <input {...register("clientMail")} placeholder="Mail du client" />
            </div>
            <div className="form-group">
              <label>Téléphone</label>
              <input {...register("phone")} placeholder="Téléphone" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Adresse</label>
              <input {...register("adresse")} placeholder="Adresse" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Code postal</label>
              <input {...register("codePostal")} placeholder="Code postal" />
            </div>
            <div className="form-group">
              <label>Ville</label>
              <input {...register("ville")} placeholder="Ville" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Articles</h3>
          <div className="items-container">
            <div className="items-header">
              <div>Désignation</div>
              <div>Carats</div>
              <div>Poids (g)</div>
              <div>Prix au Gramme (€)</div>
              <div>Sous-total (€)</div>
              <div> </div>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="item-row">
                <div>
                  <Controller
                    name={`items.${index}.designation`}
                    control={control}
                    render={({ field }) => (
                      <input {...field} placeholder="Désignation" required />
                    )}
                  />
                </div>
                <div>
                  <Controller
                    name={`items.${index}.carats`}
                    control={control}
                    render={({ field }) => (
                      <select {...field} required>
                        <option value="">Choisir...</option>
                        <option value="24">24K</option>
                        <option value="22">22K</option>
                        <option value="18">18K</option>
                        <option value="14">14K</option>
                        <option value="9">9K</option>
                        <option value="ARG">Argent</option>
                        <option value="MET ARG">Métal Argenté</option>
                        <option value="PLAT">Platinium</option>
                      </select>
                    )}
                  />
                </div>
                <div>
                  <Controller
                    name={`items.${index}.weight`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        step="0.01"
                        placeholder="Poids"
                        required
                        onChange={(e) => {
                          field.onChange(e);
                          handleValueChange(index, "weight")(e);
                        }}
                      />
                    )}
                  />
                </div>
                <div>
                  <Controller
                    name={`items.${index}.unitPrice`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        step="0.01"
                        placeholder="Prix"
                        required
                        onChange={(e) => {
                          field.onChange(e);
                          handleValueChange(index, "unitPrice")(e);
                        }}
                      />
                    )}
                  />
                </div>
                <div>
                  <Controller
                    name={`items.${index}.subtotal`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        step="0.01"
                        readOnly
                        placeholder="0.00"
                      />
                    )}
                  />
                </div>
                <div>
                  {index > 0 && (
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => {
                        remove(index);
                        // Recalculer le total après suppression
                        setTimeout(recalculateAll, 0);
                      }}
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="add-item-container">
            <button type="button" className="add-button" onClick={addItem}>
              Ajouter un article
            </button>
          </div>

          <div className="total-amount">
            <label>Montant total :</label>
            <input
              {...register("amount")}
              type="number"
              step="0.01"
              value={totalAmount.toFixed(2)}
              readOnly
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Paiement et photos</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Mode de paiement</label>
              <select {...register("paiement")} required>
                <option value="">Sélectionner...</option>
                <option value="cheque">Chèque</option>
                <option value="virement">Virement</option>
              </select>
            </div>
          </div>

          <div className="form-row">
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
              <label>RIB/Chèque</label>
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
          </div>
        </div>

        {/* Montrer le champ de localisation seulement pour les administrateurs */}
        {(session.user.role === "admin" ||
          session.user.role === "superadmin") && (
          <div className="form-row">
            <div className="form-group">
              <label>Agence</label>
              <input {...register("location")} placeholder="Agence" />
            </div>
          </div>
        )}
        {session.user.role === "agency" && userInfo?.location && (
          <div className="form-row">
            <div className="form-group">
              <label>Agence</label>
              <input value={userInfo.location} disabled />
            </div>
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            disabled={isUploading}
            className="submit-button"
          >
            {isUploading ? "Téléchargement en cours..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}
