"use client";

import { BuildingDef, buildingCost, rushCost, upgradeCost, upgradeSeconds } from "@/lib/gameData";
import { formatDuration, formatNumber } from "@/lib/format";
import { useNow } from "@/hooks/useNow";
import { useGameStore } from "@/store/useGameStore";

export function BuildingCard({
  def,
  gems,
  onSpendGems,
}: {
  def: BuildingDef;
  gems: number | null;
  onSpendGems: (amount: number) => Promise<boolean>;
}) {
  const now = useNow(1000);
  const coins = useGameStore((s) => s.coins);
  const state = useGameStore((s) => s.buildings[def.id]);
  const buyBuilding = useGameStore((s) => s.buyBuilding);
  const startUpgrade = useGameStore((s) => s.startUpgrade);

  if (!state) return null;

  const cost = buildingCost(def, state.owned);
  const canBuy = coins >= cost;
  const upCost = upgradeCost(def, state.level);
  const upSeconds = upgradeSeconds(def, state.level);
  const isUpgrading = state.upgradeFinishesAt !== null;
  const secondsLeft = isUpgrading ? Math.max(0, (state.upgradeFinishesAt! - now) / 1000) : 0;
  const canStartUpgrade = state.owned > 0 && !isUpgrading && coins >= upCost;
  const gemsToRush = rushCost(secondsLeft);
  const canRush = isUpgrading && gems !== null && gems >= gemsToRush;

  async function handleRush() {
    if (!canRush) return;
    const ok = await onSpendGems(gemsToRush);
    if (!ok) return;
    // Fast-forward this building's timer locally; the regular tick loop will
    // pick up the completed level on its next second.
    useGameStore.setState((s) => ({
      buildings: {
        ...s.buildings,
        [def.id]: { ...s.buildings[def.id], upgradeFinishesAt: Date.now() },
      },
    }));
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{def.emoji}</span>
          <div>
            <p className="font-semibold text-white">{def.name}</p>
            <p className="text-xs text-white/50">
              Level {state.level} · {state.owned}x · {formatNumber(def.baseProduction * state.owned * state.level)}
              /s
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => buyBuilding(def.id)}
          disabled={!canBuy}
          className="flex-1 rounded-lg bg-sky-600/30 px-3 py-2 text-sm font-medium text-sky-100 transition enabled:hover:bg-sky-600/50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Kopen (🪙 {formatNumber(cost)})
        </button>

        {!isUpgrading ? (
          <button
            onClick={() => startUpgrade(def.id)}
            disabled={!canStartUpgrade}
            className="flex-1 rounded-lg bg-violet-600/30 px-3 py-2 text-sm font-medium text-violet-100 transition enabled:hover:bg-violet-600/50 disabled:cursor-not-allowed disabled:opacity-40"
            title={state.owned === 0 ? "Koop er eerst één" : undefined}
          >
            Upgrade (🪙 {formatNumber(upCost)}, {formatDuration(upSeconds)})
          </button>
        ) : (
          <button
            onClick={handleRush}
            disabled={!canRush}
            className="flex-1 rounded-lg bg-fuchsia-600/30 px-3 py-2 text-sm font-medium text-fuchsia-100 transition enabled:hover:bg-fuchsia-600/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ⏳ {formatDuration(secondsLeft)} — versnel voor 💎 {gemsToRush}
          </button>
        )}
      </div>
    </div>
  );
}
