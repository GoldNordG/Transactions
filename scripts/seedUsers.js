import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Supprimer les utilisateurs existants pour éviter les doublons
  await prisma.user.deleteMany({});

  // Créer un utilisateur admin
  const hashedPasswordAdmin = await bcrypt.hash("adminpassword", 10);
  await prisma.user.create({
    data: {
      email: "admin@goldnord.fr",
      password: hashedPasswordAdmin,
      role: "admin",
    },
  });

  // Créer plusieurs utilisateurs pour différentes agences
  const agencies = [
    { email: "maubeuge@goldnord.fr", location: "Maubeuge" },
    { email: "beauvais@goldnord.fr", location: "Beauvais" },
    { email: "fourmies@goldnord.fr", location: "Fourmies" },
    { email: "chaumont@goldnord.fr", location: "Chaumont" },
    { email: "compiegne@goldnord.fr", location: "Compiègne" },
    { email: "dourdan@goldnord.fr", location: "Doudan" },
    { email: "dreux@goldnord.fr", location: "Dreux" },
    { email: "aurillac@goldnord.fr", location: "Aurillac" },
    { email: "saint-dizier@goldnord.fr", location: "Saint-Dizier" },
    { email: "saint-quentin@goldnord.fr", location: "Saint-Quentin" },
    { email: "puy-en-velay@goldnord.fr", location: "Puy-En-Velay" },
  ];

  for (const agency of agencies) {
    if (!agency.email.includes("@")) {
      throw new Error(`Email invalide : ${agency.email}`);
    }
    const hashedPassword = await bcrypt.hash("agence123", 10);
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
