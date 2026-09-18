import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

// Lazily constructed so the app can still boot (and the rest of the game work)
// before you've added real Stripe keys to .env.local.
export function getStripe(): Stripe {
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add your Stripe test key to .env.local (see .env.example)."
    );
  }
  return new Stripe(key);
}
