"use client";

import { formatNumber } from "@/lib/format";
import { clickPowerFor, clickUpgradeCostFor, useGameStore } from "@/store/useGameStore";

export function Header({ gems, onOpenStore }: { gems: number | null; onOpenStore: () => void }) {
  const coins = useGameStore((s) => s.coins);
  const clickPowerLevel = useGameStore((s) => s.clickPowerLevel);
  const upgradeClickPower = useGameStore((s) => s.upgradeClickPower);

  const power = clickPowerFor(clickPowerLevel);
  const upgradeCost = clickUpgradeCostFor(clickPowerLevel);
  const canUpgrade = coins >= upgradeCost;

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/5 p-4 backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-wide text-amber-200/70">Munten</p>
        <p className="text-2xl font-bold text-amber-100">🪙 {formatNumber(coins)}</p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-emerald-200/70">Klikkracht</p>
        <button
          onClick={upgradeClickPower}
          disabled={!canUpgrade}
          className="rounded-lg bg-emerald-600/30 px-3 py-1.5 text-sm font-medium text-emerald-100 transition enabled:hover:bg-emerald-600/50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          +{power}/klik — upgrade voor 🪙 {formatNumber(upgradeCost)}
        </button>
      </div>

      <button
        onClick={onOpenStore}
        className="flex items-center gap-2 rounded-xl bg-fuchsia-600/80 px-4 py-2 font-semibold text-white shadow transition hover:bg-fuchsia-500"
      >
        💎 {gems === null ? "…" : formatNumber(gems)}
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">Winkel</span>
      </button>
    </header>
  );
}
