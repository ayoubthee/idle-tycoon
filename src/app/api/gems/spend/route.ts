import { NextResponse } from "next/server";
import { getOrCreateUserId } from "@/lib/userId";
import { debitGems } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const amount = Number(body?.amount);

  if (!Number.isFinite(amount) || amount <= 0 || !Number.isInteger(amount)) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const userId = await getOrCreateUserId();
  const newBalance = debitGems(userId, amount);

  if (newBalance === null) {
    return NextResponse.json({ error: "Insufficient gems" }, { status: 402 });
  }

  return NextResponse.json({ balance: newBalance });
}
