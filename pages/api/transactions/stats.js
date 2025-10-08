// pages/api/transactions/stats-alternative.js
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  try {
    const { location, startDate, endDate, carats } = req.query;

    console.log("Stats API appelée avec les filtres:", req.query);

    // Construction du filtre WHERE pour TransactionItem
    const itemWhereCondition = {};

    // Filtre par carats directement sur TransactionItem
    if (carats) {
      itemWhereCondition.carats = carats;
    }

    // Construction du filtre pour Transaction (via relation)
    const transactionFilters = {};

    // Filtre par lieu
    if (location) {
      transactionFilters.location = location;
    }

    // Filtre par dates
    if (startDate && endDate) {
      transactionFilters.date = {
        gte: new Date(startDate),
        lte: new Date(endDate + "T23:59:59.999Z"),
      };
    } else if (startDate) {
      transactionFilters.date = {
        gte: new Date(startDate),
      };
    } else if (endDate) {
      transactionFilters.date = {
        lte: new Date(endDate + "T23:59:59.999Z"),
      };
    }

    // Appliquer les filtres de transaction via la relation seulement s'il y en a
    if (Object.keys(transactionFilters).length > 0) {
      itemWhereCondition.transaction = transactionFilters;
    }

    console.log(
      "Condition WHERE générée pour items:",
      JSON.stringify(itemWhereCondition, null, 2)
    );

    // Alternative avec findMany si groupBy pose problème
    const items = await prisma.transactionItem.findMany({
      where: itemWhereCondition,
      select: {
        carats: true,
        subtotal: true,
        weight: true,
      },
    });

    console.log("Items récupérés:", items.length);

    // Agrégation manuelle par carats
    const statsMap = new Map();

    items.forEach((item) => {
      const carats = item.carats;

      if (!statsMap.has(carats)) {
        statsMap.set(carats, {
          carats,
          subtotalSum: 0,
          weightSum: 0,
          count: 0,
        });
      }

      const stat = statsMap.get(carats);
      stat.subtotalSum += item.subtotal || 0;
      stat.weightSum += item.weight || 0;
      stat.count += 1;
    });

    // Formatage des résultats
    const formattedStats = Array.from(statsMap.values())
      .map((stat) => ({
        carats: stat.carats,
        _sum: {
          subtotal: Number(stat.subtotalSum.toFixed(2)),
          weight: Number(stat.weightSum.toFixed(2)),
        },
        _count: stat.count,
        _avg: {
          subtotal: Number((stat.subtotalSum / stat.count).toFixed(2)),
          weight: Number((stat.weightSum / stat.count).toFixed(2)),
        },
      }))
      .sort((a, b) => parseInt(a.carats) - parseInt(b.carats));

    console.log("Stats formatées retournées:", formattedStats);

    res.status(200).json(formattedStats);
  } catch (error) {
    console.error("Erreur dans l'API stats:", error);
    res.status(500).json({
      error: "Erreur lors de la récupération des statistiques",
      details: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
}
