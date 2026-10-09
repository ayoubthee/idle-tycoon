import { site, categories } from './data/site.mjs';
import { products, brands } from './data/products.mjs';
import { articles, faq } from './data/content.mjs';
import { icon } from './lib/icons.mjs';
import { productArt, productArtVariant, articleCover, mapArt } from './lib/illustrations.mjs';
import { esc, url, money, slugify, dateNL } from './lib/util.mjs';
import { layout, pageHead, breadcrumbLd } from './lib/layout.mjs';
import {
  productCard, sectionHead, uspStrip, catCard, brandTile, articleCard, faqAccordion, ctaQuiz,
  brandOf, catOf, productBySlug, withBrand, badgeHtml,
} from './lib/components.mjs';

const byPop = (a, b) => b.popularity - a.popularity;
const waLink = (text = '') => `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

/* ───────────────────────────── Home ───────────────────────────── */
export function home() {
  const hero = withBrand(productBySlug('formuler-z11-pro-max'));
  const remote = withBrand(productBySlug('formuler-bt1-afstandsbediening'));
  const best = [...products].filter((p) => p.category !== 'accessoires').sort(byPop).slice(0, 8);
  const acc = products.filter((p) => p.category === 'accessoires').sort(byPop).slice(0, 4);
  const channels = [
    ['1', 'Journaal', 'Talkshow', 'Film'],
    ['2', 'Voetbal live', 'Studio', 'Nieuws'],
    ['3', 'Natuur', 'Documentaire', 'Serie'],
    ['4', 'Kids', 'Tekenfilm', 'Muziek'],
  ];
  const body = `
  <section class="hero">
    <div class="container hero-grid">
      <div>
        <a class="pill-note reveal" href="${url('product/formuler-z12-ultra-bt3.html')}"><span class="badge badge-brand">Nieuw</span> Formuler Z12 Ultra nu op voorraad ${icon('arrow', 'inline-ic')}</a>
        <h1 class="reveal">Televisie zoals het <span class="text-gradient">hoort te voelen.</span></h1>
        <p class="lead reveal">De beste IPTV-ontvangers en mediaspelers van Nederland, zorgvuldig geselecteerd en getest. Met eerlijk advies van mensen die er echt verstand van hebben.</p>
        <div class="hero-ctas reveal">
          <a class="btn btn-primary btn-lg" href="${url('shop.html')}">Bekijk alle boxen ${icon('arrow')}</a>
          <a class="btn btn-ghost btn-lg" href="${url('keuzehulp.html')}">${icon('sparkle')} Welke past bij mij?</a>
        </div>
        <div class="hero-trust reveal">
          ${site.rating ? `<div><strong>${String(site.rating.score).replace('.', ',')}<small class="muted">/10</small></strong><span>${site.rating.count.toLocaleString('nl-NL')} reviews</span></div>` : `<div><strong>${site.shipping.warrantyMonths} mnd</strong><span>garantie</span></div>`}
          <div><strong>100+</strong><span>ontvangers & spelers</span></div>
          <div><strong>3</strong><span>afhaalpunten</span></div>
        </div>
      </div>
      <div class="hero-visual reveal" aria-hidden="true">
        <div class="hero-tv"><div class="screen"><div class="epg">
          <div class="epg-top"><span>TV-gids</span><span data-clock>20:30</span></div>
          <div class="epg-hero"><small style="opacity:.7">Nu live · 4K HDR</small><b>Jouw zenders.<br>Razendsnel.</b><div class="bar"><i></i></div></div>
          <div class="epg-rows">${channels.map((r, i) => `<div class="epg-row${i === 1 ? ' active' : ''}">${r.map((c) => `<span>${c}</span>`).join('')}</div>`).join('')}</div>
        </div></div></div>
        <div class="hero-box">${productArt(hero)}</div>
        <div class="hero-remote">${productArt(remote)}</div>
        <div class="float-card fc-1"><span class="ic">${icon('check')}</span><div>Op voorraad<small>Vandaag verzonden</small></div></div>
        <div class="float-card fc-2"><span class="ic" style="background:var(--brand-soft);color:var(--brand)">${icon('bolt')}</span><div>Zappen in 0,4 s<small>Formuler Z11 Pro Max</small></div></div>
      </div>
    </div>
  </section>

  ${uspStrip()}

  <section class="section">
    <div class="container">
      ${sectionHead({ eyebrow: 'Assortiment', title: 'Waar ben je naar op zoek?', text: 'Van een simpele box voor live-tv tot een krachtpatser voor 4K-films en gaming.' })}
      <div class="grid grid-3">${categories.map(catCard).join('')}</div>
    </div>
  </section>

  <section class="section" style="padding-top:0">
    <div class="container">
      ${sectionHead({
        eyebrow: 'Populair',
        title: 'Meest gekozen deze maand',
        action: `<div class="rail-nav"><button data-rail="prev" aria-label="Vorige">${icon('arrowLeft')}</button><button data-rail="next" aria-label="Volgende">${icon('arrow')}</button></div>`,
      })}
      <div class="rail" data-rail-track>${best.map((p) => productCard(p, { reveal: false })).join('')}</div>
      <div style="text-align:center;margin-top:32px"><a class="btn btn-ghost" href="${url('shop.html')}">Bekijk het hele assortiment ${icon('arrow')}</a></div>
    </div>
  </section>

  ${ctaQuiz()}

  <section class="section">
    <div class="container">
      ${sectionHead({ eyebrow: 'Waarom Mediakoning', title: 'Meer dan een webshop.', text: 'We verkopen alleen wat we zelf getest hebben en blijven bereikbaar, ook ná je aankoop.' })}
      <div class="bento">
        <div class="feature wide dark reveal">
          <span class="ic">${icon('chat')}</span>
          <h3>Persoonlijk advies, geen callcenter</h3>
          <p>Stuur een WhatsApp-bericht en je krijgt antwoord van iemand die de boxen dagelijks in handen heeft. Of het nu gaat om de keuze, de installatie of een instelling die je niet kunt vinden.</p>
          <div style="margin-top:20px"><a class="btn btn-whatsapp" href="${waLink('Hoi Mediakoning! Ik heb een vraag over…')}" target="_blank" rel="noopener">${icon('whatsapp')} Stel je vraag</a></div>
        </div>
        <div class="feature reveal"><span class="ic">${icon('checkCircle')}</span><h3>Door ons getest</h3><p>Elk model in ons assortiment is door ons team uitgebreid getest op snelheid, stabiliteit en gebruiksgemak.</p></div>
        <div class="feature reveal"><span class="ic">${icon('store')}</span><h3>Showroom in Amsterdam</h3><p>Bekijk en probeer de boxen in het echt. Maak een afspraak en we nemen de tijd voor je.</p></div>
        <div class="feature reveal"><span class="ic">${icon('shield')}</span><h3>${site.shipping.warrantyMonths} maanden garantie</h3><p>Gaat er iets mis? Wij regelen het. Vaak lossen we problemen op afstand op, zonder opsturen.</p></div>
        <div class="feature reveal"><span class="ic">${icon('bulb')}</span><h3>Uitgebreide kennisbank</h3><p>Heldere handleidingen en eerlijke vergelijkingen, zodat je zelf een goede keuze kunt maken.</p></div>
      </div>
    </div>
  </section>

  <section class="section" style="padding-top:0">
    <div class="container">
      ${sectionHead({ eyebrow: 'Merken', title: 'De beste merken onder één dak', action: `<a class="btn btn-ghost btn-sm" href="${url('merken.html')}">Alle merken ${icon('arrow')}</a>` })}
      <div class="brand-strip reveal">${brands.filter((b) => b.slug !== 'universeel').map(brandTile).join('')}</div>
    </div>
  </section>

  <section class="section" style="background:var(--surface);border-block:1px solid var(--line)">
    <div class="container">
      ${sectionHead({ eyebrow: 'Zo werkt het', title: 'Binnen 10 minuten tv kijken' })}
      <div class="steps">
        <div class="step reveal"><h3>Kies je box</h3><p>Gebruik de keuzehulp of vraag ons om advies. Twijfel je tussen twee modellen? Zet ze naast elkaar in de vergelijker.</p></div>
        <div class="step reveal"><h3>Morgen in huis</h3><p>Op werkdagen voor ${site.shipping.cutoff} besteld is vandaag verzonden. Of haal hem op bij een van onze afhaalpunten.</p></div>
        <div class="step reveal"><h3>Aansluiten</h3><p>HDMI in de tv, netwerkkabel in de router, stroom erin. Onze Nederlandse snelstartgids helpt je stap voor stap.</p></div>
        <div class="step reveal"><h3>Genieten</h3><p>Voeg je eigen legale tv-dienst toe en kijk in 4K. Vragen? We zijn er gewoon voor je.</p></div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      ${sectionHead({ eyebrow: 'Maak je setup compleet', title: 'Slimme accessoires', action: `<a class="btn btn-ghost btn-sm" href="${url('categorie/accessoires.html')}">Alle accessoires ${icon('arrow')}</a>` })}
      <div class="product-grid">${acc.map((p) => productCard(p)).join('')}</div>
    </div>
  </section>

