import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Créer un utilisateur admin
  const hashedPasswordAdmin = await bcrypt.hash("adminpassword", 10);
  await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: hashedPasswordAdmin,
      role: "admin",
    },
  });

  // Créer un utilisateur agence (Maubeuge)
  const hashedPasswordAgency = await bcrypt.hash("agencypassword", 10);
  await prisma.user.create({
    data: {
      email: "maubeuge@example.com",
      password: hashedPasswordAgency,
      role: "agency",
      location: "Maubeuge",
    },
  });

  console.log("Users created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
