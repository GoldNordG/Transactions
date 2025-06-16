// pages/api/bonuses/rates/[id].js
import { getSession } from "next-auth/react";
import prisma from "../../../../lib/prisma"; // Ajustez le chemin selon votre structure de projet

export default async function handler(req, res) {
  // Récupérer la session
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Non authentifié" });
  }

  // Vérifier les autorisations
  if (session.user.role !== "admin" && session.user.role !== "superadmin") {
    return res.status(403).json({ message: "Accès non autorisé" });
  }

  // Récupérer l'ID du taux de prime
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID du taux de prime manquant" });
  }

  // Traiter selon la méthode HTTP
  switch (req.method) {
    case "GET":
      return getBonusRate(req, res, id);
    case "PUT":
      return updateBonusRate(req, res, id);
    case "DELETE":
      return deleteBonusRate(req, res, id);
    default:
      return res.status(405).json({ message: "Méthode non autorisée" });
  }
}

// Récupérer un taux de prime spécifique
async function getBonusRate(req, res, id) {
  try {
    const bonusRate = await prisma.bonusRate.findUnique({
      where: { id: parseInt(id) },
    });

    if (!bonusRate) {
      return res.status(404).json({ message: "Taux de prime non trouvé" });
    }

    return res.status(200).json(bonusRate);
  } catch (error) {
    console.error("Erreur lors de la récupération du taux de prime:", error);
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}

// Mettre à jour un taux de prime
async function updateBonusRate(req, res, id) {
  try {
    const { carats, bonusPercentage, minWeightThreshold, description } =
      req.body;

    // Validation
    if (!carats || bonusPercentage === undefined) {
      return res
        .status(400)
        .json({ message: "Les carats et le pourcentage de prime sont requis" });
    }

    // Vérifier si le taux existe
    const existingRate = await prisma.bonusRate.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingRate) {
      return res.status(404).json({ message: "Taux de prime non trouvé" });
    }

    // Vérifier si le nouveau caratage existe déjà pour un autre taux
    if (carats !== existingRate.carats) {
      const duplicateRate = await prisma.bonusRate.findFirst({
        where: {
          carats,
          id: { not: parseInt(id) },
        },
      });

      if (duplicateRate) {
        return res
          .status(409)
          .json({ message: `Un taux de prime existe déjà pour ${carats}` });
      }
    }

    // Mettre à jour le taux
    const updatedBonusRate = await prisma.bonusRate.update({
      where: { id: parseInt(id) },
      data: {
        carats,
        bonusPercentage,
        minWeightThreshold: minWeightThreshold || 0,
        description: description || null,
      },
    });

    return res.status(200).json(updatedBonusRate);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du taux de prime:", error);
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}

// Supprimer un taux de prime
async function deleteBonusRate(req, res, id) {
  try {
    // Vérifier si le taux existe
    const existingRate = await prisma.bonusRate.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingRate) {
      return res.status(404).json({ message: "Taux de prime non trouvé" });
    }

    // Supprimer le taux
    await prisma.bonusRate.delete({
      where: { id: parseInt(id) },
    });

    return res
      .status(200)
      .json({ message: "Taux de prime supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du taux de prime:", error);
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}
