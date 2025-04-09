import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { google } from "googleapis";
import { formidable } from "formidable";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Configuration pour le parseur de formulaire
export const config = {
  api: {
    bodyParser: false,
  },
};

// Configuration de Google Drive API
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

// Obtenir les ID des dossiers par agence
const getFolderIdByAgency = async (drive, agencyName, fileType) => {
  // ID du dossier parent pour toutes les agences
  const parentFolderId = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID;

  console.log("Using parent folder ID:", parentFolderId);
  console.log("Agency name:", agencyName);
  console.log("File type:", fileType);

  // Validate parentFolderId
  if (!parentFolderId) {
    throw new Error(
      "GOOGLE_DRIVE_PARENT_FOLDER_ID is not set in environment variables"
    );
  }

  let agencyFolderId;
  try {
    // First check if we can access the parent folder
    try {
      const parentFolder = await drive.files.get({
        fileId: parentFolderId,
        fields: "id,name",
      });
      console.log(
        "Successfully accessed parent folder:",
        parentFolder.data.name
      );
    } catch (folderError) {
      console.error("Failed to access parent folder:", folderError.message);
      console.error(
        "Error details:",
        JSON.stringify(folderError.response?.data || {})
      );
      throw new Error(`Cannot access parent folder: ${folderError.message}`);
    }

    // Try to list files with simple query first to test API access
    try {
      const testQuery = await drive.files.list({
        pageSize: 5,
        fields: "files(id, name)",
      });
      console.log(
        "API connection working - found files:",
        testQuery.data.files.length
      );
    } catch (testError) {
      console.error("Failed basic API test:", testError.message);
      throw new Error(`API access test failed: ${testError.message}`);
    }

    // Now try the actual query for agency folder
    console.log(
      "Running query:",
      `name='${agencyName}' and '${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`
    );

    const agencyFolderResponse = await drive.files.list({
      q: `name='${agencyName}' and '${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: "files(id, name)",
    });

    // Check if agency folder exists
    if (agencyFolderResponse.data.files.length > 0) {
      // Le dossier d'agence existe déjà
      agencyFolderId = agencyFolderResponse.data.files[0].id;
      console.log("Found existing agency folder:", agencyFolderId);
    } else {
      // Créer le dossier d'agence s'il n'existe pas
      console.log("Creating new agency folder for:", agencyName);
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
      console.log("Created new agency folder with ID:", agencyFolderId);
    }

    // Rechercher ou créer le sous-dossier spécifique au type de fichier (bijoux ou paiements)
    const folderName = fileType === "jewelry" ? "Bijoux" : "Preuves_Paiement";
    console.log(
      "Looking for subfolder:",
      folderName,
      "in agency folder:",
      agencyFolderId
    );

    const typeFolderResponse = await drive.files.list({
      q: `name='${folderName}' and '${agencyFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: "files(id, name)",
    });

    if (typeFolderResponse.data.files.length > 0) {
      // Le sous-dossier existe déjà
      const folderId = typeFolderResponse.data.files[0].id;
      console.log("Found existing subfolder:", folderId);
      return folderId;
    } else {
      // Créer le sous-dossier s'il n'existe pas
      console.log("Creating new subfolder:", folderName);
      const typeFolderMetadata = {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
        parents: [agencyFolderId],
      };

      const typeFolder = await drive.files.create({
        resource: typeFolderMetadata,
        fields: "id",
      });

      console.log("Created new subfolder with ID:", typeFolder.data.id);
      return typeFolder.data.id;
    }
  } catch (error) {
    console.error(
      "Erreur lors de la gestion des dossiers sur Google Drive:",
      error
    );
    throw new Error("Erreur lors de la gestion des dossiers sur Google Drive");
  }
};

export default async function handler(req, res) {
  // Vérifier l'authentification
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res
      .status(401)
      .json({ message: "Non authentifié. Veuillez vous connecter." });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  try {
    // Créer un répertoire temporaire si nécessaire
    const tmpDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }

    // Parsage du formulaire avec la nouvelle API formidable v4+
    const form = formidable({
      uploadDir: tmpDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB max
    });

    // Utiliser Promise pour gérer le parsage du formulaire
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Vérifier si un fichier a été envoyé
    const file = files.file[0]; // Dans formidable v4+ les fichiers sont des tableaux
    if (!file) {
      return res.status(400).json({ message: "Aucun fichier n'a été envoyé" });
    }

    // Déterminer le type de fichier et l'agence
    const fileType = fields.fileType?.[0] || "unknown";
    const location = fields.location?.[0] || "unknown";

    // Authentifier Google Drive
    const drive = await authenticateGoogleDrive();

    // Obtenir l'ID du dossier pour cette agence et ce type de fichier
    const folderId = await getFolderIdByAgency(drive, location, fileType);

    // Préparer le nom du fichier avec un identifiant unique
    const fileExtension = path.extname(file.originalFilename);
    const uniqueFileName = `${fileType}_${Date.now()}_${uuidv4().slice(
      0,
      8
    )}${fileExtension}`;

    // Télécharger le fichier sur Google Drive
    const fileMetadata = {
      name: uniqueFileName,
      parents: [folderId],
    };

    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.filepath),
    };

    const driveResponse = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id, webViewLink",
    });

    // Supprimer le fichier temporaire
    fs.unlinkSync(file.filepath);

    // Retourner l'URL du fichier
    res.status(200).json({
      fileUrl: driveResponse.data.webViewLink,
      fileId: driveResponse.data.id,
    });
  } catch (error) {
    console.error("Erreur lors du téléchargement du fichier:", error);
    res
      .status(500)
      .json({ message: "Erreur lors du téléchargement du fichier" });
  }
}
