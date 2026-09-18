export type BuildingDef = {
  id: string;
  name: string;
  emoji: string;
  baseCost: number;
  baseProduction: number; // coins/sec at level 1
  upgradeBaseSeconds: number; // time to go from level N to N+1, scales with level
};

// Cost to own building N+1 = baseCost * 1.15^owned
// Cost to upgrade a level = baseCost * 0.5 * 1.4^(level-1)
// Upgrade time = upgradeBaseSeconds * 1.35^(level-1), capped at 4 hours
export const BUILDINGS: BuildingDef[] = [
  { id: "stand", name: "Lemonade Stand", emoji: "🍋", baseCost: 15, baseProduction: 0.1, upgradeBaseSeconds: 20 },
  { id: "cart", name: "Food Cart", emoji: "🌭", baseCost: 100, baseProduction: 0.6, upgradeBaseSeconds: 45 },
  { id: "cafe", name: "Café", emoji: "☕", baseCost: 700, baseProduction: 3.5, upgradeBaseSeconds: 120 },
  { id: "restaurant", name: "Restaurant", emoji: "🍽️", baseCost: 4500, baseProduction: 18, upgradeBaseSeconds: 300 },
  { id: "factory", name: "Snack Factory", emoji: "🏭", baseCost: 26000, baseProduction: 95, upgradeBaseSeconds: 900 },
  { id: "mall", name: "Food Mall", emoji: "🏬", baseCost: 160000, baseProduction: 480, upgradeBaseSeconds: 1800 },
  { id: "tower", name: "Culinary Tower", emoji: "🏙️", baseCost: 1000000, baseProduction: 2600, upgradeBaseSeconds: 3600 },
];

export const MAX_UPGRADE_SECONDS = 4 * 60 * 60; // 4 hour cap on any single timer

export function buildingCost(def: BuildingDef, owned: number): number {
  return Math.round(def.baseCost * Math.pow(1.15, owned));
}

export function upgradeCost(def: BuildingDef, level: number): number {
  return Math.round(def.baseCost * 0.5 * Math.pow(1.4, level - 1));
}

export function upgradeSeconds(def: BuildingDef, level: number): number {
  return Math.min(MAX_UPGRADE_SECONDS, Math.round(def.upgradeBaseSeconds * Math.pow(1.35, level - 1)));
}

// Gems needed to instantly finish a timer with `secondsLeft` remaining.
// Transparent linear rate, no randomness: 1 gem per 90 seconds, minimum 1.
export function rushCost(secondsLeft: number): number {
  return Math.max(1, Math.ceil(secondsLeft / 90));
}

export type GemPackage = {
  id: string;
  gems: number;
  priceEUR: number; // in euro cents in Stripe, displayed here in euros
  label: string;
};

// Fixed price tiers, no randomized contents — you always know exactly what you get.
export const GEM_PACKAGES: GemPackage[] = [
  { id: "pouch", gems: 100, priceEUR: 0.99, label: "Handful of gems" },
  { id: "bag", gems: 550, priceEUR: 4.99, label: "Bag of gems (+10%)" },
  { id: "chest", gems: 1200, priceEUR: 9.99, label: "Chest of gems (+20%)" },
  { id: "vault", gems: 2600, priceEUR: 19.99, label: "Vault of gems (+30%)" },
];

export type BoostDef = {
  id: string;
  name: string;
  multiplier: number;
  durationSeconds: number;
  gemCost: number;
};

// Fixed-duration, fixed-price production boosts — no gacha, no "chance" of anything.
export const BOOSTS: BoostDef[] = [
  { id: "boost-2x-30m", name: "2x Production — 30 min", multiplier: 2, durationSeconds: 30 * 60, gemCost: 40 },
  { id: "boost-3x-1h", name: "3x Production — 1 hour", multiplier: 3, durationSeconds: 60 * 60, gemCost: 90 },
];

// Free gems awarded for reaching lifetime-coin milestones. Anyone can earn gems
// just by playing; spending money only ever buys convenience (skipping waits),
// never a better chance at anything.
export const MILESTONES: { id: string; totalCoins: number; gems: number }[] = [
  { id: "m1", totalCoins: 1_000, gems: 20 },
  { id: "m2", totalCoins: 25_000, gems: 40 },
  { id: "m3", totalCoins: 250_000, gems: 80 },
  { id: "m4", totalCoins: 2_500_000, gems: 150 },
];
