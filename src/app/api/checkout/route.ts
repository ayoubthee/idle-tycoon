import { NextResponse } from "next/server";
import { getOrCreateUserId } from "@/lib/userId";
import { getStripe } from "@/lib/stripe";
import { GEM_PACKAGES } from "@/lib/gameData";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const packageId = String(body?.packageId ?? "");
  const pkg = GEM_PACKAGES.find((p) => p.id === packageId);

  if (!pkg) {
    return NextResponse.json({ error: "Unknown gem package" }, { status: 400 });
  }

  const userId = await getOrCreateUserId();
  const origin = request.headers.get("origin") ?? new URL(request.url).origin;

  let session;
  try {
    const stripe = getStripe();
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: Math.round(pkg.priceEUR * 100),
            product_data: {
              name: `${pkg.label} — ${pkg.gems} gems`,
              description: "Idle Tycoon premium currency. Fixed price, fixed amount — no randomized contents.",
            },
          },
        },
      ],
      metadata: {
        userId,
        packageId: pkg.id,
        gems: String(pkg.gems),
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
