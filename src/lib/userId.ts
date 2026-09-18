import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const COOKIE_NAME = "tycoon_uid";

// Anonymous per-browser identity used only to key the gem ledger.
// Good enough for a single-player demo game; not a real auth system.
export async function getOrCreateUserId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(COOKIE_NAME)?.value;
  if (existing) return existing;

  const id = randomUUID();
  store.set(COOKIE_NAME, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return id;
}
