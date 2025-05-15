import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

// Charger les variables d'environnement depuis .env.local
dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

async function main() {
  // Vérifier que la variable DATABASE_URL est définie
  if (!process.env.DATABASE_URL) {
    console.error(
      "Erreur: La variable DATABASE_URL n'est pas définie dans le fichier .env.local"
    );
    process.exit(1);
  }

  console.log("Connexion à la base de données...");

  // Supprimer les utilisateurs existants pour éviter les doublons
  await prisma.user.deleteMany({});

  // Créer un super admin
  const hashedPasswordSuperAdmin = await bcrypt.hash("N9|t8Q0]7Mu<", 10);
  await prisma.user.create({
    data: {
      email: "goldnord78000@gmail.com",
      password: hashedPasswordSuperAdmin,
      role: "superadmin",
    },
  });

  // Créer des utilisateurs admin
  const admins = [
    { email: "saint-quentin@goldnord.fr", password: "<6CCoaK20S_k" },
    { email: "goldnordavesnes@gmail.com", password: "u3B.BY]*J286" },
    { email: "admin@goldnord.fr", password: "adminpassword" },
  ];

  for (const admin of admins) {
    const hashedPasswordAdmin = await bcrypt.hash(admin.password, 10);
    await prisma.user.create({
      data: {
        email: admin.email,
        password: hashedPasswordAdmin,
        role: "admin",
      },
    });
  }

  // Créer plusieurs utilisateurs pour différentes agences
  const agencies = [
    {
      email: "maubeuge@goldnord.fr",
      location: "Maubeuge",
      password: "n[^2992t+Rfk",
    },
    {
      email: "saintquentin2goldnord@gmail.com",
      location: "Saint-Quentin",
      password: "~eCRu2MH18T(",
    },
    {
      email: "lepuyenvelaygoldnord@gmail.com",
      location: "Le Puy-En-Velay",
      password: "]3d|04&#89Um",
    },
    {
      email: "chaumontgoldnord@gmail.com",
      location: "Chaumont",
      password: "31wbP7x;hb&D",
    },
  ];

  for (const agency of agencies) {
    if (!agency.email.includes("@")) {
      throw new Error(`Email invalide : ${agency.email}`);
    }
    const hashedPassword = await bcrypt.hash(agency.password, 10);
    await prisma.user.create({
      data: {
        email: agency.email,
        password: hashedPassword,
        role: "agency",
        location: agency.location,
      },
    });
  }

  console.log("Utilisateurs créés avec succès !");
}

main()
  .catch((e) => {
    console.error("Erreur lors de la création des utilisateurs:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
