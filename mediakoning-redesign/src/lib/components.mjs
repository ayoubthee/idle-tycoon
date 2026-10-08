import { site, categories } from '../data/site.mjs';
import { products, brands } from '../data/products.mjs';
import { icon } from './icons.mjs';
import { productArt, articleCover } from './illustrations.mjs';
import { esc, url, money, fill } from './util.mjs';

export const brandOf = (slug) => brands.find((b) => b.slug === slug);
export const catOf = (slug) => categories.find((c) => c.slug === slug);
export const productBySlug = (slug) => products.find((p) => p.slug === slug);
export const withBrand = (p) => ({ ...p, brandName: brandOf(p.brand)?.name ?? '' });

export function specTags(p) {
  if (p.category === 'accessoires') return [p.compat];
  return [p.os, p.resolution, p.ram && `${p.ram} RAM`].filter(Boolean);
}

export function badgeHtml(p) {
  const out = [];
  if (p.oldPrice) out.push(`<span class="badge badge-sale">−${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>`);
  for (const b of p.badges ?? []) {
    const cls = b === 'Bestseller' || b === 'Topkeuze' ? 'badge-gold' : b === 'Nieuw' ? 'badge-brand' : '';
    out.push(`<span class="badge ${cls}">${esc(b)}</span>`);
  }
  return out.join('');
}

export function productCard(raw, { reveal = true } = {}) {
  const p = withBrand(raw);
  return `
  <article class="product-card${reveal ? ' reveal' : ''}" data-product="${p.slug}" data-brand="${p.brand}" data-cat="${p.category}" data-os="${esc(p.os)}" data-price="${p.price}" data-pop="${p.popularity}" data-name="${esc(p.name.toLowerCase())}" data-res="${esc(p.resolution ?? '')}">
    <div class="media">
      ${productArt(p)}
      <div class="badges">${badgeHtml(p)}</div>
    </div>
    <div class="tools">
      <button class="tool-btn fav" data-fav="${p.slug}" aria-pressed="false" aria-label="Bewaar ${esc(p.name)} als favoriet">${icon('heart')}</button>
      ${p.category !== 'accessoires' ? `<button class="tool-btn" data-compare="${p.slug}" aria-pressed="false" aria-label="Vergelijk ${esc(p.name)}">${icon('compare')}</button>` : ''}
    </div>
    <div class="body">
      <span class="brand">${esc(p.brandName)}</span>
      <h3><a href="${url(`product/${p.slug}.html`)}">${esc(p.name)}</a></h3>
      <ul class="specs-mini">${specTags(p).map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      <span class="stock${p.stock === 'low' ? ' low' : ''}">${p.stock === 'low' ? 'Nog enkele op voorraad' : 'Op voorraad'}</span>
      <div class="buy">
        <div class="price-tag"><strong>${money(p.price)}</strong>${p.oldPrice ? `<s>${money(p.oldPrice)}</s>` : ''}</div>
        <button class="add-btn" data-add="${p.slug}" aria-label="${esc(p.name)} in winkelwagen">${icon('plus')}</button>
      </div>
    </div>
  </article>`;
}

export function sectionHead({ eyebrow, title, text = '', action = '' }) {
  return `
  <div class="section-head reveal">
    <div>
      ${eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ''}
      <h2>${title}</h2>
      ${text ? `<p>${text}</p>` : ''}
    </div>
    ${action}
  </div>`;
}

export function uspStrip() {
  const s = site.shipping;
  const items = [
    ['truck', 'Snel in huis', `Voor ${s.cutoff} besteld, vandaag verzonden`],
    ['store', 'Afhalen op afspraak', 'Amsterdam · Rotterdam · Amersfoort'],
    ['chat', 'Echte experts', 'Advies via WhatsApp, telefoon & mail'],
    ['shield', `${s.warrantyMonths} maanden garantie`, `${s.returnDays} dagen bedenktijd`],
  ];
  return `
  <section class="usp-strip" aria-label="Onze beloftes">
    <div class="container">
      ${items.map(([ic, t, d]) => `<div class="usp"><span class="ic">${icon(ic)}</span><div><strong>${t}</strong><span>${d}</span></div></div>`).join('')}
    </div>
  </section>`;
}

export function catCard(cat) {
  const count = products.filter((p) => p.category === cat.slug).length;
  const hero = withBrand(products.find((p) => p.category === cat.slug && p.badges?.length) ?? products.find((p) => p.category === cat.slug));
  return `
  <a class="cat-card reveal" href="${url(`categorie/${cat.slug}.html`)}">
    <span class="count">${count} producten</span>
    <div>
      <h3>${esc(cat.name)}</h3>
      <p>${esc(cat.intro)}</p>
    </div>
    <div class="art">${productArt(hero)}</div>
    <span class="go">Bekijk ${esc(cat.short.toLowerCase())} ${icon('arrow')}</span>
  </a>`;
}

export function brandTile(b) {
  const n = products.filter((p) => p.brand === b.slug).length;
  return `<a class="brand-tile" style="--bc:${b.color}" href="${url(`merk/${b.slug}.html`)}"><span><span class="brand-dot" style="--bc:${b.color}"></span>${esc(b.name)}<small>${n} producten</small></span></a>`;
}

export function articleCard(a, i) {
  return `
  <a class="article-card reveal" href="${url(`kennisbank/${a.slug}.html`)}">
    <div class="cover">${articleCover(i, a.title)}</div>
    <div class="body">
      <span class="badge" style="align-self:start">${esc(a.category)}</span>
      <h3>${esc(a.title)}</h3>
      <p>${esc(a.excerpt)}</p>
      <div class="meta"><span>${icon('clock', 'inline-ic')} ${a.minutes} min lezen</span></div>
    </div>
  </a>`;
}

export function faqAccordion(items) {
  return `<div class="acc">${items
    .map(
      (f) => `<details data-faq="${esc((f.q + ' ' + f.a).toLowerCase())}"><summary>${esc(f.q)}</summary><div>${esc(fill(f.a, { ...site.shipping, freeFrom: site.shipping.freeFrom, cost: String(site.shipping.cost).replace('.', ',') }))}</div></details>`,
    )
    .join('')}</div>`;
}

export function ctaQuiz() {
  return `
  <section class="section-sm">
    <div class="container">
      <div class="cta-banner reveal">
        <div>
          <span class="eyebrow" style="color:#c9c1ff">Keuzehulp</span>
          <h2>Twijfel je? Binnen 30 seconden weet je welke box bij je past.</h2>
          <p>Vier korte vragen over hoe jij tv kijkt. Wij rekenen uit welke ontvanger het beste bij je past — eerlijk, ook als dat de goedkoopste is.</p>
          <div class="btns">
            <a class="btn btn-primary btn-lg" href="${url('keuzehulp.html')}">Start de keuzehulp ${icon('arrow')}</a>
            <a class="btn btn-ghost btn-lg" href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener">${icon('whatsapp')} Liever even appen?</a>
          </div>
        </div>
        <div class="quiz-preview" aria-hidden="true">
          <div class="opt">${'<i></i>'} Ik kijk vooral live-tv</div>
          <div class="opt on"><i></i> Live-tv én Netflix / YouTube</div>
          <div class="opt"><i></i> Vooral films & series</div>
          <div class="opt"><i></i> Ik wil alles, het beste van het beste</div>
        </div>
      </div>
    </div>
  </section>`;
}
