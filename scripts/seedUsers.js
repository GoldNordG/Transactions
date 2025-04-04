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
    { email: "Beauvais@goldnord.fr", location: "Beauvais" },
    { email: "Fourmies@goldnord.fr", location: "Fourmies" },
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
