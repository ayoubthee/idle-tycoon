import Link from "next/link";

export default function CancelPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-5xl">🙂</p>
      <h1 className="text-2xl font-bold">Geen probleem</h1>
      <p className="max-w-sm text-white/60">
        Je aankoop is geannuleerd, er is niets in rekening gebracht. Je kunt gewoon verder spelen.
      </p>
      <Link href="/" className="rounded-xl bg-white/10 px-5 py-2 font-semibold text-white hover:bg-white/20">
        Terug naar het spel
      </Link>
    </main>
  );
}
