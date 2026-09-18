"use client";

import { BOOSTS } from "@/lib/gameData";
import { formatDuration } from "@/lib/format";
import { useNow } from "@/hooks/useNow";
import { useGameStore } from "@/store/useGameStore";

export function BoostShop({
  gems,
  onSpendGems,
}: {
  gems: number | null;
  onSpendGems: (amount: number) => Promise<boolean>;
}) {
  const now = useNow(1000);
  const activeBoost = useGameStore((s) => s.activeBoost);
  const applyBoost = useGameStore((s) => s.applyBoost);

  const active = activeBoost && activeBoost.expiresAt > now ? activeBoost : null;

  async function buy(boost: (typeof BOOSTS)[number]) {
    if (gems === null || gems < boost.gemCost) return;
    const ok = await onSpendGems(boost.gemCost);
    if (!ok) return;
    applyBoost(boost);
  }

  return (
    <div className="rounded-xl bg-white/5 p-4">
      <p className="mb-2 font-semibold text-white">⚡ Productieboosts</p>
      {active && (
        <p className="mb-3 rounded-lg bg-emerald-600/20 px-3 py-2 text-sm text-emerald-100">
          {active.name} actief — nog {formatDuration((active.expiresAt - now) / 1000)}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {BOOSTS.map((b) => {
          const disabled = gems === null || gems < b.gemCost || !!active;
          return (
            <button
              key={b.id}
              onClick={() => buy(b)}
              disabled={disabled}
              className="flex-1 rounded-lg bg-amber-600/30 px-3 py-2 text-sm font-medium text-amber-100 transition enabled:hover:bg-amber-600/50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {b.name} — 💎 {b.gemCost}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-white/40">
        Vaste prijs, vaste duur — geen kansspel-elementen, je weet altijd precies wat je krijgt.
      </p>
    </div>
  );
}
