import { site, categories, nav } from '../data/site.mjs';
import { brands } from '../data/products.mjs';
import { icon, crown } from './icons.mjs';
import { esc, url, money } from './util.mjs';

const logo = (cls = '') => `
  <a class="logo ${cls}" href="${url('index.html')}" aria-label="${site.name} — naar de homepage">
    <span class="logo-mark">${crown}</span>
    <span>Media<b>koning</b></span>
  </a>`;

function topbar() {
  return `
  <div class="topbar">
    <div class="container">
      <ul>
        <li>${icon('truck')} Gratis verzending vanaf ${money(site.shipping.freeFrom)}</li>
        <li>${icon('bolt')} Op werkdagen voor ${site.shipping.cutoff} besteld, vandaag verzonden</li>
        <li>${icon('store')} Afhalen in Amsterdam, Rotterdam & Amersfoort</li>
      </ul>
      ${site.rating ? `<a class="rating" href="${site.rating.url}" target="_blank" rel="noopener">
        <span class="stars">★★★★★</span> ${String(site.rating.score).replace('.', ',')} / 10 · ${site.rating.source}
      </a>` : ''}
    </div>
  </div>`;
}

function mega() {
  const top = (cat) => `
    <div>
      <h4>${esc(cat.name)}</h4>
      <ul>
        <li><a href="${url(`categorie/${cat.slug}.html`)}">Alle ${esc(cat.short.toLowerCase())}</a></li>
        ${cat.slug === 'iptv-ontvangers'
          ? `<li><a href="${url('shop.html?os=Android')}">Android-boxen</a></li>
             <li><a href="${url('shop.html?os=Linux')}">Linux-boxen</a></li>
             <li><a href="${url('merk/formuler.html')}">Formuler</a></li>
             <li><a href="${url('merk/tvip.html')}">TVIP</a></li>
             <li><a href="${url('merk/infomir.html')}">Infomir MAG</a></li>`
          : cat.slug === 'mediaspelers'
            ? `<li><a href="${url('shop.html?os=Google+TV')}">Google TV</a></li>
               <li><a href="${url('merk/nvidia.html')}">NVIDIA SHIELD</a></li>
               <li><a href="${url('merk/xiaomi.html')}">Xiaomi</a></li>
               <li><a href="${url('merk/amazon.html')}">Fire TV</a></li>`
            : `<li><a href="${url('shop.html?q=afstandsbediening')}">Afstandsbedieningen</a></li>
               <li><a href="${url('shop.html?q=toetsenbord')}">Toetsenborden & air mice</a></li>
               <li><a href="${url('shop.html?q=kabel')}">Kabels</a></li>`}
      </ul>
    </div>`;
  return `
    <div class="mega" id="mega-shop">
      <div class="container mega-inner">
        ${categories.map(top).join('')}
        <div class="mega-promo">
          <div>
            <span class="badge badge-gold">Persoonlijk advies</span>
            <h3 style="margin:14px 0 8px">Welke box past bij jou?</h3>
            <p>Beantwoord 4 korte vragen en krijg direct een advies op maat.</p>
          </div>
          <a class="btn btn-sm" href="${url('keuzehulp.html')}" style="align-self:start">Start de keuzehulp ${icon('arrow')}</a>
        </div>
      </div>
    </div>`;
}

function header(active) {
  return `
  <header class="site-header" id="top">
    <div class="container header-inner">
      <button class="icon-btn menu-toggle" data-open="menu-drawer" aria-label="Menu openen">${icon('menu')}</button>
      ${logo()}
      <nav class="main-nav" aria-label="Hoofdmenu">
        <ul>
          ${nav
            .map((n) =>
              n.mega
                ? `<li class="has-mega"><button aria-expanded="false" aria-controls="mega-shop">${n.label} ${icon('chevron')}</button>${mega()}</li>`
                : `<li><a href="${url(n.href)}"${active === n.href ? ' aria-current="page"' : ''}>${n.label}</a></li>`,
            )
            .join('')}
        </ul>
      </nav>
      <div class="header-actions">
        <button class="search-trigger" data-search aria-label="Zoeken">${icon('search')}<span>Zoek een box, merk of vraag…</span><kbd>⌘K</kbd></button>
        <button class="icon-btn hide-xs" data-theme-toggle aria-label="Donker/licht thema wisselen">${icon('moon', 'i-moon')}</button>
        <a class="icon-btn hide-xs" href="${url('favorieten.html')}" aria-label="Favorieten">${icon('heart')}<span class="count" data-fav-count>0</span></a>
        <button class="icon-btn" data-open="cart-drawer" aria-label="Winkelwagen">${icon('cart')}<span class="count" data-cart-count>0</span></button>
      </div>
    </div>
  </header>`;
}

