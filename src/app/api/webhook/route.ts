import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { creditGems, isSessionProcessed, markSessionProcessed } from "@/lib/db";
import Stripe from "stripe";

// Stripe requires the raw request body (unparsed) to verify the webhook signature.
export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const gems = Number(session.metadata?.gems);

    if (userId && Number.isFinite(gems) && gems > 0 && !isSessionProcessed(session.id)) {
      creditGems(userId, gems);
      markSessionProcessed(session.id, userId, gems);
    }
  }

  return NextResponse.json({ received: true });
}
