# Mediakoning — nieuwe website (redesign)

Een complete, nieuw ontworpen versie van de webshop **mediakoning.nl**: sneller, moderner,
beter vindbaar in Google en veel prettiger in gebruik op mobiel.

> **Status: concept / demo.** Alle teksten zijn nieuw geschreven. Productfoto's zijn vervangen
> door eigen SVG-illustraties. Prijzen, specificaties en bedrijfsgegevens moeten door de eigenaar
> worden gecontroleerd (zie de checklist onderaan).

## Bekijken

```bash
cd mediakoning-redesign
npm run build        # bouwt de site naar ./dist
npm run serve        # bouwt en start een lokale server op http://localhost:4173
npm run check        # opent elke pagina in Chromium: JS-fouten + kapotte links
```

Je kunt `dist/index.html` ook direct openen, of de map `dist/` uploaden naar elke host
(Netlify, Vercel, Cloudflare Pages, een gewone webserver).

## Wat is er beter dan de huidige site?

| Onderdeel | Nieuw |
| --- | --- |
| **Snelheid** | Statische HTML, geen WordPress of plugins, geen jQuery. Eén stylesheet en één script (zonder framework). Productafbeeldingen zijn inline-SVG's, dus geen extra downloads. |
| **Design** | Eigen design system met kleur-tokens, licht én donker thema (volgt het systeem en is te wisselen), vloeiende micro-animaties, en respecteert "verminderde beweging". |
| **Mobiel** | Mobile-first: sticky koopbalk op productpagina's, filter-drawer, menu-drawer en een zwevende WhatsApp-knop. |
| **Zoeken** | Directe zoekfunctie (⌘K / Ctrl K of `/`) door producten, kennisbank, FAQ en pagina's, met toetsenbordnavigatie en gemarkeerde zoektermen. |
| **Shop** | Filteren op categorie, merk, besturingssysteem, prijs en aanbiedingen. Sorteren, filterchips en een URL die je kunt delen (`shop.html?merk=tvip&os=Linux`). |
| **Keuzehulp** | Quiz van 4 vragen die de 3 best passende boxen berekent, met uitleg waarom ze passen. |
| **Vergelijker** | Tot 3 producten naast elkaar, met gemarkeerde verschillen en een "alleen verschillen"-schakelaar. |
| **Productpagina** | Galerij, highlights, live levertijd ("bestel binnen 2u 13m"), specificatietabel, "in de doos", FAQ, "vaak samen gekocht", recent bekeken. |
| **Winkelwagen** | Slide-in winkelwagen, voortgangsbalk tot gratis verzending, kortingscode (demo: `KONING10`) en afrekenen in 3 stappen met keuze uit afhaalpunten. |
| **Vertrouwen** | WebwinkelKeur-score prominent in beeld, USP-balk, garantie/retour bij elke koopknop, en duidelijk vermeld: *wij verkopen geen abonnementen*. |
| **SEO** | Unieke title en description per pagina, canonical URL's, Open Graph, JSON-LD (Store, Product, BreadcrumbList, FAQPage, Article, ItemList), `sitemap.xml` en `robots.txt`. |
| **Toegankelijkheid** | Semantische HTML, skip-link, zichtbare focus, ARIA bij tabs, drawers en dialogen, toetsenbordbediening en voldoende contrast. |
| **Content** | Kennisbank met 6 nieuwe artikelen (wat is IPTV, Android of Linux, installatie, storingen oplossen, merkvergelijking). |
| **Contact** | "Nu open/gesloten"-indicator in Amsterdamse tijd, locatiekaarten met routelink, contactformulier, afspraak via WhatsApp. |
| **Privacy** | Geen trackers en geen externe kaartdienst. Alleen functionele opslag in de browser (winkelwagen, favorieten, thema). |

## Pagina's (52)

Home · Shop · 3 categorieën · Merken + 8 merkpagina's · 19 productpagina's · Keuzehulp ·
Vergelijken · Kennisbank + 6 artikelen · Over ons · Contact · Klantenservice (FAQ + bestelstatus) ·
Reseller worden · Winkelwagen · Afrekenen · Favorieten · Voorwaarden · Privacy · 404

## Structuur

```
build.mjs               bouwscript (Node, geen dependencies)
src/data/site.mjs       bedrijfsgegevens, verzendbeleid, openingstijden, locaties, menu
src/data/products.mjs   producten en merken
src/data/content.mjs    kennisbank-artikelen en FAQ
src/lib/                layout, componenten, iconen en SVG-illustraties
src/pages.mjs           alle paginatemplates
src/assets/css/main.css design system
src/assets/js/app.js    alle interactie (winkelwagen, zoeken, filters, quiz, ...)
scripts/check.mjs       kwaliteitscheck in de browser
dist/                   gebouwde site (deze map publiceer je)
```

Een product toevoegen? Voeg één object toe aan `src/data/products.mjs` en run `npm run build`.
De productpagina, de shop, de zoekfunctie, de vergelijker, de keuzehulp en de sitemap werken
dan automatisch bij.

## Checklist voor livegang

- [ ] **Prijzen en specificaties** in `products.mjs` controleren tegen de actuele voorraad.
- [ ] **KvK- en btw-nummer** invullen in `site.mjs`. Online staan twee verschillende KvK-nummers; controleer welke klopt.
- [ ] **Verzendbeleid** controleren: gratis verzending vanaf €50, €4,95 verzendkosten, cutoff 17:00, 14 dagen retour en 24 maanden garantie zijn aannames.
- [ ] **WebwinkelKeur-score** (9,1 uit 2.264) bijwerken, of vervangen door de officiële widget.
- [ ] **Openingstijden** en adressen van de afhaalpunten controleren (postcodes van Rotterdam en Amersfoort ontbreken).
- [ ] **Over ons**: de tijdlijn is algemeen gehouden; vul echte jaartallen en mijlpalen in.
- [ ] **Productfoto's**: vervang eventueel de SVG-illustraties door echte foto's (`productArt()` in `src/lib/illustrations.mjs`).
- [ ] **Voorwaarden en privacy**: dit zijn concepten; laat ze juridisch controleren.
- [ ] **Koppelingen**: de formulieren, de bestelstatus en het afrekenen zijn nu demo's. Koppel ze aan WooCommerce (REST/Store API), Shopify of een andere backend, en aan een betaalprovider zoals Mollie.
