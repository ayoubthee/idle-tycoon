import { NextResponse } from "next/server";
import { getOrCreateUserId } from "@/lib/userId";
import { getBalance } from "@/lib/db";

export async function GET() {
  const userId = await getOrCreateUserId();
  return NextResponse.json({ balance: getBalance(userId) });
}