function drawers() {
  return `
  <div class="drawer drawer-left" id="menu-drawer" aria-hidden="true">
    <div class="drawer-backdrop" data-close></div>
    <div class="drawer-panel" role="dialog" aria-modal="true" aria-label="Menu">
      <div class="drawer-head">${logo()}<button class="icon-btn" data-close aria-label="Sluiten">${icon('close')}</button></div>
      <nav class="drawer-body mobile-nav" aria-label="Mobiel menu">
        <ul>
          <li><a href="${url('shop.html')}">Shop ${icon('arrow')}</a></li>
          <li class="sub">${categories.map((c) => `<a class="chip" href="${url(`categorie/${c.slug}.html`)}">${c.name}</a>`).join('')}</li>
          ${nav.filter((n) => !n.mega).map((n) => `<li><a href="${url(n.href)}">${n.label} ${icon('arrow')}</a></li>`).join('')}
          <li><a href="${url('klantenservice.html')}">Klantenservice ${icon('arrow')}</a></li>
          <li><a href="${url('over-ons.html')}">Over ons ${icon('arrow')}</a></li>
          <li><a href="${url('contact.html')}">Contact ${icon('arrow')}</a></li>
        </ul>
      </nav>
      <div class="drawer-foot">
        <a class="btn btn-whatsapp btn-block" href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener">${icon('whatsapp')} WhatsApp ons</a>
        <button class="btn btn-ghost btn-block" data-theme-toggle>${icon('moon')} Thema wisselen</button>
      </div>
    </div>
  </div>

  <div class="drawer" id="cart-drawer" aria-hidden="true">
    <div class="drawer-backdrop" data-close></div>
    <div class="drawer-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <div class="drawer-head"><h2 id="cart-title">Winkelwagen</h2><button class="icon-btn" data-close aria-label="Sluiten">${icon('close')}</button></div>
      <div class="drawer-body" data-cart-list></div>
      <div class="drawer-foot" data-cart-foot></div>
    </div>
  </div>

  <div class="search-modal" id="search-modal" role="dialog" aria-modal="true" aria-label="Zoeken">
    <div class="search-box">
      <div class="search-field">
        ${icon('search')}
        <input type="search" placeholder="Zoek op product, merk, specificatie of vraag…" aria-label="Zoekterm" autocomplete="off" data-search-input>
        <button class="icon-btn" data-search-close aria-label="Sluiten">${icon('close')}</button>
      </div>
      <div class="search-results" data-search-results></div>
      <div class="search-foot"><span>↑↓ navigeren</span><span>↵ openen</span><span>esc sluiten</span></div>
    </div>
  </div>

  <div class="compare-bar" data-compare-bar>
    <span><span data-compare-count>0</span> / 3 om te vergelijken</span>
    <button class="clear" data-compare-clear>Wissen</button>
    <a class="btn btn-primary btn-sm" href="${url('vergelijk.html')}">Vergelijk ${icon('arrow')}</a>
  </div>

  <div class="toasts" aria-live="polite" data-toasts></div>

  <a class="wa-float" href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener" aria-label="Chat met ons via WhatsApp">${icon('whatsapp')}</a>`;
}

