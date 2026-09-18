import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-5xl">💎</p>
      <h1 className="text-2xl font-bold">Bedankt voor je aankoop!</h1>
      <p className="max-w-sm text-white/60">
        Je gems worden automatisch bijgeschreven zodra Stripe de betaling bevestigt (meestal binnen enkele
        seconden).
      </p>
      <Link href="/" className="rounded-xl bg-emerald-600 px-5 py-2 font-semibold text-white hover:bg-emerald-500">
        Terug naar het spel
      </Link>
    </main>
  );
}
