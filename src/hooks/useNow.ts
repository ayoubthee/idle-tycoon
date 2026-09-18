"use client";

import { useEffect, useState } from "react";

// Re-renders every `intervalMs` so countdown timers stay live without each
// component running its own setInterval.
export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