${site.rating ? `  <section class="section" style="padding-top:0">
    <div class="container">
      <div class="rating-card reveal">
        <div class="rating-score">${String(site.rating.score).replace('.', ',')}<small>/10</small></div>
        <div style="flex:1;min-width:220px">
          <div class="stars" style="font-size:1.4rem">★★★★★</div>
          <strong>Gemiddelde klantbeoordeling op ${site.rating.source}</strong>
          <p class="muted" style="margin:0">Gebaseerd op ${site.rating.count.toLocaleString('nl-NL')} geverifieerde beoordelingen.</p>
        </div>
        <a class="btn btn-dark" href="${site.rating.url}" target="_blank" rel="noopener">Lees alle reviews ${icon('arrow')}</a>
      </div>
    </div>
  </section>` : ''}

  <section class="section" style="padding-top:0">
    <div class="container">
      ${sectionHead({ eyebrow: 'Kennisbank', title: 'Slimmer kiezen, makkelijker kijken', action: `<a class="btn btn-ghost btn-sm" href="${url('kennisbank.html')}">Alle artikelen ${icon('arrow')}</a>` })}
      <div class="grid grid-3">${articles.slice(0, 3).map(articleCard).join('')}</div>
    </div>
  </section>`;
  return layout({ path: 'index.html', body });
}

/* ───────────────────────────── Shop / filters ───────────────────────────── */
function filterForm(id, list, preset = {}) {
  const count = (fn) => list.filter(fn).length;
  const opt = (name, value, label, n) =>
    `<label class="check"><input type="checkbox" name="${name}" value="${esc(value)}"${preset[name] === value ? ' checked' : ''}><span>${esc(label)}</span><em>${n}</em></label>`;
  const cats = categories.filter((c) => count((p) => p.category === c.slug));
  const brs = brands.filter((b) => count((p) => p.brand === b.slug));
  const oses = [...new Set(list.map((p) => p.os).filter((o) => o && o !== '—'))];
  const max = Math.ceil(Math.max(...list.map((p) => p.price)) / 10) * 10;
  return `
  <form class="filters-form" id="${id}" data-filter-form>
    ${cats.length > 1 ? `<div class="filter-group"><h3>Categorie</h3><div class="opts">${cats.map((c) => opt('cat', c.slug, c.name, count((p) => p.category === c.slug))).join('')}</div></div>` : ''}
    ${brs.length > 1 ? `<div class="filter-group"><h3>Merk</h3><div class="opts">${brs.map((b) => opt('merk', b.slug, b.name, count((p) => p.brand === b.slug))).join('')}</div></div>` : ''}
    ${oses.length > 1 ? `<div class="filter-group"><h3>Besturingssysteem</h3><div class="opts">${oses.map((o) => opt('os', o, o, count((p) => p.os === o))).join('')}</div></div>` : ''}
    <div class="filter-group">
      <h3>Prijs</h3>
      <div class="range-row">
        <label class="sr-only" for="${id}-min">Minimumprijs</label>
        <input class="input" id="${id}-min" type="number" name="min" placeholder="€ 0" min="0" max="${max}" inputmode="numeric">
        <span>–</span>
        <label class="sr-only" for="${id}-max">Maximumprijs</label>
        <input class="input" id="${id}-max" type="number" name="max" placeholder="€ ${max}" min="0" max="${max}" inputmode="numeric">
      </div>
    </div>
    <div class="filter-group">
      <h3>Beschikbaarheid</h3>
      <label class="check"><input type="checkbox" name="sale" value="1"><span>Alleen aanbiedingen</span></label>
    </div>
    <button type="reset" class="btn btn-ghost btn-sm">Filters wissen</button>
  </form>`;
}

export function shop({ path, title, lead, crumbs, list, preset = {}, tabs = true, intro = '' }) {
  const sorted = [...list].sort(byPop);
  const body = `
  ${pageHead({
    crumbs,
    title,
    lead,
    extra: tabs
      ? `<nav class="cat-tabs" aria-label="Categorieën"><a href="${url('shop.html')}"${path === 'shop.html' ? ' aria-current="page"' : ''}>Alles</a>${categories
          .map((c) => `<a href="${url(`categorie/${c.slug}.html`)}"${path === `categorie/${c.slug}.html` ? ' aria-current="page"' : ''}>${c.name}</a>`)
          .join('')}</nav>`
      : '',
  })}
  <section class="section-sm">
    <div class="container">
      ${intro}
      <div class="shop-layout" data-shop>
        <aside class="filters" aria-label="Filters">${filterForm('f-desk', list, preset)}</aside>
        <div>
          <div class="shop-toolbar">
            <span class="result-count" data-result-count aria-live="polite">${list.length} producten</span>
            <button class="btn btn-ghost btn-sm filter-toggle" data-open="filter-drawer">${icon('filter')} Filters</button>
            <label class="sr-only" for="sort">Sorteren</label>
            <select class="select" id="sort" data-sort>
              <option value="pop">Populairst</option>
              <option value="price-asc">Prijs laag → hoog</option>
              <option value="price-desc">Prijs hoog → laag</option>
              <option value="name">Naam A–Z</option>
            </select>
          </div>
          <div class="active-filters" data-active-filters></div>
          <div class="product-grid" data-grid>
            ${sorted.map((p) => productCard(p, { reveal: false })).join('')}
            <div class="no-results" data-no-results hidden>
              <h3>Geen producten gevonden</h3>
              <p>Probeer een ander filter of <a href="${waLink('Ik zoek een box maar kan hem niet vinden:')}" style="color:var(--brand);font-weight:700">vraag het ons</a> — we denken graag mee.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <div class="drawer drawer-left" id="filter-drawer" aria-hidden="true">
    <div class="drawer-backdrop" data-close></div>
    <div class="drawer-panel" role="dialog" aria-modal="true" aria-label="Filters">
      <div class="drawer-head"><h2>Filters</h2><button class="icon-btn" data-close aria-label="Sluiten">${icon('close')}</button></div>
      <div class="drawer-body">${filterForm('f-mob', list, preset)}</div>
      <div class="drawer-foot"><button class="btn btn-primary btn-block" data-close>Toon <span data-result-count-btn>${list.length}</span> resultaten</button></div>
    </div>
  </div>
  ${ctaQuiz()}`;
  return layout({
    path,
    title: title.replace(/<[^>]+>/g, ''),
    description: lead,
    active: 'shop.html',
    body,
    jsonLd: [
      breadcrumbLd(crumbs),
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: sorted.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${site.domain}/product/${p.slug}.html`, name: p.name })),
      },
    ],
  });
}

