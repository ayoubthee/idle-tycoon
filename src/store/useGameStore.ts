import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  BUILDINGS,
  buildingCost,
  upgradeCost,
  upgradeSeconds,
  BoostDef,
  MILESTONES,
} from "@/lib/gameData";

const OFFLINE_CAP_SECONDS = 4 * 60 * 60; // idle earnings while the tab was closed, capped at 4h

type BuildingState = {
  owned: number;
  level: number; // starts at 1
  upgradeFinishesAt: number | null; // epoch ms; null when no upgrade in progress
};

type ActiveBoost = {
  boostId: string;
  name: string;
  multiplier: number;
  expiresAt: number;
};

type GameState = {
  coins: number;
  totalCoinsEarned: number;
  clickPowerLevel: number;
  buildings: Record<string, BuildingState>;
  activeBoost: ActiveBoost | null;
  lastSeenAt: number;
  claimedMilestones: string[];

  click: () => void;
  buyBuilding: (id: string) => void;
  startUpgrade: (id: string) => void;
  clickUpgradeCost: () => number;
  upgradeClickPower: () => void;
  applyBoost: (boost: BoostDef) => void;
  tick: () => void;
  applyOfflineProgress: () => { coinsEarned: number; secondsAway: number } | null;
  markMilestoneClaimed: (id: string) => void;
  reset: () => void;
};

function defaultBuildings(): Record<string, BuildingState> {
  return Object.fromEntries(
    BUILDINGS.map((b) => [b.id, { owned: 0, level: 1, upgradeFinishesAt: null }])
  );
}

export function clickPowerFor(level: number): number {
  return level; // 1 coin/click at level 1, +1 per level
}

export function clickUpgradeCostFor(level: number): number {
  return Math.round(20 * Math.pow(1.6, level - 1));
}

export function coinsPerSecond(
  buildings: Record<string, BuildingState>,
  boost: ActiveBoost | null,
  now: number
): number {
  const multiplier = boost && boost.expiresAt > now ? boost.multiplier : 1;
  return (
    BUILDINGS.reduce((sum, def) => {
      const state = buildings[def.id];
      if (!state) return sum;
      return sum + def.baseProduction * state.owned * state.level;
    }, 0) * multiplier
  );
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      coins: 0,
      totalCoinsEarned: 0,
      clickPowerLevel: 1,
      buildings: defaultBuildings(),
      activeBoost: null,
      lastSeenAt: Date.now(),
      claimedMilestones: [],

      click: () => {
        const power = clickPowerFor(get().clickPowerLevel);
        set((s) => ({ coins: s.coins + power, totalCoinsEarned: s.totalCoinsEarned + power }));
      },

      buyBuilding: (id) => {
        const def = BUILDINGS.find((b) => b.id === id);
        if (!def) return;
        const state = get().buildings[id];
        const cost = buildingCost(def, state.owned);
        if (get().coins < cost) return;
        set((s) => ({
          coins: s.coins - cost,
          buildings: { ...s.buildings, [id]: { ...state, owned: state.owned + 1 } },
        }));
      },

      startUpgrade: (id) => {
        const def = BUILDINGS.find((b) => b.id === id);
        if (!def) return;
        const state = get().buildings[id];
        if (!state || state.owned === 0 || state.upgradeFinishesAt !== null) return;
        const cost = upgradeCost(def, state.level);
        if (get().coins < cost) return;
        const seconds = upgradeSeconds(def, state.level);
        set((s) => ({
          coins: s.coins - cost,
          buildings: {
            ...s.buildings,
            [id]: { ...state, upgradeFinishesAt: Date.now() + seconds * 1000 },
          },
        }));
      },

      clickUpgradeCost: () => clickUpgradeCostFor(get().clickPowerLevel),

      upgradeClickPower: () => {
        const cost = clickUpgradeCostFor(get().clickPowerLevel);
        if (get().coins < cost) return;
        set((s) => ({ coins: s.coins - cost, clickPowerLevel: s.clickPowerLevel + 1 }));
      },

      applyBoost: (boost) => {
        set({
          activeBoost: {
            boostId: boost.id,
            name: boost.name,
            multiplier: boost.multiplier,
            expiresAt: Date.now() + boost.durationSeconds * 1000,
          },
        });
      },

      tick: () => {
        const now = Date.now();
        const { buildings, activeBoost } = get();
        const production = coinsPerSecond(buildings, activeBoost, now);

        let changedBuildings = buildings;
        let anyFinished = false;
        for (const def of BUILDINGS) {
          const state = buildings[def.id];
          if (state.upgradeFinishesAt !== null && state.upgradeFinishesAt <= now) {
            if (!anyFinished) changedBuildings = { ...buildings };
            changedBuildings[def.id] = { ...state, level: state.level + 1, upgradeFinishesAt: null };
            anyFinished = true;
          }
        }

        set((s) => ({
          coins: s.coins + production,
          totalCoinsEarned: s.totalCoinsEarned + production,
          buildings: anyFinished ? changedBuildings : s.buildings,
          activeBoost: activeBoost && activeBoost.expiresAt <= now ? null : activeBoost,
          lastSeenAt: now,
        }));
      },

      applyOfflineProgress: () => {
        const { lastSeenAt, buildings, activeBoost } = get();
        const now = Date.now();
        const secondsAway = Math.min(OFFLINE_CAP_SECONDS, Math.max(0, Math.floor((now - lastSeenAt) / 1000)));
        if (secondsAway < 5) {
          set({ lastSeenAt: now });
          return null;
        }
        const perSecond = coinsPerSecond(buildings, activeBoost, now);
        const coinsEarned = Math.floor(perSecond * secondsAway);
        set((s) => ({
          coins: s.coins + coinsEarned,
          totalCoinsEarned: s.totalCoinsEarned + coinsEarned,
          lastSeenAt: now,
        }));
        return { coinsEarned, secondsAway };
      },

      markMilestoneClaimed: (id) => {
        set((s) => ({ claimedMilestones: [...s.claimedMilestones, id] }));
      },

      reset: () => {
        set({
          coins: 0,
          totalCoinsEarned: 0,
          clickPowerLevel: 1,
          buildings: defaultBuildings(),
          activeBoost: null,
          lastSeenAt: Date.now(),
          claimedMilestones: [],
        });
      },
    }),
    { name: "idle-tycoon-save" }
  )
);

export function nextUnclaimedMilestone(totalCoinsEarned: number, claimed: string[]) {
  return MILESTONES.find((m) => !claimed.includes(m.id) && totalCoinsEarned >= m.totalCoins) ?? null;
}
