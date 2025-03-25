import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "Transaction ID is required" });
    }

    // Trouver et valider la transaction
    const transaction = await prisma.transaction.update({
      where: { id: parseInt(id) },
      data: { validated: true },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    console.log("Transaction validated successfully");

    // Rediriger vers la page de remerciement
    res.writeHead(302, { Location: "/thank-you" });
    res.end();
  } catch (error) {
    console.error("Erreur dans l’API validate-transaction :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  } finally {
    await prisma.$disconnect();
  }
}
