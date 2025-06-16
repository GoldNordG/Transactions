// Ajoutez cette fonction dans votre fichier upload.js ou créez un fichier lib/driveUtils.js

import { google } from "googleapis";
import { Readable } from "stream";

// Utiliser la même configuration que votre upload.js
const authenticateGoogleDrive = async () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  const drive = google.drive({
    version: "v3",
    auth,
  });

  return drive;
};

// Fonction pour convertir un Buffer en Stream
const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
};

// Fonction pour obtenir/créer le dossier Factures pour une agence
const getInvoiceFolderId = async (drive, agencyName) => {
  const parentFolderId = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID;

  if (!parentFolderId) {
    throw new Error(
      "GOOGLE_DRIVE_PARENT_FOLDER_ID is not set in environment variables"
    );
  }

  let agencyFolderId;

  // Rechercher le dossier d'agence
  const agencyFolderResponse = await drive.files.list({
    q: `name='${agencyName}' and '${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: "files(id, name)",
  });

  if (agencyFolderResponse.data.files.length > 0) {
    agencyFolderId = agencyFolderResponse.data.files[0].id;
  } else {
    // Créer le dossier d'agence s'il n'existe pas
    const agencyFolderMetadata = {
      name: agencyName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentFolderId],
    };

    const agencyFolder = await drive.files.create({
      resource: agencyFolderMetadata,
      fields: "id",
    });

    agencyFolderId = agencyFolder.data.id;
  }

  // Rechercher ou créer le sous-dossier "Factures"
  const invoiceFolderResponse = await drive.files.list({
    q: `name='Factures' and '${agencyFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: "files(id, name)",
  });

  if (invoiceFolderResponse.data.files.length > 0) {
    return invoiceFolderResponse.data.files[0].id;
  } else {
    // Créer le sous-dossier Factures
    const invoiceFolderMetadata = {
      name: "Factures",
      mimeType: "application/vnd.google-apps.folder",
      parents: [agencyFolderId],
    };

    const invoiceFolder = await drive.files.create({
      resource: invoiceFolderMetadata,
      fields: "id",
    });

    return invoiceFolder.data.id;
  }
};

// Fonction pour uploader une facture PDF vers Google Drive
export const uploadInvoiceToDrive = async (
  pdfBuffer,
  fileName,
  agencyName,
  orderNumber,
  clientName
) => {
  try {
    const drive = await authenticateGoogleDrive();
    const folderId = await getInvoiceFolderId(drive, agencyName);

    // Créer un nom de fichier sécurisé
    const safeClientName = clientName.replace(/[^a-zA-Z0-9]/g, "_");
    const safeFileName = `${orderNumber}_${safeClientName}_${fileName}`;

    const fileMetadata = {
      name: safeFileName,
      parents: [folderId],
    };

    // Convertir le Buffer en Stream
    const media = {
      mimeType: "application/pdf",
      body: bufferToStream(pdfBuffer),
    };

    const driveResponse = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id, webViewLink",
    });

    console.log(
      `Facture uploadée avec succès: ${safeFileName} (ID: ${driveResponse.data.id})`
    );

    return {
      fileUrl: driveResponse.data.webViewLink,
      fileId: driveResponse.data.id,
    };
  } catch (error) {
    console.error("Erreur lors de l'upload de la facture vers Drive:", error);
    throw error;
  }
};