function footer() {
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-top">
        <div>
          ${logo()}
          <p>${esc(site.description)}</p>
          ${site.rating ? `<p><span class="stars">★★★★★</span> <strong style="color:#fff">${String(site.rating.score).replace('.', ',')}</strong> uit ${site.rating.count.toLocaleString('nl-NL')} beoordelingen</p>` : ''}
        </div>
        <div>
          <h4>Shop</h4>
          <ul>
            ${categories.map((c) => `<li><a href="${url(`categorie/${c.slug}.html`)}">${c.name}</a></li>`).join('')}
            <li><a href="${url('merken.html')}">Alle merken</a></li>
            <li><a href="${url('keuzehulp.html')}">Keuzehulp</a></li>
            <li><a href="${url('vergelijk.html')}">Vergelijken</a></li>
          </ul>
        </div>
        <div>
          <h4>Service</h4>
          <ul>
            <li><a href="${url('klantenservice.html')}">Klantenservice</a></li>
            <li><a href="${url('klantenservice.html#verzending-afhalen')}">Verzending & afhalen</a></li>
            <li><a href="${url('klantenservice.html#retour-garantie')}">Retour & garantie</a></li>
            <li><a href="${url('kennisbank.html')}">Kennisbank</a></li>
            <li><a href="${url('contact.html')}">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4>Mediakoning</h4>
          <ul>
            <li><a href="${url('over-ons.html')}">Over ons</a></li>
            <li><a href="${url('reseller.html')}">Reseller worden</a></li>
            <li><a href="${url('contact.html#locaties')}">Afhaalpunten</a></li>
            <li><a href="${url('voorwaarden.html')}">Algemene voorwaarden</a></li>
            <li><a href="${url('privacy.html')}">Privacy & cookies</a></li>
          </ul>
        </div>
        <div>
          <h4>Blijf op de hoogte</h4>
          <p>Nieuwe modellen, firmware-tips en acties — maximaal één mail per maand.</p>
          <form class="newsletter" data-demo-form novalidate>
            <label class="sr-only" for="nl-email">E-mailadres</label>
            <input class="input" id="nl-email" type="email" name="email" placeholder="jouw@email.nl" required>
            <button class="btn btn-primary" type="submit">Aanmelden</button>
            <div class="form-success"><strong style="color:#fff">Bedankt! Check je inbox.</strong></div>
          </form>
          <ul style="margin-top:20px">
            <li><a href="tel:${site.phone.replace(/\s/g, '')}">${icon('phone', 'inline-ic')} ${site.phoneDisplay}</a></li>
            <li><a href="mailto:${site.email}">${site.email}</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} ${site.name} · KvK ${site.kvk} · Alle prijzen incl. btw</span>
        <div class="pay-icons" aria-label="Betaalmethoden">${site.payments.map((p) => `<span>${p}</span>`).join('')}</div>
      </div>
    </div>
  </footer>`;
}

export function layout({ title, description = site.description, path, active, body, jsonLd = [], bodyClass = '', noindex = false }) {
  const fullTitle = title ? `${title} | ${site.name}` : `${site.name} — ${site.tagline}`;
  const canonical = `${site.domain}/${path === 'index.html' ? '' : path}`;
  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: site.name,
      url: site.domain,
      email: site.email,
      telephone: site.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: site.locations[0].street,
        postalCode: site.locations[0].zip,
        addressLocality: site.locations[0].city,
        addressCountry: 'NL',
      },
      ...(site.rating ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: site.rating.score, bestRating: 10, ratingCount: site.rating.count } } : {}),
    },
    ...jsonLd,
  ];
  return `<!doctype html>
<html lang="nl" class="no-js" data-base="${url('')}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
${noindex ? '<meta name="robots" content="noindex">' : ''}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="nl_NL">
<meta name="theme-color" content="#4f3cff">
<link rel="icon" href="${url('favicon.svg')}" type="image/svg+xml">
<link rel="manifest" href="${url('manifest.webmanifest')}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="${url('assets/css/main.css')}">
<script>(function(){var d=document.documentElement;d.classList.remove('no-js');try{var t=localStorage.getItem('mk-theme');if(t)d.dataset.theme=t}catch(e){}})();</script>
<script src="${url('assets/js/catalog.js')}" defer></script>
<script src="${url('assets/js/app.js')}" defer></script>
<script type="application/ld+json">${JSON.stringify(ld.length === 1 ? ld[0] : ld)}</script>
</head>
<body class="${bodyClass}">
<a class="skip-link" href="#main">Naar de inhoud</a>
${site.demo ? `<div class="demo-banner" role="note"><strong>Conceptontwerp</strong> — demo-webshop met fictieve bedrijfsgegevens. Bestellingen en formulieren worden niet verwerkt.</div>` : ''}
${topbar()}
${header(active)}
<main id="main">
${body}
</main>
${footer()}
${drawers()}
</body>
</html>`;
}

export function pageHead({ crumbs = [], title, lead = '', extra = '' }) {
  const items = [{ label: 'Home', href: 'index.html' }, ...crumbs];
  return `
  <section class="page-head">
    <div class="container">
      <nav aria-label="Kruimelpad">
        <ol class="crumbs">
          ${items.map((c, i) => (i < items.length - 1 ? `<li><a href="${url(c.href)}">${esc(c.label)}</a></li>` : `<li aria-current="page">${esc(c.label)}</li>`)).join('')}
        </ol>
      </nav>
      <h1>${title}</h1>
      ${lead ? `<p class="lead">${lead}</p>` : ''}
      ${extra}
    </div>
  </section>`;
}

export function breadcrumbLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ label: 'Home', href: '' }, ...items].map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: `${site.domain}/${c.href}`,
    })),
  };
}

export { brands };
