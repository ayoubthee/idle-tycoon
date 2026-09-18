"use client";

import { useState } from "react";
import { clickPowerFor, useGameStore } from "@/store/useGameStore";

export function ClickerButton() {
  const click = useGameStore((s) => s.click);
  const clickPowerLevel = useGameStore((s) => s.clickPowerLevel);
  const [pulses, setPulses] = useState<{ id: number; x: number; y: number }[]>([]);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    click();
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now() + Math.random();
    setPulses((p) => [...p, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setPulses((p) => p.filter((pulse) => pulse.id !== id)), 600);
  }

  return (
    <div className="relative flex flex-col items-center gap-3">
      <button
        onClick={handleClick}
        className="relative h-40 w-40 select-none rounded-full bg-gradient-to-br from-amber-300 to-orange-500 text-6xl shadow-lg shadow-orange-900/40 transition active:scale-95"
      >
        🍋
        {pulses.map((p) => (
          <span
            key={p.id}
            style={{ left: p.x, top: p.y }}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 animate-[float_0.6s_ease-out_forwards] text-xl font-bold text-amber-100"
          >
            +{clickPowerFor(clickPowerLevel)}
          </span>
        ))}
      </button>
      <p className="text-sm text-white/60">Klik om munten te verdienen</p>
    </div>
  );
}
