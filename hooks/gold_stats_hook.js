import { useMemo } from "react";

// Hook personnalisé pour les calculs de statistiques d'or
export const useGoldStats = (transactions = []) => {
  // Fonction pour déterminer le type d'or basé sur les carats
  const getGoldType = (carats) => {
    if (!carats) return "unknown";

    const c = carats.toString().toUpperCase().trim();

    // Vérification explicite des types
    if (c === "24" || c === "24K") return "24k";
    if (c === "22" || c === "22K") return "22k";
    if (["9", "9K", "14", "14K", "18", "18K", "DENTAIRE"].includes(c)) {
      return "lowKarat";
    }

    return "unknown";
  };

  // Calculer les totaux par type d'or
  const goldStats = useMemo(() => {
    const stats = {
      lowKarat: { weight: 0, amount: 0, count: 0 },
      gold22k: { weight: 0, amount: 0, count: 0 },
      gold24k: { weight: 0, amount: 0, count: 0 },
      totalAmount: 0,
    };

    for (const transaction of transactions) {
      const transactionAmount = parseFloat(transaction.amount || 0);
      stats.totalAmount += transactionAmount;

      const items = transaction.items || [];

      if (items.length > 0) {
        for (const item of items) {
          const goldType = getGoldType(item.carats);
          const weight = parseFloat(item.weight || 0);
          const subtotal = parseFloat(item.subtotal || 0);

          if (goldType === "lowKarat") {
            stats.lowKarat.weight += weight;
            stats.lowKarat.amount += subtotal;
            stats.lowKarat.count += 1;
          } else if (goldType === "22k") {
            stats.gold22k.weight += weight;
            stats.gold22k.amount += subtotal;
            stats.gold22k.count += 1;
          } else if (goldType === "24k") {
            stats.gold24k.weight += weight;
            stats.gold24k.amount += subtotal;
            stats.gold24k.count += 1;
          }
        }
      } else {
        // Structure sans items (ancienne version)
        const goldType = getGoldType(transaction.carats);
        const weight = parseFloat(transaction.weight || 0);

        if (goldType === "lowKarat") {
          stats.lowKarat.weight += weight;
          stats.lowKarat.amount += transactionAmount;
          stats.lowKarat.count += 1;
        } else if (goldType === "22k") {
          stats.gold22k.weight += weight;
          stats.gold22k.amount += transactionAmount;
          stats.gold22k.count += 1;
        } else if (goldType === "24k") {
          stats.gold24k.weight += weight;
          stats.gold24k.amount += transactionAmount;
          stats.gold24k.count += 1;
        }
      }
    }

    return stats;
  }, [transactions]);

  return { goldStats, getGoldType };
};
