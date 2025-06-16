// pages/api/agencies/stats.js
import { PrismaClient } from "@prisma/client";

// Create a single instance of Prisma Client
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Parse date range from query parameters
    const { startDate, endDate } = req.query;

    // Validate date inputs
    const parsedStartDate = startDate
      ? new Date(startDate)
      : new Date(new Date().setDate(new Date().getDate() - 30)); // Default to 30 days ago
    const parsedEndDate = endDate ? new Date(endDate) : new Date(); // Default to today

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Add time to end date to include the full day
    parsedEndDate.setHours(23, 59, 59, 999);

    // Récupérer toutes les agences
    const agencies = await prisma.agency.findMany({
      select: {
        id: true,
        name: true,
        location: true,
        transactions: {
          where: {
            date: {
              gte: parsedStartDate,
              lte: parsedEndDate,
            },
          },
          select: {
            amount: true,
            weight: true,
          },
        },
      },
    });

    // Calculer les statistiques pour chaque agence
    const agencyStats = agencies.map((agency) => {
      const totalTransactions = agency.transactions.length;
      const totalAmount = agency.transactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0
      );
      const totalWeight = agency.transactions.reduce(
        (sum, transaction) => sum + transaction.weight,
        0
      );

      return {
        id: agency.id,
        name: agency.name,
        location: agency.location,
        totalTransactions,
        totalAmount,
        totalWeight,
        averageAmount:
          totalTransactions > 0 ? totalAmount / totalTransactions : 0,
        averageWeight:
          totalTransactions > 0 ? totalWeight / totalTransactions : 0,
      };
    });

    return res.status(200).json(agencyStats);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des statistiques d'agence:",
      error
    );
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}
