import { NextResponse } from "next/server";
import { getOrCreateUserId } from "@/lib/userId";
import { creditGems, hasClaimedMilestone, claimMilestone, getBalance } from "@/lib/db";
import { MILESTONES } from "@/lib/gameData";

// Free gems for hitting a lifetime-coin milestone. Anyone can claim these just
// by playing — spending real money never unlocks anything free players can't
// eventually reach, it only buys convenience (skipping waits).
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const milestoneId = String(body?.milestoneId ?? "");
  const milestone = MILESTONES.find((m) => m.id === milestoneId);

  if (!milestone) {
    return NextResponse.json({ error: "Unknown milestone" }, { status: 400 });
  }

  const userId = await getOrCreateUserId();

  if (hasClaimedMilestone(userId, milestoneId)) {
    return NextResponse.json({ balance: getBalance(userId), alreadyClaimed: true });
  }

  claimMilestone(userId, milestoneId);
  const balance = creditGems(userId, milestone.gems);
  return NextResponse.json({ balance, gemsAwarded: milestone.gems });
}
