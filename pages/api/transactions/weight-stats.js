// pages/api/transactions/weight-stats.js
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  try {
    console.log("Weight-stats API appelée avec:", req.query);

    const { carats } = req.query;

    // Construction du filtre WHERE
    const whereCondition = {};

    if (carats) {
      whereCondition.carats = carats;
    }

    // Requête Prisma pour récupérer les statistiques de poids groupées par carats
    const weightStats = await prisma.transactionItem.groupBy({
      by: ["carats"],
      where: whereCondition,
      _sum: {
        weight: true,
      },
      _count: true,
      orderBy: {
        carats: "asc",
      },
    });

    console.log("Weight-stats récupérées:", weightStats);

    // Formatage des résultats
    const formattedStats = weightStats.map((stat) => ({
      carats: stat.carats,
      _sum: {
        weight: Number(stat._sum.weight) || 0,
      },
      _count: stat._count,
    }));

    console.log("Weight-stats formatées retournées:", formattedStats);

    res.status(200).json(formattedStats);
  } catch (error) {
    console.error("Erreur dans weight-stats API:", error);
    res.status(500).json({
      error: "Erreur lors de la récupération des statistiques de poids",
      details: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
}
