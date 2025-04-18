// /pages/api/transactions/[id]/fraud-status.js
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
  try {
    // Utiliser getServerSession au lieu de getSession
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({
        error: "Non autorisé",
        status: "session_expired",
      });
    }

    // Vérifier que l'utilisateur est un superadmin
    if (session.user.role !== "superadmin") {
      return res.status(403).json({ error: "Accès refusé" });
    }

    // Reste du code...
    const { id } = req.query;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      return res.status(400).json({ error: "ID de transaction invalide" });
    }

    if (req.method === "PUT") {
      const { isFraud } = req.body;

      if (typeof isFraud !== "boolean") {
        return res
          .status(400)
          .json({ error: "Le statut de fraude doit être un booléen" });
      }

      const existingTransaction = await prisma.transaction.findUnique({
        where: { id: parsedId },
      });

      if (!existingTransaction) {
        return res.status(404).json({ error: "Transaction non trouvée" });
      }

      const updatedTransaction = await prisma.transaction.update({
        where: { id: parsedId },
        data: {
          fraudChecked: true,
          isFraud: isFraud,
        },
      });

      return res.status(200).json(updatedTransaction);
    } else {
      return res.status(405).json({ error: "Méthode non autorisée" });
    }
  } catch (error) {
    console.error("Erreur dans l'API fraud-status:", error);
    return res
      .status(500)
      .json({ error: "Erreur serveur lors de la mise à jour" });
  }
}