/* ───────────────────────────── Product ───────────────────────────── */
export function product(raw) {
  const p = withBrand(raw);
  const brand = brandOf(p.brand);
  const cat = catOf(p.category);
  const related = products.filter((x) => x.slug !== p.slug && (x.category === p.category || x.brand === p.brand)).sort(byPop).slice(0, 4);
  const accessories = products.filter((x) => x.category === 'accessoires' && x.slug !== p.slug && (x.brand === p.brand || x.brand === 'universeel')).slice(0, 3);
  const specs = [
    ['Merk', brand.name],
    ['Besturingssysteem', p.osVersion],
    ['Resolutie', p.resolution],
    ['Processor', p.chipset],
    ['Werkgeheugen', p.ram],
    ['Opslag', p.storage],
    ['Wifi', p.wifi],
    ['Bluetooth', p.bluetooth],
    ['Netwerk', p.lan],
    ['USB', p.usb],
    ['Beeld & geluid', p.codecs],
    ['Geschikt voor', p.compat],
    ['Garantie', `${site.shipping.warrantyMonths} maanden`],
  ].filter(([, v]) => v && v !== '—');
  const crumbs = [
    { label: 'Shop', href: 'shop.html' },
    { label: cat.name, href: `categorie/${cat.slug}.html` },
    { label: p.name, href: `product/${p.slug}.html` },
  ];
  const body = `
  <section class="section-sm">
    <div class="container">
      <nav aria-label="Kruimelpad"><ol class="crumbs">${[{ label: 'Home', href: 'index.html' }, ...crumbs]
        .map((c, i, a) => (i < a.length - 1 ? `<li><a href="${url(c.href)}">${esc(c.label)}</a></li>` : `<li aria-current="page">${esc(c.label)}</li>`))
        .join('')}</ol></nav>
      <div class="pdp" data-pdp="${p.slug}">
        <div class="gallery">
          <div class="gallery-main" data-gallery-main>
            <div class="badges">${badgeHtml(p)}</div>
            ${productArtVariant(p, 0)}
          </div>
          <div class="gallery-thumbs" role="group" aria-label="Afbeeldingen">
            ${[0, 1, 2, 3].map((v) => `<button data-gallery-thumb aria-pressed="${v === 0}" aria-label="Afbeelding ${v + 1}">${productArtVariant(p, v)}</button>`).join('')}
          </div>
        </div>
        <div class="buybox">
          <a class="brand-link" href="${url(`merk/${brand.slug}.html`)}">${esc(brand.name)}</a>
          <h1>${esc(p.name)}</h1>
          <p class="summary">${esc(p.summary)}</p>
          <div class="price-tag"><strong>${money(p.price)}</strong>${p.oldPrice ? `<s>${money(p.oldPrice)}</s> <span class="badge badge-sale">Je bespaart ${money(p.oldPrice - p.price)}</span>` : ''}</div>
          <div class="price-note">Inclusief btw · ${p.price >= site.shipping.freeFrom ? 'Gratis verzonden' : `+ ${money(site.shipping.cost)} verzendkosten`}</div>
          <ul class="highlights">${p.highlights.map((h) => `<li>${icon('checkCircle')}<span>${esc(h)}</span></li>`).join('')}</ul>
          <div class="delivery-note" data-delivery>${icon('truck')}<span>${p.stock === 'low' ? 'Nog enkele op voorraad — ' : 'Op voorraad — '}<span data-delivery-text>voor ${site.shipping.cutoff} besteld, vandaag verzonden</span></span></div>
          <div class="buy-row">
            <div class="qty" data-qty><button type="button" data-qty-dec aria-label="Minder">${icon('minus')}</button><input type="number" value="1" min="1" max="10" aria-label="Aantal" data-qty-input><button type="button" data-qty-inc aria-label="Meer">${icon('plus')}</button></div>
            <button class="btn btn-primary btn-lg" data-add="${p.slug}" data-add-qty data-main-buy>${icon('cart')} In winkelwagen</button>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <button class="btn btn-ghost btn-sm" data-fav="${p.slug}" aria-pressed="false">${icon('heart')} Bewaren</button>
            ${p.category !== 'accessoires' ? `<button class="btn btn-ghost btn-sm" data-compare="${p.slug}" aria-pressed="false">${icon('compare')} Vergelijken</button>` : ''}
            <a class="btn btn-ghost btn-sm" href="${waLink(`Hoi! Ik heb een vraag over de ${p.name}:`)}" target="_blank" rel="noopener">${icon('whatsapp')} Vraag over dit product</a>
          </div>
          <div class="assurance">
            <div>${icon('truck')} Gratis vanaf ${money(site.shipping.freeFrom)}</div>
            <div>${icon('return')} ${site.shipping.returnDays} dagen bedenktijd</div>
            <div>${icon('shield')} ${site.shipping.warrantyMonths} mnd garantie</div>
            <div>${icon('store')} Afhalen mogelijk</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section-sm">
    <div class="container" style="max-width:980px">
      <div class="tabs" role="tablist">
        <button role="tab" aria-selected="true" aria-controls="tab-spec" id="t-spec">Specificaties</button>
        <button role="tab" aria-selected="false" aria-controls="tab-box" id="t-box">In de doos</button>
        <button role="tab" aria-selected="false" aria-controls="tab-faq" id="t-faq">Vragen</button>
      </div>
      <div class="tab-panel" role="tabpanel" id="tab-spec" aria-labelledby="t-spec">
        <table class="spec-table"><tbody>${specs.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table>
      </div>
      <div class="tab-panel" role="tabpanel" id="tab-box" aria-labelledby="t-box" hidden>
        <ul class="in-box">${p.inBox.map((i) => `<li>${icon('box')} ${esc(i)}</li>`).join('')}</ul>
      </div>
      <div class="tab-panel" role="tabpanel" id="tab-faq" aria-labelledby="t-faq" hidden>
        ${faqAccordion([
          { q: 'Zit er een abonnement bij?', a: 'Nee. Je koopt de hardware; een abonnement sluit je zelf af bij een legale tv-dienst naar keuze.' },
          { q: 'Kan ik deze box ophalen?', a: 'Ja, in Amsterdam, Rotterdam en Amersfoort — uitsluitend op afspraak. Kies bij het afrekenen voor afhalen.' },
          { q: 'Helpen jullie met installeren?', a: 'Zeker. Je krijgt een Nederlandstalige snelstartgids en je kunt ons altijd een WhatsApp-bericht sturen.' },
        ])}
      </div>
    </div>
  </section>

  ${accessories.length ? `
  <section class="section-sm">
    <div class="container">
      ${sectionHead({ eyebrow: 'Vaak samen gekocht', title: 'Maak je setup compleet' })}
      <div class="product-grid">${accessories.map((x) => productCard(x)).join('')}</div>
    </div>
  </section>` : ''}

  <section class="section-sm">
    <div class="container">
      ${sectionHead({ eyebrow: 'Misschien ook interessant', title: 'Vergelijkbare producten' })}
      <div class="product-grid">${related.map((x) => productCard(x)).join('')}</div>
    </div>
  </section>

  <section class="section-sm" data-recent-wrap hidden>
    <div class="container">
      ${sectionHead({ title: 'Recent bekeken' })}
      <div class="product-grid" data-recent></div>
    </div>
  </section>

  <div class="sticky-buy" data-sticky-buy>
    <div class="container">
      <div class="thumb">${productArt(p, { label: false })}</div>
      <div class="name">${esc(p.name)}</div>
      <div class="price">${money(p.price)}</div>
      <button class="btn btn-primary" data-add="${p.slug}" data-add-qty>${icon('cart')} In winkelwagen</button>
    </div>
  </div>`;

  return layout({
    path: `product/${p.slug}.html`,
    title: p.name,
    description: `${p.name} kopen? ${p.summary} ${money(p.price)} — op voorraad bij ${site.name}.`,
    active: 'shop.html',
    body,
    jsonLd: [
      breadcrumbLd(crumbs),
      {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: p.name,
        description: p.summary,
        brand: { '@type': 'Brand', name: brand.name },
        sku: p.slug,
        category: cat.name,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'EUR',
          price: p.price.toFixed(2),
          availability: p.stock === 'out' ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
          url: `${site.domain}/product/${p.slug}.html`,
          seller: { '@type': 'Organization', name: site.name },
        },
      },
    ],
  });
}

