"use client";

import { useEffect, useState, useTransition } from "react";
import { BUILDINGS } from "@/lib/gameData";
import { formatNumber } from "@/lib/format";
import { nextUnclaimedMilestone, useGameStore } from "@/store/useGameStore";
import { useGems } from "@/hooks/useGems";
import { Header } from "@/components/Header";
import { ClickerButton } from "@/components/ClickerButton";
import { BuildingCard } from "@/components/BuildingCard";
import { BoostShop } from "@/components/BoostShop";
import { GemStoreModal } from "@/components/GemStoreModal";

export function GameShell() {
  const { gems, spend, claimMilestone } = useGems();
  const tick = useGameStore((s) => s.tick);
  const applyOfflineProgress = useGameStore((s) => s.applyOfflineProgress);
  const totalCoinsEarned = useGameStore((s) => s.totalCoinsEarned);
  const claimedMilestones = useGameStore((s) => s.claimedMilestones);
  const markMilestoneClaimed = useGameStore((s) => s.markMilestoneClaimed);

  const [storeOpen, setStoreOpen] = useState(false);
  const [welcomeBack, setWelcomeBack] = useState<{ coinsEarned: number; secondsAway: number } | null>(null);
  const [milestoneToast, setMilestoneToast] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      const offline = applyOfflineProgress();
      if (offline) setWelcomeBack(offline);
    });
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [applyOfflineProgress, tick]);

  useEffect(() => {
    const milestone = nextUnclaimedMilestone(totalCoinsEarned, claimedMilestones);
    if (!milestone) return;
    markMilestoneClaimed(milestone.id);
    startTransition(async () => {
      const awarded = await claimMilestone(milestone.id);
      if (awarded > 0) setMilestoneToast(`Mijlpaal bereikt! +💎 ${awarded} gratis gems`);
    });
  }, [totalCoinsEarned, claimedMilestones, markMilestoneClaimed, claimMilestone]);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 p-4">
      <Header gems={gems} onOpenStore={() => setStoreOpen(true)} />

      {welcomeBack && (
        <div
          className="cursor-pointer rounded-xl bg-emerald-600/20 px-4 py-3 text-sm text-emerald-100"
          onClick={() => setWelcomeBack(null)}
        >
          Welkom terug! Je verdiende 🪙 {formatNumber(welcomeBack.coinsEarned)} terwijl je weg was.
        </div>
      )}

      {milestoneToast && (
        <div
          className="cursor-pointer rounded-xl bg-fuchsia-600/20 px-4 py-3 text-sm text-fuchsia-100"
          onClick={() => setMilestoneToast(null)}
        >
          {milestoneToast}
        </div>
      )}

      <ClickerButton />

      <BoostShop gems={gems} onSpendGems={spend} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {BUILDINGS.map((def) => (
          <BuildingCard key={def.id} def={def} gems={gems} onSpendGems={spend} />
        ))}
      </div>

      {storeOpen && <GemStoreModal onClose={() => setStoreOpen(false)} />}
    </div>
  );
}
