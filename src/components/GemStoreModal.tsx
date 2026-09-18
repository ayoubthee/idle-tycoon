"use client";

import { useEffect, useState } from "react";
import { GEM_PACKAGES } from "@/lib/gameData";
import { formatEUR } from "@/lib/format";

export function GemStoreModal({ onClose }: { onClose: () => void }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  // Navigating away is a side effect on an external system (the browser),
  // so it's triggered from an effect reacting to state, not directly inline.
  useEffect(() => {
    if (redirectUrl) window.location.href = redirectUrl;
  }, [redirectUrl]);

  async function buy(packageId: string) {
    setError(null);
    setLoadingId(packageId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Kon geen checkout starten");
      setRedirectUrl(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Er ging iets mis");
      setLoadingId(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl bg-zinc-900 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">💎 Gems kopen</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white" aria-label="Sluiten">
            ✕
          </button>
        </div>

        <p className="mb-4 text-sm text-white/60">
          Gems zijn optioneel en verlopen niet. Ze versnellen alleen wachttijden — geen loot boxes, geen
          verrassingen, altijd dezelfde vaste prijs voor hetzelfde vaste aantal gems.
        </p>

        <div className="flex flex-col gap-2">
          {GEM_PACKAGES.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => buy(pkg.id)}
              disabled={loadingId !== null}
              className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-left transition enabled:hover:bg-white/10 disabled:opacity-50"
            >
              <span>
                <span className="block font-medium text-white">💎 {pkg.gems} gems</span>
                <span className="block text-xs text-white/50">{pkg.label}</span>
              </span>
              <span className="font-semibold text-emerald-300">
                {loadingId === pkg.id ? "…" : formatEUR(pkg.priceEUR)}
              </span>
            </button>
          ))}
        </div>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <p className="mt-4 text-center text-xs text-white/30">Betaling via Stripe · testmodus tenzij live keys zijn ingesteld</p>
      </div>
    </div>
  );
}
