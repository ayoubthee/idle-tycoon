// Bouwt de volledige statische site naar ./dist
// Gebruik: node build.mjs
import { mkdir, writeFile, copyFile, rm, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { site, categories } from './src/data/site.mjs';
import { products, brands } from './src/data/products.mjs';
import { articles, faq } from './src/data/content.mjs';
import { setBase, url } from './src/lib/util.mjs';
import { productArt } from './src/lib/illustrations.mjs';
import { withBrand, specTags, catOf } from './src/lib/components.mjs';
import * as P from './src/pages.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, 'dist');
const pages = [];

async function emit(path, render) {
  const depth = path.split('/').length - 1;
  setBase('../'.repeat(depth));
  const html = render();
  const file = join(out, path);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
  pages.push(path);
}

async function copyDir(from, to) {
  await mkdir(to, { recursive: true });
  for (const entry of await readdir(from, { withFileTypes: true })) {
    const s = join(from, entry.name);
    const d = join(to, entry.name);
    if (entry.isDirectory()) await copyDir(s, d);
    else await copyFile(s, d);
  }
}

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

// ── Pagina's ──
await emit('index.html', P.home);
await emit('shop.html', () =>
  P.shop({
    path: 'shop.html',
    title: 'Alle producten',
    lead: 'IPTV-ontvangers, mediaspelers en accessoires van de beste merken. Filter op merk, systeem en prijs.',
    crumbs: [{ label: 'Shop', href: 'shop.html' }],
    list: products,
  }),
);
for (const c of categories) {
  await emit(`categorie/${c.slug}.html`, () =>
    P.shop({
      path: `categorie/${c.slug}.html`,
      title: c.name,
      lead: c.intro,
      crumbs: [{ label: 'Shop', href: 'shop.html' }, { label: c.name, href: `categorie/${c.slug}.html` }],
      list: products.filter((p) => p.category === c.slug),
    }),
  );
}
await emit('merken.html', P.brandsPage);
for (const b of brands) {
  const list = products.filter((p) => p.brand === b.slug);
  if (!list.length) continue;
  await emit(`merk/${b.slug}.html`, () =>
    P.shop({
      path: `merk/${b.slug}.html`,
      title: b.name,
      lead: b.about,
      crumbs: [{ label: 'Merken', href: 'merken.html' }, { label: b.name, href: `merk/${b.slug}.html` }],
      list,
      tabs: false,
    }),
  );
}
for (const p of products) await emit(`product/${p.slug}.html`, () => P.product(p));
await emit('vergelijk.html', P.comparePage);
await emit('keuzehulp.html', P.quizPage);
await emit('kennisbank.html', P.kbPage);
for (const [i, a] of articles.entries()) await emit(`kennisbank/${a.slug}.html`, () => P.articlePage(a, i));
await emit('over-ons.html', P.aboutPage);
await emit('contact.html', P.contactPage);
await emit('klantenservice.html', P.servicePage);
await emit('reseller.html', P.resellerPage);
await emit('winkelwagen.html', P.cartPage);
await emit('afrekenen.html', P.checkoutPage);
await emit('favorieten.html', P.favoritesPage);
await emit('voorwaarden.html', () => P.legalPage('voorwaarden'));
await emit('privacy.html', () => P.legalPage('privacy'));
await emit('404.html', P.notFoundPage);

// ── Client-catalogus (voor winkelwagen, zoeken, vergelijken en keuzehulp) ──
setBase('');
const catalog = {
  shipping: site.shipping,
  whatsapp: site.whatsapp,
  hours: site.hours,
  products: products.map((raw) => {
    const p = withBrand(raw);
    return {
      slug: p.slug,
      name: p.name,
      brand: p.brandName,
      brandSlug: p.brand,
      category: p.category,
      categoryName: catOf(p.category).name,
      price: p.price,
      oldPrice: p.oldPrice ?? null,
      os: p.os,
      tags: specTags(p),
      stock: p.stock,
      popularity: p.popularity,
      summary: p.summary,
      highlights: p.highlights,
      fit: p.fit,
      specs: {
        Prijs: p.price,
        Besturingssysteem: p.osVersion,
        Resolutie: p.resolution,
        Processor: p.chipset,
        Werkgeheugen: p.ram,
        Opslag: p.storage,
        Wifi: p.wifi,
        Bluetooth: p.bluetooth,
        Netwerk: p.lan,
        USB: p.usb,
        'Beeld & geluid': p.codecs,
      },
      url: `product/${p.slug}.html`,
      art: productArt(p, { label: false }),
    };
  }),
  articles: articles.map((a) => ({ title: a.title, excerpt: a.excerpt, category: a.category, url: `kennisbank/${a.slug}.html` })),
  faq: faq.flatMap((g) => g.items.map((f) => ({ q: f.q, group: g.group }))),
  pages: [
    { title: 'Keuzehulp', url: 'keuzehulp.html', kw: 'advies welke box kiezen hulp quiz' },
    { title: 'Vergelijken', url: 'vergelijk.html', kw: 'vergelijk verschil naast elkaar' },
    { title: 'Klantenservice', url: 'klantenservice.html', kw: 'faq vragen retour garantie verzending bestelstatus' },
    { title: 'Contact & openingstijden', url: 'contact.html', kw: 'bellen whatsapp mail adres openingstijden showroom afhalen' },
    { title: 'Reseller worden', url: 'reseller.html', kw: 'zakelijk b2b wederverkoper groothandel' },
    { title: 'Over ons', url: 'over-ons.html', kw: 'bedrijf verhaal wie' },
    { title: 'Alle merken', url: 'merken.html', kw: 'merken formuler tvip mag' },
  ],
};
await mkdir(join(out, 'assets/js'), { recursive: true });
await writeFile(join(out, 'assets/js/catalog.js'), `window.MK=${JSON.stringify(catalog)};`);

// ── Statische assets ──
await copyDir(join(root, 'src/assets'), join(out, 'assets'));

await writeFile(
  join(out, 'favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4f3cff"/><stop offset="1" stop-color="#d14dff"/></linearGradient></defs><rect width="32" height="32" rx="9" fill="url(#g)"/><path fill="#fff" d="M7.4 12a1 1 0 0 1 1.6-.9l3 2.6 3.2-4.9a1 1 0 0 1 1.6 0l3.2 4.9 3-2.6a1 1 0 0 1 1.6.9l-1.4 8.3a1 1 0 0 1-1 .8H9.8a1 1 0 0 1-1-.8Z"/><rect x="9" y="22.5" width="14" height="2" rx="1" fill="#fff" opacity=".75"/></svg>`,
);
await writeFile(
  join(out, 'manifest.webmanifest'),
  JSON.stringify({ name: site.name, short_name: site.name, start_url: './', display: 'standalone', background_color: '#f6f7fb', theme_color: '#4f3cff', icons: [{ src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml' }] }, null, 2),
);
const noindex = new Set(['winkelwagen.html', 'afrekenen.html', 'favorieten.html', '404.html']);
await writeFile(
  join(out, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .filter((p) => !noindex.has(p))
    .map((p) => `  <url><loc>${site.domain}/${p === 'index.html' ? '' : p}</loc></url>`)
    .join('\n')}\n</urlset>\n`,
);
await writeFile(join(out, 'robots.txt'), `User-agent: *\nDisallow: /winkelwagen.html\nDisallow: /afrekenen.html\nSitemap: ${site.domain}/sitemap.xml\n`);

console.log(`✓ ${pages.length} pagina's gebouwd in dist/`);
void url;