/* ───────────────────────────── Merken ───────────────────────────── */
export function brandsPage() {
  const body = `
  ${pageHead({ crumbs: [{ label: 'Merken', href: 'merken.html' }], title: 'Onze merken', lead: 'We werken alleen met merken waar we zelf achter staan. Ontdek wat elk merk uniek maakt.' })}
  <section class="section-sm">
    <div class="container">
      <div class="grid grid-3">
        ${brands
          .map((b) => {
            const n = products.filter((p) => p.brand === b.slug).length;
            const from = Math.min(...products.filter((p) => p.brand === b.slug).map((p) => p.price));
            return `
          <a class="brand-card reveal" style="--bc:${b.color}" href="${url(`merk/${b.slug}.html`)}">
            <span class="muted" style="font-size:.85rem;font-weight:700">${esc(b.tagline)}</span>
            <h3>${esc(b.name)}</h3>
            <p>${esc(b.about)}</p>
            <div class="chips">${b.strengths.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</div>
            <div class="foot"><span>${n} producten · vanaf ${money(from)}</span>${icon('arrow')}</div>
          </a>`;
          })
          .join('')}
      </div>
    </div>
  </section>
  <section class="section-sm"><div class="container">
    <div class="panel reveal" style="display:flex;gap:24px;align-items:center;flex-wrap:wrap;justify-content:space-between">
      <div><h2 style="font-size:1.6rem;margin:0 0 6px">Formuler, TVIP of MAG?</h2><p class="muted" style="margin:0">Lees onze eerlijke vergelijking van de drie populairste IPTV-merken.</p></div>
      <a class="btn btn-dark" href="${url('kennisbank/formuler-tvip-mag-vergelijking.html')}">Lees de vergelijking ${icon('arrow')}</a>
    </div>
  </div></section>`;
  return layout({ path: 'merken.html', title: 'Merken', description: 'Formuler, TVIP, Infomir MAG, NVIDIA, Xiaomi en meer. Ontdek alle merken bij Mediakoning.', active: 'merken.html', body });
}

/* ───────────────────────────── Vergelijken ───────────────────────────── */
export function comparePage() {
  const options = products.filter((p) => p.category !== 'accessoires').sort(byPop);
  const body = `
  ${pageHead({ crumbs: [{ label: 'Vergelijken', href: 'vergelijk.html' }], title: 'Vergelijk tot 3 boxen', lead: 'Zet modellen naast elkaar en zie direct de verschillen. Afwijkende specificaties worden gemarkeerd.' })}
  <section class="section-sm">
    <div class="container">
      <div class="panel" style="margin-bottom:24px;display:flex;gap:12px;flex-wrap:wrap;align-items:center">
        <label for="cmp-add" style="font-weight:700">Product toevoegen:</label>
        <select class="select" id="cmp-add" data-compare-select style="max-width:360px">
          <option value="">Kies een product…</option>
          ${options.map((p) => `<option value="${p.slug}">${esc(p.name)} — ${money(p.price)}</option>`).join('')}
        </select>
        <label class="check" style="margin-left:auto"><input type="checkbox" data-compare-diff> <span>Alleen verschillen tonen</span></label>
      </div>
      <div data-compare-root>
        <div class="no-results"><h3>Nog niets om te vergelijken</h3><p>Kies hierboven een product of klik op ${icon('compare', 'inline-ic')} bij een product in de shop.</p></div>
      </div>
      <div style="margin-top:24px;display:flex;gap:12px;flex-wrap:wrap">
        <a class="btn btn-ghost btn-sm" href="${url('vergelijk.html')}?ids=formuler-z11-pro-max,tvip-v-605,mag-544w3">Voorbeeld: Formuler vs TVIP vs MAG</a>
        <a class="btn btn-ghost btn-sm" href="${url('vergelijk.html')}?ids=nvidia-shield-tv-pro,google-tv-streamer,xiaomi-tv-box-s-2">Voorbeeld: beste mediaspelers</a>
      </div>
    </div>
  </section>`;
  return layout({ path: 'vergelijk.html', title: 'Vergelijken', description: 'Vergelijk IPTV-ontvangers en mediaspelers naast elkaar op specificaties en prijs.', active: 'vergelijk.html', body });
}

/* ───────────────────────────── Keuzehulp ───────────────────────────── */
export function quizPage() {
  const body = `
  ${pageHead({ crumbs: [{ label: 'Keuzehulp', href: 'keuzehulp.html' }], title: 'Welke box past bij jou?', lead: 'Vier vragen, dertig seconden. Daarna laten we zien welke ontvangers het best bij jouw kijkgedrag passen — met uitleg waarom.' })}
  <section class="section-sm">
    <div class="container">
      <div class="quiz" data-quiz>
        <div class="quiz-progress"><i data-quiz-bar style="width:0%"></i></div>
        <div data-quiz-stage><noscript><p>Schakel JavaScript in om de keuzehulp te gebruiken, of <a href="${waLink()}">vraag ons om advies via WhatsApp</a>.</p></noscript></div>
      </div>
    </div>
  </section>`;
  return layout({ path: 'keuzehulp.html', title: 'Keuzehulp', description: 'Beantwoord 4 korte vragen en ontdek welke IPTV-box of mediaspeler het beste bij jou past.', active: 'keuzehulp.html', body });
}

/* ───────────────────────────── Kennisbank ───────────────────────────── */
export function kbPage() {
  const cats = [...new Set(articles.map((a) => a.category))];
  const body = `
  ${pageHead({ crumbs: [{ label: 'Kennisbank', href: 'kennisbank.html' }], title: 'Kennisbank', lead: 'Heldere uitleg, eerlijke vergelijkingen en handleidingen. Alles wat je moet weten over IPTV en streamen.' })}
  <section class="section-sm">
    <div class="container">
      <div class="cat-tabs" style="margin:0 0 28px" data-kb-filter>
        <button class="chip" aria-pressed="true" data-kb="">Alles</button>
        ${cats.map((c) => `<button class="chip" aria-pressed="false" data-kb="${esc(c)}">${esc(c)}</button>`).join('')}
      </div>
      <div class="grid grid-3">${articles.map((a, i) => articleCard(a, i).replace('class="article-card', `data-kb-cat="${esc(a.category)}" class="article-card`)).join('')}</div>
    </div>
  </section>
  ${ctaQuiz()}`;
  return layout({ path: 'kennisbank.html', title: 'Kennisbank', description: 'Alles over IPTV, mediaspelers, installatie en storingen oplossen. Uitleg van de experts van Mediakoning.', active: 'kennisbank.html', body });
}

export function articlePage(a, i) {
  const headings = a.body.filter((b) => b.h).map((b) => b.h);
  const render = (b) => {
    if (typeof b === 'string') return `<p>${esc(b)}</p>`;
    if (b.h) return `<h2 id="${slugify(b.h)}">${esc(b.h)}</h2>`;
    if (b.ul) return `<ul>${b.ul.map((li) => `<li>${esc(li)}</li>`).join('')}</ul>`;
    if (b.tip) return `<aside class="tip">${icon('bulb')}<div><strong>Tip van Mediakoning</strong><br>${esc(b.tip)}</div></aside>`;
    if (b.product) {
      const p = withBrand(productBySlug(b.product));
      return `<div class="inline-product"><div class="thumb">${productArt(p, { label: false })}</div><div><span class="muted" style="font-size:.8rem;font-weight:700">AANRADER</span><strong>${esc(p.name)}</strong><span>${money(p.price)}</span></div><a class="btn btn-dark btn-sm" href="${url(`product/${p.slug}.html`)}">Bekijk ${icon('arrow')}</a></div>`;
    }
    return '';
  };
  const others = articles.filter((x) => x.slug !== a.slug).slice(0, 3);
  const crumbs = [{ label: 'Kennisbank', href: 'kennisbank.html' }, { label: a.title, href: `kennisbank/${a.slug}.html` }];
  const body = `
  ${pageHead({ crumbs, title: esc(a.title), lead: esc(a.excerpt), extra: `<p class="muted" style="margin-top:16px;font-weight:600;font-size:.9rem">${esc(a.category)} · ${a.minutes} min lezen · Bijgewerkt op ${dateNL(a.updated)}</p>` })}
  <section class="section-sm">
    <div class="container">
      <div class="article-layout">
        <article class="prose">
          <div style="border-radius:var(--radius-lg);overflow:hidden;margin-bottom:32px">${articleCover(i, a.title)}</div>
          ${a.body.map(render).join('')}
          <div class="panel" style="margin-top:48px">
            <h3>Nog vragen?</h3>
            <p class="muted">Ons team helpt je graag persoonlijk verder.</p>
            <div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn btn-whatsapp" href="${waLink(`Vraag n.a.v. "${a.title}":`)}" target="_blank" rel="noopener">${icon('whatsapp')} WhatsApp</a><a class="btn btn-ghost" href="${url('contact.html')}">Contact</a></div>
          </div>
        </article>
        <aside class="toc">
          <h4>In dit artikel</h4>
          <ol>${headings.map((h) => `<li><a href="#${slugify(h)}">${esc(h)}</a></li>`).join('')}</ol>
        </aside>
      </div>
    </div>
  </section>
  <section class="section-sm"><div class="container">
    ${sectionHead({ title: 'Lees ook' })}
    <div class="grid grid-3">${others.map((o) => articleCard(o, articles.indexOf(o))).join('')}</div>
  </div></section>`;
  return layout({
    path: `kennisbank/${a.slug}.html`,
    title: a.title,
    description: a.excerpt,
    active: 'kennisbank.html',
    body,
    jsonLd: [
      breadcrumbLd(crumbs),
      { '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.excerpt, dateModified: a.updated, author: { '@type': 'Organization', name: site.name }, publisher: { '@type': 'Organization', name: site.name } },
    ],
  });
}

/* ───────────────────────────── Over ons ───────────────────────────── */
export function aboutPage() {
  const body = `
  ${pageHead({ crumbs: [{ label: 'Over ons', href: 'over-ons.html' }], title: 'Wij zijn <span class="text-gradient">Mediakoning</span>', lead: 'Begonnen in Beverwijk met één doel: televisie via internet makkelijk maken voor iedereen. Inmiddels helpen we elke dag klanten in heel Nederland en België.' })}
  <section class="section-sm"><div class="container">
    <div class="stats">
      <div class="stat reveal"><strong>100+</strong><span>ontvangers & mediaspelers</span></div>
      ${site.rating ? `<div class="stat reveal"><strong>${String(site.rating.score).replace('.', ',')}</strong><span>gemiddelde beoordeling</span></div>
      <div class="stat reveal"><strong>${site.rating.count.toLocaleString('nl-NL')}+</strong><span>klantreviews</span></div>` : `<div class="stat reveal"><strong>${site.shipping.warrantyMonths}</strong><span>maanden garantie</span></div>
      <div class="stat reveal"><strong>${site.shipping.returnDays}</strong><span>dagen bedenktijd</span></div>`}
      <div class="stat reveal"><strong>3</strong><span>afhaalpunten</span></div>
    </div>
  </div></section>
  <section class="section"><div class="container split">
    <div class="reveal">
      <span class="eyebrow">Ons verhaal</span>
      <h2>Van hobby in Beverwijk naar specialist van Nederland</h2>
      <p class="lead">Wat begon als het helpen van vrienden en familie met hun tv-setup, groeide uit tot een webshop met een van de breedste assortimenten IPTV-ontvangers van de Benelux.</p>
      <p class="muted">Ons uitgangspunt is altijd hetzelfde gebleven: we verkopen alleen wat we zelf zouden gebruiken, we geven eerlijk advies — ook als dat betekent dat je de goedkoopste box nodig hebt — en we laten je niet in de steek na je aankoop.</p>
      <p class="muted">Mediakoning verkoopt uitsluitend hardware. We verkopen geen abonnementen en adviseren altijd om te kiezen voor een legale tv-dienst.</p>
    </div>
    <div class="panel reveal">
      <div class="timeline">
        <div><b>Het begin</b><h3>Opgericht in Beverwijk</h3><p>Een kleine voorraad en veel enthousiasme.</p></div>
        <div><b>Groei</b><h3>Showroom in Amsterdam</h3><p>Een eigen plek om boxen te demonstreren en klanten persoonlijk te helpen.</p></div>
        <div><b>Uitbreiding</b><h3>Afhaalpunten in Rotterdam & Amersfoort</h3><p>Samen met partners nog dichter bij onze klanten.</p></div>
        <div><b>Vandaag</b><h3>100+ modellen, duizenden tevreden klanten</h3><p>En we zijn nog lang niet klaar.</p></div>
      </div>
    </div>
  </div></section>
  <section class="section" style="padding-top:0"><div class="container">
    ${sectionHead({ eyebrow: 'Waar we voor staan', title: 'Onze beloftes' })}
    <div class="grid grid-3">
      <div class="feature reveal"><span class="ic">${icon('checkCircle')}</span><h3>Eerlijk advies</h3><p>We adviseren wat bij jou past, niet wat het meeste oplevert.</p></div>
      <div class="feature reveal"><span class="ic">${icon('bolt')}</span><h3>Snel & betrouwbaar</h3><p>Snelle verzending en altijd een duidelijke status van je bestelling.</p></div>
      <div class="feature reveal"><span class="ic">${icon('users')}</span><h3>Bereikbaar</h3><p>Echte mensen via WhatsApp, telefoon en e-mail — ook na je aankoop.</p></div>
    </div>
  </div></section>
  ${ctaQuiz()}`;
  return layout({ path: 'over-ons.html', title: 'Over ons', description: 'Het verhaal achter Mediakoning: specialist in IPTV-ontvangers en mediaspelers met showroom in Amsterdam.', body });
}

/* ───────────────────────────── Contact ───────────────────────────── */
export function contactPage() {
  const loc = site.locations;
  const mapsUrl = (l) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${l.street} ${l.zip} ${l.city}`)}`;
  const body = `
  ${pageHead({ crumbs: [{ label: 'Contact', href: 'contact.html' }], title: 'Hoe kunnen we helpen?', lead: 'Kies het kanaal dat jou het beste uitkomt. Via WhatsApp krijg je meestal het snelst antwoord.', extra: `<p style="margin-top:16px"><span class="open-now" data-open-now>Openingstijden laden…</span></p>` })}
  <section class="section-sm"><div class="container">
    <div class="contact-cards">
      <a class="contact-card wa reveal" href="${waLink()}" target="_blank" rel="noopener"><span class="ic">${icon('whatsapp')}</span><strong>WhatsApp</strong><span>Snelste antwoord — stuur gerust een foto of screenshot mee.</span></a>
      <a class="contact-card reveal" href="tel:${site.phone.replace(/\s/g, '')}"><span class="ic">${icon('phone')}</span><strong>${site.phoneDisplay}</strong><span>Bel ons tijdens openingstijden.</span></a>
      <a class="contact-card reveal" href="mailto:${site.supportEmail}"><span class="ic">${icon('mail')}</span><strong>${site.supportEmail}</strong><span>Voor support, retouren en garantie.</span></a>
    </div>
  </div></section>
  <section class="section-sm"><div class="container split">
    <div class="panel reveal">
      <h2 style="font-size:1.6rem">Stuur ons een bericht</h2>
      <p class="muted">We reageren binnen één werkdag.</p>
      <form class="form-grid" data-demo-form novalidate>
        <div class="field"><label for="c-name">Naam</label><input class="input" id="c-name" name="name" autocomplete="name" required></div>
        <div class="field"><label for="c-email">E-mailadres</label><input class="input" id="c-email" type="email" name="email" autocomplete="email" required></div>
        <div class="field"><label for="c-order">Ordernummer <small>(optioneel)</small></label><input class="input" id="c-order" name="order"></div>
        <div class="field"><label for="c-topic">Onderwerp</label><select class="select" id="c-topic" name="topic"><option>Advies over een product</option><option>Mijn bestelling</option><option>Retour of garantie</option><option>Afspraak showroom</option><option>Zakelijk / reseller</option><option>Anders</option></select></div>
        <div class="field full"><label for="c-msg">Bericht</label><textarea class="textarea" id="c-msg" name="message" required></textarea></div>
        <label class="check full"><input type="checkbox" required> <span>Ik ga akkoord met de verwerking van mijn gegevens volgens de <a href="${url('privacy.html')}" style="text-decoration:underline">privacyverklaring</a>.</span></label>
        <div class="full"><button class="btn btn-primary btn-lg" type="submit">Verstuur bericht ${icon('arrow')}</button></div>
        <div class="form-success full">${icon('checkCircle')}<h3>Bedankt voor je bericht!</h3><p class="muted">We nemen binnen één werkdag contact met je op.</p></div>
      </form>
    </div>
    <div class="panel reveal">
      <h2 style="font-size:1.4rem">Openingstijden</h2>
      <ul class="hours" data-hours>${site.hours.map((h, i) => `<li data-day="${i}"><span>${h.day}</span><strong>${h.time}</strong></li>`).join('')}</ul>
      <p class="muted" style="margin-top:16px;font-size:.92rem">${icon('info', 'inline-ic')} Bezoek aan de showroom en afhalen is uitsluitend <strong>op afspraak</strong>. Plan je bezoek via WhatsApp of telefoon.</p>
      <a class="btn btn-dark btn-block" href="${waLink('Hoi! Ik wil graag een afspraak maken voor de showroom.')}" target="_blank" rel="noopener">Afspraak maken</a>
    </div>
  </div></section>
  <section class="section-sm" id="locaties"><div class="container">
    ${sectionHead({ eyebrow: 'Locaties', title: 'Showroom & afhaalpunten' })}
    <div class="grid grid-3">
      ${loc
        .map(
          (l, i) => `
        <div class="location reveal">
          <div class="map">${mapArt(i + 1)}</div>
          <span class="badge${i === 0 ? ' badge-brand' : ''}" style="justify-self:start">${esc(l.type)}</span>
          <h3>${esc(l.city)}</h3>
          <address>${esc(l.street)}<br>${esc(l.zip)} ${esc(l.city)}</address>
          <p class="muted" style="margin:0;font-size:.92rem">${esc(l.note)}</p>
          <a class="btn btn-ghost btn-sm" style="justify-self:start" href="${mapsUrl(l)}" target="_blank" rel="noopener">${icon('pin')} Routebeschrijving</a>
        </div>`,
        )
        .join('')}
    </div>
  </div></section>`;
  return layout({ path: 'contact.html', title: 'Contact', description: `Neem contact op met ${site.name} via WhatsApp, telefoon of e-mail. Showroom in Amsterdam, afhaalpunten in Rotterdam en Amersfoort.`, body });
}

/* ───────────────────────────── Klantenservice ───────────────────────────── */
export function servicePage() {
  const body = `
  ${pageHead({
    crumbs: [{ label: 'Klantenservice', href: 'klantenservice.html' }],
    title: 'Klantenservice',
    lead: 'Vind direct antwoord op je vraag of neem contact met ons op.',
    extra: `<div class="faq-search">${icon('search')}<label class="sr-only" for="faq-q">Zoek in veelgestelde vragen</label><input class="input" id="faq-q" type="search" placeholder="Bijv. retourneren, verzendkosten, afhalen…" data-faq-search></div>`,
  })}
  <section class="section-sm"><div class="container">
    <div class="grid grid-4" style="margin-bottom:48px">
      <a class="contact-card reveal" href="#bestelstatus"><span class="ic">${icon('truck')}</span><strong>Bestelstatus</strong><span>Waar is mijn pakket?</span></a>
      <a class="contact-card reveal" href="#retour-garantie"><span class="ic">${icon('return')}</span><strong>Retourneren</strong><span>${site.shipping.returnDays} dagen bedenktijd</span></a>
      <a class="contact-card reveal" href="#retour-garantie"><span class="ic">${icon('shield')}</span><strong>Garantie</strong><span>${site.shipping.warrantyMonths} maanden op alle boxen</span></a>
      <a class="contact-card reveal" href="${url('kennisbank/box-installeren.html')}"><span class="ic">${icon('bulb')}</span><strong>Installatiehulp</strong><span>Stap-voor-stap uitleg</span></a>
    </div>
    <div class="faq-layout">
      <nav class="faq-nav" aria-label="Onderwerpen">${faq.map((g) => `<a href="#${slugify(g.group)}">${esc(g.group)}</a>`).join('')}<a href="#bestelstatus">Bestelstatus</a></nav>
      <div>
        ${faq.map((g) => `<div class="faq-group" id="${slugify(g.group)}" data-faq-group><h2>${esc(g.group)}</h2>${faqAccordion(g.items)}</div>`).join('')}
        <p class="no-results" data-faq-empty hidden>Geen antwoord gevonden. <a href="${url('contact.html')}" style="color:var(--brand);font-weight:700">Stel je vraag aan ons team</a>.</p>
        <div class="panel" id="bestelstatus">
          <h2 style="font-size:1.4rem">Bestelstatus opvragen</h2>
          <p class="muted">Vul je ordernummer en postcode in. Je ontvangt de actuele status en track & trace per e-mail.</p>
          <form class="form-grid" data-demo-form novalidate>
            <div class="field"><label for="o-nr">Ordernummer</label><input class="input" id="o-nr" name="order" placeholder="MK-12345" required></div>
            <div class="field"><label for="o-zip">Postcode</label><input class="input" id="o-zip" name="zip" placeholder="1013 BG" autocomplete="postal-code" required></div>
            <div class="full"><button class="btn btn-primary" type="submit">Status opvragen</button></div>
            <div class="form-success full">${icon('checkCircle')}<h3>Aanvraag ontvangen</h3><p class="muted">Je ontvangt binnen enkele minuten een e-mail met de status van je bestelling.</p></div>
          </form>
        </div>
      </div>
    </div>
  </div></section>`;
  return layout({
    path: 'klantenservice.html',
    title: 'Klantenservice',
    description: 'Antwoord op al je vragen over bestellen, verzending, afhalen, retourneren en garantie bij Mediakoning.',
    body,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.flatMap((g) => g.items).map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  });
}

/* ───────────────────────────── Reseller ───────────────────────────── */
export function resellerPage() {
  const tiers = [
    { name: 'Starter', amount: 'vanaf 5 stuks', items: ['Staffelkorting op het hele assortiment', 'Bestellen via je eigen zakelijke account', 'Factuur met btw-verlegging (EU)'] },
    { name: 'Partner', amount: 'vanaf 25 stuks', featured: true, items: ['Alles van Starter', 'Hogere staffelkorting', 'Vaste accountmanager via WhatsApp', 'Voorrang bij nieuwe modellen'] },
    { name: 'Distributeur', amount: 'vanaf 100 stuks', items: ['Alles van Partner', 'Projectprijzen op maat', 'White-label snelstartgidsen', 'Dropshipping mogelijk'] },
  ];
  const body = `
  ${pageHead({ crumbs: [{ label: 'Zakelijk', href: 'reseller.html' }], title: 'Reseller worden', lead: 'Verkoop je zelf ontvangers of installeer je ze voor klanten? Profiteer van zakelijke prijzen, snelle levering en persoonlijke ondersteuning.' })}
  <section class="section-sm"><div class="container">
    <div class="grid grid-3">
      ${tiers
        .map(
          (t) => `<div class="tier reveal${t.featured ? ' featured' : ''}"><h3>${t.name}</h3><div class="amount">${t.amount}</div><ul>${t.items.map((i) => `<li>${icon('check')}<span>${i}</span></li>`).join('')}</ul><a class="btn ${t.featured ? 'btn-primary' : 'btn-ghost'}" href="#aanmelden">Aanmelden</a></div>`,
        )
        .join('')}
    </div>
  </div></section>
  <section class="section-sm" id="aanmelden"><div class="container split">
    <div class="panel reveal">
      <h2 style="font-size:1.6rem">Aanmelden als reseller</h2>
      <p class="muted">We nemen binnen twee werkdagen contact met je op met een voorstel op maat.</p>
      <form class="form-grid" data-demo-form novalidate>
        <div class="field"><label for="r-company">Bedrijfsnaam</label><input class="input" id="r-company" name="company" autocomplete="organization" required></div>
        <div class="field"><label for="r-kvk">KvK-nummer</label><input class="input" id="r-kvk" name="kvk" inputmode="numeric" required></div>
        <div class="field"><label for="r-name">Contactpersoon</label><input class="input" id="r-name" name="name" autocomplete="name" required></div>
        <div class="field"><label for="r-email">E-mailadres</label><input class="input" id="r-email" type="email" name="email" autocomplete="email" required></div>
        <div class="field"><label for="r-phone">Telefoon</label><input class="input" id="r-phone" type="tel" name="phone" autocomplete="tel"></div>
        <div class="field"><label for="r-vol">Verwacht volume per maand</label><select class="select" id="r-vol" name="volume"><option>5 – 25 stuks</option><option>25 – 100 stuks</option><option>100+ stuks</option></select></div>
        <div class="field full"><label for="r-msg">Vertel iets over je bedrijf</label><textarea class="textarea" id="r-msg" name="message"></textarea></div>
        <div class="full"><button class="btn btn-primary btn-lg" type="submit">Aanvraag versturen ${icon('arrow')}</button></div>
        <div class="form-success full">${icon('checkCircle')}<h3>Aanvraag ontvangen!</h3><p class="muted">We nemen binnen twee werkdagen contact met je op.</p></div>
      </form>
    </div>
    <div class="grid" style="gap:16px">
      <div class="feature reveal"><span class="ic">${icon('euro')}</span><h3>Scherpe marges</h3><p>Staffelkortingen die meegroeien met je volume.</p></div>
      <div class="feature reveal"><span class="ic">${icon('truck')}</span><h3>Snel geleverd</h3><p>Grote voorraad in Nederland, dus geen wekenlange levertijden.</p></div>
      <div class="feature reveal"><span class="ic">${icon('users')}</span><h3>Eén aanspreekpunt</h3><p>Een vaste contactpersoon die je bedrijf kent.</p></div>
    </div>
  </div></section>`;
  return layout({ path: 'reseller.html', title: 'Reseller worden', description: 'Zakelijk inkopen bij Mediakoning: staffelkortingen, snelle levering en een vaste accountmanager.', active: 'reseller.html', body });
}

/* ───────────────────────────── Winkelwagen & afrekenen ───────────────────────────── */
export function cartPage() {
  const body = `
  ${pageHead({ crumbs: [{ label: 'Winkelwagen', href: 'winkelwagen.html' }], title: 'Winkelwagen' })}
  <section class="section-sm"><div class="container checkout">
    <div>
      <div class="cart-table" data-cart-page></div>
      <div style="margin-top:24px"><a class="btn btn-ghost btn-sm" href="${url('shop.html')}">${icon('arrowLeft')} Verder winkelen</a></div>
    </div>
    <aside class="panel">
      <h2 style="font-size:1.3rem">Overzicht</h2>
      <div data-cart-summary></div>
      <div class="coupon" style="margin:16px 0">
        <label class="sr-only" for="coupon">Kortingscode</label>
        <input class="input" id="coupon" placeholder="Kortingscode" data-coupon-input>
        <button class="btn btn-ghost btn-sm" data-coupon-apply>Toepassen</button>
      </div>
      <a class="btn btn-primary btn-lg btn-block" href="${url('afrekenen.html')}" data-checkout-link>Veilig afrekenen ${icon('arrow')}</a>
      <p class="muted" style="font-size:.85rem;margin-top:12px;text-align:center">${site.payments.join(' · ')}</p>
    </aside>
  </div></section>`;
  return layout({ path: 'winkelwagen.html', title: 'Winkelwagen', body, noindex: true });
}

export function checkoutPage() {
  const body = `
  ${pageHead({ crumbs: [{ label: 'Winkelwagen', href: 'winkelwagen.html' }, { label: 'Afrekenen', href: 'afrekenen.html' }], title: 'Afrekenen' })}
  <section class="section-sm"><div class="container checkout" data-checkout>
    <div>
      <ol class="stepper" data-stepper><li class="on"><span>Gegevens</span></li><li><span>Bezorging</span></li><li><span>Betalen</span></li></ol>
      <form data-checkout-form novalidate>
        <fieldset class="panel" data-step="0" style="border:1px solid var(--line)">
          <legend class="sr-only">Gegevens</legend>
          <h2 style="font-size:1.3rem">Jouw gegevens</h2>
          <div class="form-grid">
            <div class="field"><label for="co-fn">Voornaam</label><input class="input" id="co-fn" autocomplete="given-name" required></div>
            <div class="field"><label for="co-ln">Achternaam</label><input class="input" id="co-ln" autocomplete="family-name" required></div>
            <div class="field full"><label for="co-em">E-mailadres</label><input class="input" id="co-em" type="email" autocomplete="email" required><small>Hier sturen we je orderbevestiging en track & trace naartoe.</small></div>
            <div class="field"><label for="co-zip">Postcode</label><input class="input" id="co-zip" autocomplete="postal-code" placeholder="1234 AB" required></div>
            <div class="field"><label for="co-nr">Huisnummer</label><input class="input" id="co-nr" required></div>
            <div class="field full"><label for="co-st">Straat en plaats</label><input class="input" id="co-st" autocomplete="street-address" required></div>
            <div class="field full"><label for="co-ph">Telefoon <small>(optioneel, voor de bezorger)</small></label><input class="input" id="co-ph" type="tel" autocomplete="tel"></div>
          </div>
          <div style="margin-top:20px"><button class="btn btn-primary btn-lg" type="button" data-next>Verder naar bezorging ${icon('arrow')}</button></div>
        </fieldset>
        <fieldset class="panel" data-step="1" hidden style="border:1px solid var(--line)">
          <legend class="sr-only">Bezorging</legend>
          <h2 style="font-size:1.3rem">Hoe wil je je bestelling ontvangen?</h2>
          <div class="option-cards">
            <label class="option-card"><input type="radio" name="ship" value="home" checked><span class="grow"><strong>Thuisbezorgd</strong><small>Voor ${site.shipping.cutoff} besteld, vandaag verzonden</small></span><span data-ship-cost>—</span></label>
            ${site.locations.map((l) => `<label class="option-card"><input type="radio" name="ship" value="pickup-${l.id}"><span class="grow"><strong>Afhalen in ${l.city}</strong><small>${esc(l.street)} · op afspraak</small></span><span>Gratis</span></label>`).join('')}
          </div>
          <div style="margin-top:20px;display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-ghost" type="button" data-prev>${icon('arrowLeft')} Terug</button><button class="btn btn-primary btn-lg" type="button" data-next>Verder naar betalen ${icon('arrow')}</button></div>
        </fieldset>
        <fieldset class="panel" data-step="2" hidden style="border:1px solid var(--line)">
          <legend class="sr-only">Betalen</legend>
          <h2 style="font-size:1.3rem">Kies je betaalmethode</h2>
          <div class="option-cards">
            ${site.payments.map((m, i) => `<label class="option-card"><input type="radio" name="pay" value="${m}"${i === 0 ? ' checked' : ''}><span class="grow"><strong>${m}</strong>${m === 'Klarna' ? '<small>Achteraf betalen binnen 30 dagen</small>' : ''}</span></label>`).join('')}
          </div>
          <p class="muted" style="font-size:.88rem;margin-top:14px">${icon('shield', 'inline-ic')} Je wordt doorgestuurd naar de beveiligde omgeving van de betaalprovider. Wij slaan geen betaalgegevens op.</p>
          <label class="check" style="margin:16px 0"><input type="checkbox" required data-terms> <span>Ik ga akkoord met de <a href="${url('voorwaarden.html')}" style="text-decoration:underline">algemene voorwaarden</a>.</span></label>
          <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-ghost" type="button" data-prev>${icon('arrowLeft')} Terug</button><button class="btn btn-primary btn-lg" type="submit">Bestelling plaatsen ${icon('arrow')}</button></div>
        </fieldset>
      </form>
      <div class="panel" data-checkout-done hidden style="text-align:center">
        <div style="color:var(--success);width:72px;margin:0 auto 16px">${icon('checkCircle')}</div>
        <h2>Bedankt voor je bestelling!</h2>
        <p class="lead" style="margin-inline:auto">Je ordernummer is <strong data-order-nr></strong>. Je ontvangt een bevestiging per e-mail.</p>
        <p class="muted">Demo-omgeving: er is geen echte bestelling geplaatst.</p>
        <a class="btn btn-primary" href="${url('index.html')}">Terug naar de homepage</a>
      </div>
    </div>
    <aside class="panel"><h2 style="font-size:1.3rem">Je bestelling</h2><div data-checkout-items class="cart-items" style="margin-bottom:16px"></div><div data-cart-summary></div></aside>
  </div></section>`;
  return layout({ path: 'afrekenen.html', title: 'Afrekenen', body, noindex: true });
}

export function favoritesPage() {
  const body = `
  ${pageHead({ crumbs: [{ label: 'Favorieten', href: 'favorieten.html' }], title: 'Je favorieten', lead: 'Producten die je hebt bewaard. Ze blijven op dit apparaat staan, ook als je later terugkomt.' })}
  <section class="section-sm"><div class="container">
    <div class="product-grid" data-favorites></div>
  </div></section>`;
  return layout({ path: 'favorieten.html', title: 'Favorieten', body, noindex: true });
}

/* ───────────────────────────── Juridisch & 404 ───────────────────────────── */
export function legalPage(kind) {
  const isTerms = kind === 'voorwaarden';
  const sections = isTerms
    ? [
        ['Toepasselijkheid', 'Deze voorwaarden zijn van toepassing op elk aanbod van en elke overeenkomst met ' + site.name + '.'],
        ['Aanbod en prijzen', 'Alle prijzen zijn in euro’s en inclusief btw. Kennelijke vergissingen in het aanbod binden ons niet.'],
        ['Herroepingsrecht', `Je hebt ${site.shipping.returnDays} dagen bedenktijd na ontvangst van het product.`],
        ['Levering', 'We doen ons best bestellingen zo snel mogelijk te leveren. Levertijden zijn indicatief.'],
        ['Garantie', `Op ontvangers en mediaspelers geldt ${site.shipping.warrantyMonths} maanden garantie, naast je wettelijke rechten.`],
        ['Gebruik', 'Producten van ' + site.name + ' zijn bedoeld voor legaal gebruik. Wij verkopen geen abonnementen of toegang tot content.'],
      ]
    : [
        ['Welke gegevens', 'We verwerken alleen gegevens die nodig zijn om je bestelling te verwerken en je vragen te beantwoorden.'],
        ['Waarom', 'Voor het uitvoeren van de overeenkomst, klantenservice en — alleen met je toestemming — onze nieuwsbrief.'],
        ['Bewaartermijn', 'We bewaren gegevens niet langer dan nodig of wettelijk verplicht.'],
        ['Cookies', 'Deze site gebruikt alleen functionele opslag in je browser (winkelwagen, favorieten, thema). Geen tracking-cookies.'],
        ['Je rechten', 'Je kunt je gegevens altijd inzien, laten aanpassen of verwijderen via ' + site.email + '.'],
      ];
  const title = isTerms ? 'Algemene voorwaarden' : 'Privacy & cookies';
  const body = `
  ${pageHead({ crumbs: [{ label: title, href: `${kind}.html` }], title, lead: 'Concepttekst — laat deze pagina juridisch controleren en aanvullen voordat de site live gaat.' })}
  <section class="section-sm"><div class="container" style="max-width:820px"><div class="prose">
    ${sections.map(([h, t], i) => `<h2 id="art-${i + 1}">Artikel ${i + 1} — ${esc(h)}</h2><p>${esc(t)}</p>`).join('')}
  </div></div></section>`;
  return layout({ path: `${kind}.html`, title, body });
}

export function notFoundPage() {
  const body = `
  <section class="section"><div class="container not-found"><div>
    <div class="code text-gradient">404</div>
    <h1 style="font-size:2rem">Geen signaal op dit kanaal</h1>
    <p class="lead" style="margin-inline:auto">De pagina die je zoekt bestaat niet (meer). Zoek verder of ga terug naar de homepage.</p>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap"><a class="btn btn-primary" href="${url('index.html')}">Naar home</a><button class="btn btn-ghost" data-search>${icon('search')} Zoeken</button></div>
  </div></div></section>`;
  return layout({ path: '404.html', title: 'Pagina niet gevonden', body, noindex: true });
}
