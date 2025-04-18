// /pages/api/transactions/fraud-status.js
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  // Vérifier l'authentification
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Non autorisé" });
  }

  // Vérifier que l'utilisateur est un superadmin
  if (session.user.role !== "superadmin") {
    return res.status(403).json({ error: "Accès refusé" });
  }

  if (req.method === "GET") {
    try {
      // Récupérer toutes les transactions qui ont été vérifiées (fraudChecked = true)
      const transactions = await prisma.transaction.findMany({
        where: {
          fraudChecked: true,
        },
        include: {
          user: {
            select: {
              email: true,
            },
          },
          items: true,
        },
        orderBy: {
          date: "desc",
        },
      });

      return res.status(200).json(transactions);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données de fraude:",
        error
      );
      return res
        .status(500)
        .json({ error: "Erreur serveur lors de la récupération des données" });
    }
  } else {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }
}
