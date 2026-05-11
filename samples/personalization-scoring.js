export const merchants = [
  {
    name: "Green Corner Cafe",
    category: "coffee",
    distanceMiles: 0.6,
    offerValue: 8,
    recentActivity: 9,
    customerInterest: 10,
  },
  {
    name: "Harbor Pizza",
    category: "food",
    distanceMiles: 1.8,
    offerValue: 10,
    recentActivity: 7,
    customerInterest: 8,
  },
  {
    name: "City Books",
    category: "retail",
    distanceMiles: 0.9,
    offerValue: 5,
    recentActivity: 6,
    customerInterest: 7,
  },
  {
    name: "Northside Fitness",
    category: "fitness",
    distanceMiles: 3.4,
    offerValue: 9,
    recentActivity: 5,
    customerInterest: 4,
  },
];

export function distanceScore(distanceMiles) {
  const distance = Number(distanceMiles);

  if (!Number.isFinite(distance) || distance < 0) {
    return 0;
  }

  if (distance <= 0.5) return 10;
  if (distance <= 1) return 8;
  if (distance <= 2) return 6;
  if (distance <= 5) return 3;
  return 1;
}

export function scoreMerchant(merchant) {
  if (!merchant || typeof merchant !== "object") {
    throw new TypeError("A merchant object is required.");
  }

  const weights = {
    distance: 0.28,
    offerValue: 0.26,
    recentActivity: 0.2,
    customerInterest: 0.26,
  };

  const weightedScore =
    distanceScore(merchant.distanceMiles) * weights.distance +
    clampScore(merchant.offerValue) * weights.offerValue +
    clampScore(merchant.recentActivity) * weights.recentActivity +
    clampScore(merchant.customerInterest) * weights.customerInterest;

  return Number(weightedScore.toFixed(2));
}

export function rankMerchants(inputMerchants = merchants) {
  if (!Array.isArray(inputMerchants)) {
    throw new TypeError("Merchants must be provided as an array.");
  }

  return inputMerchants
    .map((merchant) => ({
      ...merchant,
      score: scoreMerchant(merchant),
    }))
    .sort((a, b) => b.score - a.score || a.distanceMiles - b.distanceMiles);
}

function clampScore(value) {
  const score = Number(value);

  if (!Number.isFinite(score)) {
    return 0;
  }

  return Math.min(10, Math.max(0, score));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.table(rankMerchants());
}
