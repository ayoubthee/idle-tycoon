"use client";

import { useCallback, useEffect, useState, useTransition } from "react";

export function useGems() {
  const [gems, setGems] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  const refresh = useCallback(async () => {
    const res = await fetch("/api/gems");
    const data = await res.json();
    setGems(data.balance);
    return data.balance as number;
  }, []);

  useEffect(() => {
    startTransition(async () => {
      await refresh();
    });
  }, [refresh]);

  // Returns true if the spend succeeded (server-authoritative balance check).
  const spend = useCallback(async (amount: number) => {
    const res = await fetch("/api/gems/spend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    setGems(data.balance);
    return true;
  }, []);

  const claimMilestone = useCallback(async (milestoneId: string) => {
    const res = await fetch("/api/gems/earn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ milestoneId }),
    });
    if (!res.ok) return 0;
    const data = await res.json();
    setGems(data.balance);
    return data.gemsAwarded ?? 0;
  }, []);

  return { gems, refresh, spend, claimMilestone };
}
