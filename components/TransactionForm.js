import axios from "axios";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";

export default function TransactionForm({ onTransactionAdded }) {
  const { data: session } = useSession();
  const [userInfo, setUserInfo] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fixed: Use consistent naming for payment preview (singular since it's one file)
  const [jewelryPreviews, setJewelryPreviews] = useState([]);
  const [paymentPreview, setPaymentPreview] = useState(null);

  const [totalAmount, setTotalAmount] = useState(0);
  const { register, handleSubmit, reset, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        items: [
          {
            designation: "",
            carats: "",
            weight: "",
            unitPrice: "0.00", // Prix au gramme affiché à 0.00
            subtotal: "",
          },
        ],
        phone: "",
        clientMail: "",
      },
      mode: "onChange",
    });

  // Utilisation de useFieldArray pour gérer les éléments multiples
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Utiliser des références multiples pour les fichiers
  const jewelryFileInputRef = useRef(null);
  const paymentFileInputRef = useRef(null);

  // Observer les items pour calculer le total
  const watchItems = watch("items");

  // Recalculer tous les prix au gramme et le total
  const recalculateAll = () => {
    const values = getValues();
    let newTotal = 0;

    if (values.items && values.items.length > 0) {
      values.items.forEach((item, index) => {
        const weight = parseFloat(item.weight) || 0;
        const subtotal = parseFloat(item.subtotal) || 0;

        // Calculer le prix au gramme en gardant plus de précision
        let unitPrice = 0;
        if (weight > 0) {
          // Garder 4 décimales pour la précision interne
          unitPrice = subtotal / weight;
        }

        // Afficher seulement 2 décimales pour l'interface utilisateur
        setValue(`items.${index}.unitPrice`, unitPrice.toFixed(2));

        // Pour le total, utiliser directement le sous-total saisi (pas recalculé)
        newTotal += subtotal;
      });
    }

    // Le total est la somme exacte des sous-totaux saisis
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

  // Gérer le téléchargement de plusieurs photos de bijoux
  const handleJewelryPhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newPreviews = [];

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push({
            preview: reader.result,
            file: file,
            type: file.type,
            name: file.name,
          });
          if (newPreviews.length === files.length) {
            setJewelryPreviews((prev) => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Fixed: Gérer le téléchargement d'une preuve de paiement
  const handlePaymentProofUpload = (e) => {
    const file = e.target.files[0]; // Prendre seulement le premier fichier
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentPreview({
          preview: reader.result,
          file: file,
          type: file.type,
          name: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Supprimer une photo de bijou
  const removeJewelryPhoto = (index) => {
    const newPreviews = [...jewelryPreviews];
    newPreviews.splice(index, 1);
    setJewelryPreviews(newPreviews);
  };

  // Fixed: Supprimer la preuve de paiement (singular)
  const removePaymentProof = () => {
    setPaymentPreview(null);
  };

  // Ajouter un nouvel item
  const addItem = () => {
    append({
      designation: "",
      carats: "",
      weight: "",
      unitPrice: "0.00",
      subtotal: "",
    });
  };

  // Gérer les changements de valeur et forcer le recalcul
  const handleValueChange = (index, field) => (e) => {
    const value = e.target.value;
    setValue(`items.${index}.${field}`, value);

    // Recalculer le prix au gramme et le total
    setTimeout(recalculateAll, 0);
  };

  const onSubmit = async (data) => {
    try {
      setIsUploading(true);

      // Si c'est un utilisateur d'agence, définir automatiquement la localisation
      if (session?.user?.role === "agency" && userInfo?.location) {
        data.location = userInfo.location;
      }

      // Télécharger les fichiers s'ils existent
      const jewelryPhotoUrls = [];

      // Télécharger toutes les photos de bijoux
      if (jewelryPreviews.length > 0) {
        for (let i = 0; i < jewelryPreviews.length; i++) {
          const jewelryFormData = new FormData();
          jewelryFormData.append("file", jewelryPreviews[i].file);
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
          jewelryPhotoUrls.push(jewelryUploadResponse.data.fileUrl);
        }
      }

      // Fixed: Télécharger la preuve de paiement (singular)
      let paymentProofUrl = null;
      if (paymentPreview) {
        const paymentFormData = new FormData();
        paymentFormData.append("file", paymentPreview.file);
        paymentFormData.append("fileType", "payment");
        paymentFormData.append(
          "location",
          data.location || userInfo?.location || "unknown"
        );
        paymentFormData.append("orderNumber", data.orderNumber);
        paymentFormData.append("clientName", data.clientName);

        const paymentUploadResponse = await axios.post(
          "/api/upload",
          paymentFormData
        );
        paymentProofUrl = paymentUploadResponse.data.fileUrl;
      }

      // Fixed: Ajouter les URLs des fichiers aux données de la transaction
      data.jewelryPhotoUrls = jewelryPhotoUrls;
      data.paymentProofUrl = paymentProofUrl; // singular since it's one file

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
            unitPrice: "0.00",
            subtotal: "",
          },
        ],
        phone: "",
        clientMail: "",
      });
      setJewelryPreviews([]);
      setPaymentPreview(null); // Fixed: use singular
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
              <label>Numéro d&apos;ordre</label>
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
                        <option value="DENTAIRE">Or dentaire</option>
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
                        readOnly
                        placeholder="0.00"
                        style={{ backgroundColor: "#f5f5f5" }}
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
                        placeholder="Sous-total"
                        required
                        onChange={(e) => {
                          field.onChange(e);
                          handleValueChange(index, "subtotal")(e);
                        }}
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
            {/* Section photos des bijoux - maintenant avec support multi-upload */}
            <div className="file-upload-container">
              <label>Photos des bijoux</label>
              <button
                type="button"
                onClick={() => jewelryFileInputRef.current?.click()}
                className="add-button"
              >
                Ajouter des photos de bijoux
              </button>
              <input
                type="file"
                accept="image/*, application/pdf"
                ref={jewelryFileInputRef}
                onChange={handleJewelryPhotoUpload}
                multiple
                style={{ display: "none" }}
              />

              {jewelryPreviews.length > 0 && (
                <div className="image-previews-container">
                  {jewelryPreviews.map((preview, index) => (
                    <div key={index} className="image-preview-wrapper">
                      <div className="image-preview">
                        <Image
                          src={preview.preview}
                          alt={`Bijou ${index + 1}`}
                          width={300}
                          height={200}
                        />
                      </div>
                      <button
                        type="button"
                        className="remove-image-button"
                        onClick={() => removeJewelryPhoto(index)}
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Fixed: Section preuve de paiement - une seule photo */}
            <div className="file-upload-container">
              <label>RIB/Chèque</label>
              <button
                type="button"
                onClick={() => paymentFileInputRef.current?.click()}
                className="add-button"
              >
                Ajouter un RIB / chèque
              </button>
              <input
                type="file"
                accept="image/*, application/pdf"
                ref={paymentFileInputRef}
                onChange={handlePaymentProofUpload}
                style={{ display: "none" }}
              />

              {/* Fixed: Aperçu de la preuve de paiement */}
              {paymentPreview && (
                <div className="image-previews-container">
                  <div className="image-preview-wrapper">
                    <div className="image-preview">
                      {paymentPreview.type === "application/pdf" ? (
                        <div className="pdf-preview">
                          <div className="pdf-icon">📄</div>
                          <p className="file-name">{paymentPreview.name}</p>
                          <a
                            href={paymentPreview.preview}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pdf-link"
                          >
                            Ouvrir le PDF
                          </a>
                        </div>
                      ) : (
                        <Image
                          src={paymentPreview.preview}
                          alt="Preuve de paiement"
                          width={300}
                          height={200}
                        />
                      )}
                    </div>
                    <button
                      type="button"
                      className="remove-image-button"
                      onClick={removePaymentProof}
                    >
                      Supprimer
                    </button>
                  </div>
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
              <select {...register("location")} required>
                <option value="">Choisir...</option>
                <option value="Maubeuge">Maubeuge</option>
                <option value="Fourmies">Fourmies</option>
                <option value="Chaumont">Chaumont</option>
                <option value="Beauvais">Beauvais</option>
                <option value="Saint-Quentin">Saint-Quentin</option>
                <option value="Saint-Dizier">Saint-Dizier</option>
                <option value="Le Puy-En-Velay">Le Puy-En-Velay</option>
                <option value="Compiegne">Compiegne</option>
                <option value="Dourdan">Dourdan</option>
                <option value="Deux">Dreux</option>
                <option value="Aurillac">Aurillac</option>
                <option value="Vitry-Le-Francois">Vitry-Le-Francois</option>
              </select>
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

      <style jsx>{`
        .image-previews-container {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-top: 10px;
        }

        .image-preview-wrapper {
          position: relative;
          margin-bottom: 15px;
          border: 1px solid #ddd;
          padding: 10px;
          border-radius: 5px;
        }

        .remove-image-button {
          margin-top: 5px;
          padding: 5px 10px;
          background-color: #f44336;
          color: white;
          border: none;
          border-radius: 3px;
          cursor: pointer;
        }

        .remove-image-button:hover {
          background-color: #d32f2f;
        }

        .pdf-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background-color: #f5f5f5;
          border: 2px dashed #ccc;
          border-radius: 8px;
          min-height: 200px;
          width: 300px;
        }

        .pdf-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }

        .file-name {
          margin: 10px 0;
          font-weight: bold;
          text-align: center;
          word-break: break-word;
          color: #333;
        }

        .pdf-link {
          color: #007bff;
          text-decoration: none;
          padding: 8px 16px;
          background-color: #e7f3ff;
          border: 1px solid #007bff;
          border-radius: 4px;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .pdf-link:hover {
          background-color: #007bff;
          color: white;
        }
      `}</style>
    </div>
  );
}
