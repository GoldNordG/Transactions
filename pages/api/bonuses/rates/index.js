// pages/api/bonuses/rates/index.js
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

  // Traiter selon la méthode HTTP
  switch (req.method) {
    case "GET":
      return getBonusRates(req, res);
    case "POST":
      return createBonusRate(req, res);
    default:
      return res.status(405).json({ message: "Méthode non autorisée" });
  }
}

// Récupérer tous les taux de prime
async function getBonusRates(req, res) {
  try {
    const bonusRates = await prisma.bonusRate.findMany({
      orderBy: {
        carats: "asc",
      },
    });

    return res.status(200).json(bonusRates);
  } catch (error) {
    console.error("Erreur lors de la récupération des taux de prime:", error);
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}

// Créer un nouveau taux de prime
async function createBonusRate(req, res) {
  try {
    const { carats, bonusPercentage, minWeightThreshold, description } =
      req.body;

    // Validation
    if (!carats || bonusPercentage === undefined) {
      return res
        .status(400)
        .json({ message: "Les carats et le pourcentage de prime sont requis" });
    }

    // Vérifier si un taux existe déjà pour ces carats
    const existingRate = await prisma.bonusRate.findFirst({
      where: { carats },
    });

    if (existingRate) {
      return res
        .status(409)
        .json({ message: `Un taux de prime existe déjà pour ${carats}` });
    }

    // Créer le nouveau taux
    const newBonusRate = await prisma.bonusRate.create({
      data: {
        carats,
        bonusPercentage,
        minWeightThreshold: minWeightThreshold || 0,
        description: description || null,
      },
    });

    return res.status(201).json(newBonusRate);
  } catch (error) {
    console.error("Erreur lors de la création du taux de prime:", error);
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}
