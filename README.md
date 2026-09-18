# Idle Tycoon

Een idle/clicker tycoon-spel: klik voor munten, koop en upgrade gebouwen, en
gebruik optionele "gems" (echt geld via Stripe) om wachttijden te versnellen.

## Ontwerpprincipes (bewust, niet toevallig)

Dit spel gebruikt wél tijdsdruk (upgrade-timers die je met gems kunt
versnellen), maar bewust **geen** gok-mechanics:

- **Geen loot boxes / gacha.** Alles wat je met gems koopt heeft een vaste,
  vooraf bekende prijs en een vaste, vooraf bekende opbrengst. Nooit "kans op".
- **Geen kunstmatige tijdsdruk-verkoop.** Er verschijnen geen "nog maar 3
  over!"-popups of aftellende aanbiedingen die er niet echt zijn.
- **Gratis spelers komen er ook.** Mijlpalen (`src/lib/gameData.ts` →
  `MILESTONES`) geven gratis gems — geld koopt alleen gemak (sneller wachten),
  nooit iets dat gratis onbereikbaar is.
- **Transparante gem-winkel.** Vaste bundels, vaste prijzen
  (`src/lib/gameData.ts` → `GEM_PACKAGES`), geen verborgen kosten.
- **Server-authoritative gem-balans.** Gems worden in een SQLite-db
  bijgehouden per anonieme gebruikers-cookie, niet client-side vervalsbaar.

Wil je de balans tussen "verslavend leuk" en "tijdsdruk" bijstellen? Dat zit
allemaal in `src/lib/gameData.ts` (kosten, productie, timer-duur, rush-tarief).

## Setup

```bash
npm install
cp .env.example .env.local
```

Vul in `.env.local` je Stripe **test**-sleutels in (zie
https://dashboard.stripe.com/test/apikeys). Start daarna de dev-server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Stripe webhook lokaal testen

Installeer de [Stripe CLI](https://stripe.com/docs/stripe-cli) en run:

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

Kopieer het getoonde `whsec_...` signing secret naar `STRIPE_WEBHOOK_SECRET`
in `.env.local`. Zonder correcte webhook-configuratie worden gekochte gems
niet bijgeschreven, ook al lukt de betaling wel.

### Live gaan

Voor productie: gebruik je Stripe **live** keys, zet een webhook-endpoint op
in het Stripe dashboard dat wijst naar `https://jouwdomein.nl/api/webhook`
met event `checkout.session.completed`, en zorg dat `/data` persistent is
(of vervang `better-sqlite3` door een echte database) — de huidige opzet
bewaart de gem-ledger in een lokaal SQLite-bestand, wat niet werkt op
serverless hosting zoals Vercel zonder aanpassing.

## Structuur

- `src/lib/gameData.ts` — alle balans-getallen (kosten, productie, timers, prijzen)
- `src/store/useGameStore.ts` — client-side spelstatus (munten, gebouwen), localStorage
- `src/lib/db.ts` — server-side gem-ledger (SQLite)
- `src/app/api/*` — gem-balans, checkout (Stripe) en webhook routes
- `src/components/*` — UI
