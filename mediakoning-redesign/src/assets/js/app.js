/* Mediakoning — client-side interactie. Geen framework, geen afhankelijkheden. */
(() => {
  'use strict';

  const MK = window.MK || { products: [], articles: [], faq: [], pages: [], shipping: {} };
  const BASE = document.documentElement.dataset.base || '';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);
  const money = (n) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n);
  const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const bySlug = Object.fromEntries(MK.products.map((p) => [p.slug, p]));
  const SHIP = MK.shipping;

  const store = {
    get(k, d) {
      try {
        const v = JSON.parse(localStorage.getItem(k));
        return v ?? d;
      } catch {
        return d;
      }
    },
    set(k, v) {
      try {
        localStorage.setItem(k, JSON.stringify(v));
      } catch {
        /* opslag niet beschikbaar (privévenster) — site blijft werken */
      }
    },
  };

  const svg = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const I = {
    check: svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
    plus: svg('<path d="M12 5v14M5 12h14"/>'),
    minus: svg('<path d="M5 12h14"/>'),
    close: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
    arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    heart: svg('<path d="M12 20s-7-4.4-9.2-9A5 5 0 0 1 12 6a5 5 0 0 1 9.2 5C19 15.6 12 20 12 20Z"/>'),
    compare: svg('<path d="M8 3v18M16 3v18M3 8h5M16 16h5"/><rect x="3" y="3" width="18" height="18" rx="2"/>'),
    cart: svg('<path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2"/><circle cx="10" cy="20.5" r="1.2"/><circle cx="17" cy="20.5" r="1.2"/>'),
    doc: svg('<path d="M6 3h9l4 4v14H6Z"/><path d="M15 3v4h4M9 12h7M9 16h5"/>'),
    help: svg('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.7M12 17h.01"/>'),
    page: svg('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/>'),
    moon: svg('<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z"/>'),
    sun: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  };

  /* ───────── Thema ───────── */
  const root = document.documentElement;
  const isDark = () => root.dataset.theme === 'dark' || (!root.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
  const paintThemeIcon = () => $$('[data-theme-toggle]').forEach((b) => {
    const old = b.querySelector('svg');
    if (old) old.outerHTML = isDark() ? I.sun : I.moon;
  });
  paintThemeIcon();
  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-theme-toggle]')) return;
    root.dataset.theme = isDark() ? 'light' : 'dark';
    store.set('mk-theme', root.dataset.theme);
    try { localStorage.setItem('mk-theme', root.dataset.theme); } catch { /* */ }
    paintThemeIcon();
  });

  /* ───────── Header ───────── */
  const header = $('.site-header');
  const onScroll = () => header && header.classList.toggle('scrolled', scrollY > 8);
  on(window, 'scroll', onScroll, { passive: true });
  onScroll();

  const megaLi = $('.has-mega');
  if (megaLi) {
    const btn = $('button', megaLi);
    let t;
    const set = (open) => {
      megaLi.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    };
    on(btn, 'click', () => set(!megaLi.classList.contains('open')));
    if (matchMedia('(hover: hover)').matches) {
      on(megaLi, 'mouseenter', () => { clearTimeout(t); set(true); });
      on(megaLi, 'mouseleave', () => { t = setTimeout(() => set(false), 160); });
    }
    document.addEventListener('click', (e) => { if (!megaLi.contains(e.target)) set(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  }

  /* ───────── Drawers ───────── */
  let lastFocus = null;
  function openDrawer(id) {
    const d = document.getElementById(id);
    if (!d) return;
    lastFocus = document.activeElement;
    d.classList.add('open');
    d.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => { const f = $('button, a, input', $('.drawer-panel', d)); f && f.focus(); }, 50);
  }
  function closeDrawers() {
    $$('.drawer.open').forEach((d) => { d.classList.remove('open'); d.setAttribute('aria-hidden', 'true'); });
    document.body.style.overflow = '';
    lastFocus && lastFocus.focus && lastFocus.focus();
  }
  document.addEventListener('click', (e) => {
    const o = e.target.closest('[data-open]');
    if (o) { e.preventDefault(); openDrawer(o.dataset.open); return; }
    if (e.target.closest('.drawer [data-close]')) closeDrawers();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawers(); });

  /* ───────── Toast ───────── */
  function toast(html) {
    const wrap = $('[data-toasts]');
    if (!wrap) return;
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = I.check + `<span>${html}</span>`;
    wrap.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300); }, 3200);
  }

  /* ───────── Productkaart (client-side, zelfde markup als de server) ───────── */
  function cardHTML(p) {
    const badges = (p.oldPrice ? `<span class="badge badge-sale">−${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : '');
    return `<article class="product-card" data-product="${p.slug}">
      <div class="media">${p.art}<div class="badges">${badges}</div></div>
      <div class="tools">
        <button class="tool-btn fav" data-fav="${p.slug}" aria-pressed="false" aria-label="Favoriet">${I.heart}</button>
        ${p.category !== 'accessoires' ? `<button class="tool-btn" data-compare="${p.slug}" aria-pressed="false" aria-label="Vergelijk">${I.compare}</button>` : ''}
      </div>
      <div class="body">
        <span class="brand">${esc(p.brand)}</span>
        <h3><a href="${BASE + p.url}">${esc(p.name)}</a></h3>
        <ul class="specs-mini">${p.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
        <span class="stock${p.stock === 'low' ? ' low' : ''}">${p.stock === 'low' ? 'Nog enkele op voorraad' : 'Op voorraad'}</span>
        <div class="buy"><div class="price-tag"><strong>${money(p.price)}</strong>${p.oldPrice ? `<s>${money(p.oldPrice)}</s>` : ''}</div>
        <button class="add-btn" data-add="${p.slug}" aria-label="In winkelwagen">${I.plus}</button></div>
      </div></article>`;
  }

  /* ───────── Winkelwagen ───────── */
  let cart = store.get('mk-cart', []).filter((i) => bySlug[i.slug]);
  let coupon = store.get('mk-coupon', null);
  const COUPONS = { KONING10: 0.1 };

  function totals() {
    const sub = cart.reduce((s, i) => s + bySlug[i.slug].price * i.qty, 0);
    const discount = coupon && COUPONS[coupon] ? Math.round(sub * COUPONS[coupon] * 100) / 100 : 0;
    const pickup = ($('input[name="ship"]:checked') || {}).value?.startsWith('pickup');
    const shipping = sub === 0 || sub - discount >= SHIP.freeFrom || pickup ? 0 : SHIP.cost;
    return { sub, discount, shipping, total: sub - discount + shipping, count: cart.reduce((s, i) => s + i.qty, 0) };
  }
  function saveCart() {
    store.set('mk-cart', cart);
    renderCart();
  }
  function addToCart(slug, qty = 1) {
    const p = bySlug[slug];
    if (!p) return;
    const line = cart.find((i) => i.slug === slug);
    if (line) line.qty = Math.min(10, line.qty + qty);
    else cart.push({ slug, qty });
    saveCart();
    toast(`${esc(p.name)} toegevoegd <a href="#" data-open="cart-drawer">Bekijk</a>`);
  }
  function setQty(slug, qty) {
    cart = cart.map((i) => (i.slug === slug ? { ...i, qty: Math.max(0, Math.min(10, qty)) } : i)).filter((i) => i.qty > 0);
    saveCart();
  }
  const lineHTML = (i, big) => {
    const p = bySlug[i.slug];
    return `<div class="cart-item">
      <a class="thumb" href="${BASE + p.url}">${p.art}</a>
      <div><h3><a href="${BASE + p.url}">${esc(p.name)}</a></h3>
        <div class="qty"><button data-cart-dec="${p.slug}" aria-label="Minder">${I.minus}</button><span>${i.qty}</span><button data-cart-inc="${p.slug}" aria-label="Meer">${I.plus}</button></div>
        ${big ? '' : ` <button class="remove-btn" data-cart-remove="${p.slug}">Verwijder</button>`}
      </div>
      <div class="price">${money(p.price * i.qty)}</div>
      ${big ? `<button class="remove-btn" data-cart-remove="${p.slug}" aria-label="Verwijder ${esc(p.name)}">${I.close}</button>` : ''}
    </div>`;
  };
  const summaryHTML = (t) => `<div class="totals">
      <div><span>Subtotaal</span><span>${money(t.sub)}</span></div>
      ${t.discount ? `<div style="color:var(--success)"><span>Korting (${esc(coupon)})</span><span>−${money(t.discount)}</span></div>` : ''}
      <div><span>Verzending</span><span>${t.shipping ? money(t.shipping) : 'Gratis'}</span></div>
      <div class="grand"><span>Totaal</span><span>${money(t.total)}</span></div>
      <small class="muted">Inclusief btw</small>
    </div>`;
  const freeShipHTML = (t) => {
    const left = SHIP.freeFrom - (t.sub - t.discount);
    const pct = Math.min(100, ((t.sub - t.discount) / SHIP.freeFrom) * 100);
    return `<div class="free-ship">${left > 0 ? `Nog <strong>${money(left)}</strong> tot gratis verzending` : '🎉 Je bestelling wordt <strong>gratis verzonden</strong>'}<div class="bar"><i style="width:${pct}%"></i></div></div>`;
  };
  const emptyHTML = `<div class="empty-state">${I.cart}<p><strong>Je winkelwagen is nog leeg</strong></p><p>Ontdek ons assortiment of laat je adviseren.</p><a class="btn btn-primary" href="${BASE}shop.html">Naar de shop</a></div>`;

  function renderCart() {
    const t = totals();
    $$('[data-cart-count]').forEach((el) => { el.textContent = t.count; el.classList.toggle('on', t.count > 0); });
    const list = $('[data-cart-list]');
    const foot = $('[data-cart-foot]');
    if (list) {
      list.innerHTML = cart.length ? `${freeShipHTML(t)}<div class="cart-items" style="margin-top:20px">${cart.map((i) => lineHTML(i)).join('')}</div>` : emptyHTML;
      foot.innerHTML = cart.length ? `${summaryHTML(t)}<a class="btn btn-primary btn-lg btn-block" href="${BASE}afrekenen.html">Afrekenen ${I.arrow}</a><a class="btn btn-ghost btn-block" href="${BASE}winkelwagen.html">Bekijk winkelwagen</a>` : '';
      foot.hidden = !cart.length;
    }
    const page = $('[data-cart-page]');
    if (page) page.innerHTML = cart.length ? freeShipHTML(t) + cart.map((i) => lineHTML(i, true)).join('') : emptyHTML;
    $$('[data-cart-summary]').forEach((el) => (el.innerHTML = summaryHTML(t)));
    const co = $('[data-checkout-link]');
    if (co) co.toggleAttribute('hidden', !cart.length);
    const items = $('[data-checkout-items]');
    if (items) items.innerHTML = cart.map((i) => { const p = bySlug[i.slug]; return `<div class="cart-item" style="grid-template-columns:56px 1fr auto"><div class="thumb" style="width:56px;height:56px">${p.art}</div><div><h3>${esc(p.name)}</h3><small class="muted">Aantal: ${i.qty}</small></div><div class="price">${money(p.price * i.qty)}</div></div>`; }).join('') || '<p class="muted">Je winkelwagen is leeg.</p>';
    const shipCost = $('[data-ship-cost]');
    if (shipCost) shipCost.textContent = t.sub - t.discount >= SHIP.freeFrom ? 'Gratis' : money(SHIP.cost);
  }

  document.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    if (add) {
      e.preventDefault();
      const qtyInput = add.hasAttribute('data-add-qty') && $('[data-qty-input]');
      addToCart(add.dataset.add, qtyInput ? Math.max(1, parseInt(qtyInput.value, 10) || 1) : 1);
      if (add.classList.contains('add-btn')) {
        add.classList.add('added');
        add.innerHTML = I.check;
        setTimeout(() => { add.classList.remove('added'); add.innerHTML = I.plus; }, 1400);
      }
      return;
    }
    const inc = e.target.closest('[data-cart-inc]');
    if (inc) { const l = cart.find((i) => i.slug === inc.dataset.cartInc); setQty(l.slug, l.qty + 1); return; }
    const dec = e.target.closest('[data-cart-dec]');
    if (dec) { const l = cart.find((i) => i.slug === dec.dataset.cartDec); setQty(l.slug, l.qty - 1); return; }
    const rm = e.target.closest('[data-cart-remove]');
    if (rm) { setQty(rm.dataset.cartRemove, 0); return; }
    if (e.target.closest('[data-coupon-apply]')) {
      const code = ($('[data-coupon-input]').value || '').trim().toUpperCase();
      if (COUPONS[code]) { coupon = code; store.set('mk-coupon', code); renderCart(); toast(`Kortingscode ${esc(code)} toegepast`); }
      else toast('Deze kortingscode is niet geldig');
    }
  });
  on(document, 'change', (e) => { if (e.target.name === 'ship') renderCart(); });

  /* ───────── Favorieten ───────── */
  let favs = new Set(store.get('mk-favs', []));
  function renderFavs() {
    $$('[data-fav]').forEach((b) => b.setAttribute('aria-pressed', String(favs.has(b.dataset.fav))));
    $$('[data-fav-count]').forEach((el) => { el.textContent = favs.size; el.classList.toggle('on', favs.size > 0); });
    const page = $('[data-favorites]');
    if (page) {
      const list = [...favs].map((s) => bySlug[s]).filter(Boolean);
      page.innerHTML = list.length ? list.map(cardHTML).join('') : `<div class="no-results"><h3>Nog geen favorieten</h3><p>Klik op het hartje bij een product om het hier te bewaren.</p><a class="btn btn-primary" href="${BASE}shop.html">Naar de shop</a></div>`;
      $$('[data-fav]', page).forEach((b) => b.setAttribute('aria-pressed', 'true'));
      renderCompare();
    }
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-fav]');
    if (!b) return;
    e.preventDefault();
    const s = b.dataset.fav;
    if (favs.has(s)) favs.delete(s);
    else { favs.add(s); toast(`Bewaard bij je <a href="${BASE}favorieten.html">favorieten</a>`); }
    store.set('mk-favs', [...favs]);
    renderFavs();
  });

  /* ───────── Vergelijken ───────── */
  // Querystrings kunnen in sommige omgevingen wegvallen; bewaar ze daarom ook kort in sessionStorage.
  const pageKey = (path) => 'mk-qs:' + path.split('/').pop();
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="?"]');
    if (!a || a.target === '_blank' || a.origin !== location.origin) return;
    try { sessionStorage.setItem(pageKey(a.pathname), a.search); } catch { /* */ }
  }, true);
  let qs = location.search;
  try {
    const k = pageKey(location.pathname);
    if (!qs) qs = sessionStorage.getItem(k) || '';
    sessionStorage.removeItem(k);
  } catch { /* */ }
  const params = new URLSearchParams(qs);
  let cmp = store.get('mk-compare', []).filter((s) => bySlug[s]);
  const compareRoot = $('[data-compare-root]');
  if (compareRoot && params.get('ids')) {
    cmp = params.get('ids').split(',').filter((s) => bySlug[s]).slice(0, 3);
    store.set('mk-compare', cmp);
  }
  function renderCompare() {
    $$('[data-compare]').forEach((b) => b.setAttribute('aria-pressed', String(cmp.includes(b.dataset.compare))));
    const bar = $('[data-compare-bar]');
    if (bar) {
      bar.classList.toggle('show', cmp.length > 0 && !compareRoot);
      $('[data-compare-count]', bar).textContent = cmp.length;
    }
    if (!compareRoot) return;
    const sel = $('[data-compare-select]');
    if (sel) $$('option', sel).forEach((o) => (o.disabled = !!o.value && cmp.includes(o.value)));
    if (!cmp.length) {
      compareRoot.innerHTML = `<div class="no-results"><h3>Nog niets om te vergelijken</h3><p>Kies hierboven een product of klik op het vergelijk-icoon bij een product in de shop.</p></div>`;
      return;
    }
    const items = cmp.map((s) => bySlug[s]);
    const keys = Object.keys(items[0].specs);
    const onlyDiff = $('[data-compare-diff]')?.checked;
    const cols = [...items, ...Array(3 - items.length).fill(null)];
    const best = Math.min(...items.map((p) => p.price));
    const rows = keys
      .map((k) => {
        const vals = items.map((p) => p.specs[k] ?? '—');
        const diff = new Set(vals.map(String)).size > 1;
        if (onlyDiff && !diff && items.length > 1) return '';
        return `<tr class="${diff && items.length > 1 ? 'diff' : ''}"><th scope="row">${esc(k)}</th>${cols
          .map((p) => (p ? `<td>${k === 'Prijs' ? `<strong>${money(p.price)}</strong>${p.price === best && items.length > 1 ? ' <span class="badge badge-success">Laagste prijs</span>' : ''}` : esc(p.specs[k] || '—')}</td>` : '<td></td>'))
          .join('')}</tr>`;
      })
      .join('');
    compareRoot.innerHTML = `<div class="compare-wrap"><table class="compare-table">
      <thead><tr><th></th>${cols
        .map((p) =>
          p
            ? `<th><div class="compare-head"><div class="thumb">${p.art}</div><small class="muted" style="font-weight:800;text-transform:uppercase;letter-spacing:.08em">${esc(p.brand)}</small><a href="${BASE + p.url}"><strong>${esc(p.name)}</strong></a>
               <div style="display:flex;gap:6px"><button class="btn btn-primary btn-sm" data-add="${p.slug}">${I.cart} Kopen</button><button class="btn btn-ghost btn-sm" data-compare="${p.slug}" aria-label="Verwijder uit vergelijking">${I.close}</button></div></div></th>`
            : `<th><div class="compare-slot">Voeg een product toe via de keuzelijst</div></th>`,
        )
        .join('')}</tr></thead>
      <tbody>${rows}</tbody></table></div>`;
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-compare]');
    if (b) {
      e.preventDefault();
      const s = b.dataset.compare;
      if (cmp.includes(s)) cmp = cmp.filter((x) => x !== s);
      else if (cmp.length >= 3) { toast('Je kunt maximaal 3 producten vergelijken'); return; }
      else cmp.push(s);
      store.set('mk-compare', cmp);
      renderCompare();
      return;
    }
    if (e.target.closest('[data-compare-clear]')) { cmp = []; store.set('mk-compare', cmp); renderCompare(); }
  });
  on($('[data-compare-select]'), 'change', (e) => {
    const s = e.target.value;
    if (s && !cmp.includes(s)) {
      if (cmp.length >= 3) cmp.shift();
      cmp.push(s);
      store.set('mk-compare', cmp);
      renderCompare();
    }
    e.target.value = '';
  });
  on($('[data-compare-diff]'), 'change', renderCompare);

  /* ───────── Zoeken (⌘K) ───────── */
  const modal = $('#search-modal');
  const sInput = $('[data-search-input]');
  const sResults = $('[data-search-results]');
  let hits = [];
  let active = 0;
  const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const highlight = (text, terms) => {
    let out = esc(text);
    terms.forEach((t) => {
      if (t.length < 2) return;
      const safe = t.replace(/[.*+?^$()|[\]\\{}]/g, '\\$&');
      out = out.replace(new RegExp('(' + safe + ')', 'ig'), '<mark>$1</mark>');
    });
    return out;
  };
  function search(q) {
    const terms = norm(q).split(/\s+/).filter(Boolean);
    if (!terms.length) {
      const pop = [...MK.products].sort((a, b) => b.popularity - a.popularity).slice(0, 5);
      hits = pop.map((p) => ({ url: p.url, html: hitProduct(p, []) }));
      sResults.innerHTML = `<div class="group-label">Populair</div>${hits.map((h, i) => wrapHit(h, i)).join('')}<div class="group-label">Snel naar</div><div style="display:flex;flex-wrap:wrap;gap:8px;padding:4px 12px 12px">${['Formuler', 'Android', 'Linux', 'afstandsbediening', 'retour', 'afhalen'].map((t) => `<button class="chip" data-search-term="${t}">${t}</button>`).join('')}</div>`;
      active = 0;
      paintActive();
      return;
    }
    const match = (hay) => terms.every((t) => norm(hay).includes(t));
    const prod = MK.products.filter((p) => match(`${p.name} ${p.brand} ${p.categoryName} ${p.os} ${p.tags.join(' ')} ${p.summary}`)).sort((a, b) => b.popularity - a.popularity).slice(0, 6);
    const arts = MK.articles.filter((a) => match(`${a.title} ${a.excerpt} ${a.category}`)).slice(0, 3);
    const faqs = MK.faq.filter((f) => match(`${f.q} ${f.group}`)).slice(0, 3);
    const pages = MK.pages.filter((p) => match(`${p.title} ${p.kw}`)).slice(0, 3);
    hits = [];
    let html = '';
    const group = (label, list, fn) => {
      if (!list.length) return;
      html += `<div class="group-label">${label}</div>`;
      list.forEach((x) => { const h = fn(x); html += wrapHit(h, hits.length); hits.push(h); });
    };
    group('Producten', prod, (p) => ({ url: p.url, html: hitProduct(p, terms) }));
    group('Kennisbank', arts, (a) => ({ url: a.url, html: `<span class="thumb">${I.doc}</span><span><strong>${highlight(a.title, terms)}</strong><small>${esc(a.category)}</small></span>` }));
    group('Veelgestelde vragen', faqs, (f) => ({ url: 'klantenservice.html', html: `<span class="thumb">${I.help}</span><span><strong>${highlight(f.q, terms)}</strong><small>${esc(f.group)}</small></span>` }));
    group('Pagina’s', pages, (p) => ({ url: p.url, html: `<span class="thumb">${I.page}</span><span><strong>${highlight(p.title, terms)}</strong></span>` }));
    if (!hits.length) html = `<div class="empty-state"><p><strong>Niets gevonden voor “${esc(q)}”</strong></p><p>Probeer een andere zoekterm of <a style="color:var(--brand);font-weight:700" href="https://wa.me/${MK.whatsapp}?text=${encodeURIComponent('Ik zoek: ' + q)}" target="_blank" rel="noopener">vraag het ons via WhatsApp</a>.</p></div>`;
    else if (prod.length) html += `<a class="search-hit" href="${BASE}shop.html?q=${encodeURIComponent(q)}" style="justify-content:center;font-weight:700;color:var(--brand)">Alle resultaten voor “${esc(q)}” in de shop →</a>`;
    sResults.innerHTML = html;
    active = 0;
    paintActive();
  }
  const hitProduct = (p, terms) => `<span class="thumb">${p.art}</span><span><strong>${highlight(p.name, terms)}</strong><small>${esc(p.brand)} · ${esc(p.categoryName)}</small></span><span class="price">${money(p.price)}</span>`;
  const wrapHit = (h, i) => `<a class="search-hit" href="${BASE + h.url}" data-hit="${i}">${h.html}</a>`;
  const paintActive = () => $$('[data-hit]', sResults).forEach((el) => el.classList.toggle('active', +el.dataset.hit === active));
  function openSearch(q = '') {
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    sInput.value = q;
    search(q);
    setTimeout(() => sInput.focus(), 20);
  }
  function closeSearch() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-search]')) { e.preventDefault(); openSearch(); }
    else if (e.target.closest('[data-search-close]') || e.target === modal) closeSearch();
    const term = e.target.closest('[data-search-term]');
    if (term) { sInput.value = term.dataset.searchTerm; search(sInput.value); sInput.focus(); }
  });
  on(sInput, 'input', () => search(sInput.value));
  on(sInput, 'keydown', (e) => {
    const n = $$('[data-hit]', sResults).length;
    if (e.key === 'ArrowDown') { e.preventDefault(); active = (active + 1) % Math.max(n, 1); paintActive(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); active = (active - 1 + n) % Math.max(n, 1); paintActive(); }
    if (e.key === 'Enter') {
      e.preventDefault();
      const h = hits[active];
      location.href = h ? BASE + h.url : `${BASE}shop.html?q=${encodeURIComponent(sInput.value)}`;
    }
  });
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); modal?.classList.contains('open') ? closeSearch() : openSearch(); }
    else if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); }
    else if (e.key === 'Escape') closeSearch();
  });
  const kbd = $('.search-trigger kbd');
  if (kbd && !/Mac|iPhone|iPad/.test(navigator.platform)) kbd.textContent = 'Ctrl K';

  /* ───────── Shop-filters ───────── */
  const shop = $('[data-shop]');
  if (shop) {
    const forms = $$('[data-filter-form]');
    const grid = $('[data-grid]');
    const cards = $$('.product-card', grid);
    const sortSel = $('[data-sort]');
    const chips = $('[data-active-filters]');
    const state = { cat: [], merk: [], os: [], min: '', max: '', sale: false, q: params.get('q') || '', sort: params.get('sort') || 'pop' };
    ['cat', 'merk', 'os'].forEach((k) => { const v = params.get(k); if (v) state[k] = v.split(','); });
    state.min = params.get('min') || '';
    state.max = params.get('max') || '';
    state.sale = params.get('sale') === '1';

    const writeForms = () => forms.forEach((f) => {
      $$('input[type=checkbox]', f).forEach((c) => (c.checked = c.name === 'sale' ? state.sale : state[c.name]?.includes(c.value)));
      f.elements.min.value = state.min;
      f.elements.max.value = state.max;
    });
    const readForm = (f) => {
      ['cat', 'merk', 'os'].forEach((k) => (state[k] = $$(`input[name="${k}"]:checked`, f).map((c) => c.value)));
      state.min = f.elements.min.value;
      state.max = f.elements.max.value;
      state.sale = !!f.querySelector('input[name="sale"]:checked');
    };
    const labelFor = (k, v) => {
      const inp = $(`[data-filter-form] input[name="${k}"][value="${CSS.escape(v)}"]`);
      return inp ? inp.parentElement.querySelector('span').textContent : v;
    };
    function apply() {
      const q = norm(state.q);
      let n = 0;
      cards.forEach((c) => {
        const p = bySlug[c.dataset.product];
        const ok =
          (!state.cat.length || state.cat.includes(p.category)) &&
          (!state.merk.length || state.merk.includes(p.brandSlug)) &&
          (!state.os.length || state.os.includes(p.os)) &&
          (!state.min || p.price >= +state.min) &&
          (!state.max || p.price <= +state.max) &&
          (!state.sale || p.oldPrice) &&
          (!q || q.split(/\s+/).every((t) => norm(`${p.name} ${p.brand} ${p.categoryName} ${p.tags.join(' ')} ${p.summary}`).includes(t)));
        c.hidden = !ok;
        if (ok) n++;
      });
      const sorters = {
        pop: (a, b) => bySlug[b.dataset.product].popularity - bySlug[a.dataset.product].popularity,
        'price-asc': (a, b) => bySlug[a.dataset.product].price - bySlug[b.dataset.product].price,
        'price-desc': (a, b) => bySlug[b.dataset.product].price - bySlug[a.dataset.product].price,
        name: (a, b) => bySlug[a.dataset.product].name.localeCompare(bySlug[b.dataset.product].name, 'nl'),
      };
      [...cards].sort(sorters[state.sort] || sorters.pop).forEach((c) => grid.insertBefore(c, $('[data-no-results]', grid)));
      sortSel.value = state.sort;
      $('[data-result-count]').textContent = `${n} ${n === 1 ? 'product' : 'producten'}`;
      const btnCount = $('[data-result-count-btn]');
      if (btnCount) btnCount.textContent = n;
      $('[data-no-results]', grid).hidden = n > 0;

      const active = [];
      ['cat', 'merk', 'os'].forEach((k) => state[k].forEach((v) => active.push({ k, v, label: labelFor(k, v) })));
      if (state.min || state.max) active.push({ k: 'price', label: `${state.min ? money(+state.min) : '€ 0'} – ${state.max ? money(+state.max) : '∞'}` });
      if (state.sale) active.push({ k: 'sale', label: 'Aanbiedingen' });
      if (state.q) active.push({ k: 'q', label: `Zoekterm: “${state.q}”` });
      chips.innerHTML = active.map((a, i) => `<button class="chip" aria-pressed="true" data-chip="${i}">${esc(a.label)} ${I.close}</button>`).join('') + (active.length > 1 ? `<button class="chip" data-chip-all>Alles wissen</button>` : '');
      chips._active = active;

      const sp = new URLSearchParams();
      ['cat', 'merk', 'os'].forEach((k) => state[k].length && sp.set(k, state[k].join(',')));
      if (state.min) sp.set('min', state.min);
      if (state.max) sp.set('max', state.max);
      if (state.sale) sp.set('sale', '1');
      if (state.q) sp.set('q', state.q);
      if (state.sort !== 'pop') sp.set('sort', state.sort);
      try { history.replaceState(null, '', `${location.pathname}${sp.toString() ? '?' + sp : ''}`); } catch { /* sandbox */ }
    }
    forms.forEach((f) => {
      on(f, 'change', () => { readForm(f); writeForms(); apply(); });
      on(f, 'input', (e) => { if (e.target.type === 'number') { readForm(f); apply(); } });
      on(f, 'reset', () => setTimeout(() => { Object.assign(state, { cat: [], merk: [], os: [], min: '', max: '', sale: false, q: '' }); writeForms(); apply(); }));
    });
    on(sortSel, 'change', () => { state.sort = sortSel.value; apply(); });
    on(chips, 'click', (e) => {
      if (e.target.closest('[data-chip-all]')) { Object.assign(state, { cat: [], merk: [], os: [], min: '', max: '', sale: false, q: '' }); }
      const c = e.target.closest('[data-chip]');
      if (c) {
        const a = chips._active[+c.dataset.chip];
        if (a.k === 'price') { state.min = ''; state.max = ''; }
        else if (a.k === 'sale') state.sale = false;
        else if (a.k === 'q') state.q = '';
        else state[a.k] = state[a.k].filter((v) => v !== a.v);
      }
      writeForms();
      apply();
    });
    writeForms();
    apply();
  }

  /* ───────── Carrousel ───────── */
  $$('[data-rail-track]').forEach((track) => {
    const sec = track.closest('section');
    $$('[data-rail]', sec).forEach((b) => on(b, 'click', () => track.scrollBy({ left: (b.dataset.rail === 'next' ? 1 : -1) * track.clientWidth * 0.8, behavior: 'smooth' })));
  });

  /* ───────── Productpagina ───────── */
  const pdp = $('[data-pdp]');
  if (pdp) {
    const slug = pdp.dataset.pdp;
    const main = $('[data-gallery-main]');
    $$('[data-gallery-thumb]').forEach((t) =>
      on(t, 'click', () => {
        $$('[data-gallery-thumb]').forEach((x) => x.setAttribute('aria-pressed', String(x === t)));
        const old = $(':scope > svg', main);
        const neu = $('svg', t).cloneNode(true);
        old.replaceWith(neu);
        neu.animate?.([{ opacity: 0, transform: 'scale(.96)' }, { opacity: 1, transform: getComputedStyle(neu).transform === 'none' ? 'none' : getComputedStyle(neu).transform }], { duration: 300, easing: 'ease-out' });
      }),
    );
    const qty = $('[data-qty-input]');
    on($('[data-qty-inc]'), 'click', () => (qty.value = Math.min(10, (+qty.value || 1) + 1)));
    on($('[data-qty-dec]'), 'click', () => (qty.value = Math.max(1, (+qty.value || 1) - 1)));

    const tabs = $$('[role=tab]');
    const selectTab = (t) => {
      tabs.forEach((x) => { x.setAttribute('aria-selected', String(x === t)); x.tabIndex = x === t ? 0 : -1; document.getElementById(x.getAttribute('aria-controls')).hidden = x !== t; });
      t.focus();
    };
    tabs.forEach((t, i) => {
      t.tabIndex = i ? -1 : 0;
      on(t, 'click', () => selectTab(t));
      on(t, 'keydown', (e) => {
        if (e.key === 'ArrowRight') selectTab(tabs[(i + 1) % tabs.length]);
        if (e.key === 'ArrowLeft') selectTab(tabs[(i - 1 + tabs.length) % tabs.length]);
      });
    });

    const sticky = $('[data-sticky-buy]');
    const mainBuy = $('[data-main-buy]');
    if (sticky && mainBuy && 'IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => {
        const show = !en.isIntersecting && en.boundingClientRect.top < 0;
        sticky.classList.toggle('show', show);
        document.body.classList.toggle('has-sticky', show);
      }).observe(mainBuy);
    }

    const recent = store.get('mk-recent', []).filter((s) => s !== slug && bySlug[s]);
    if (recent.length) {
      $('[data-recent]').innerHTML = recent.slice(0, 4).map((s) => cardHTML(bySlug[s])).join('');
      $('[data-recent-wrap]').hidden = false;
    }
    store.set('mk-recent', [slug, ...recent].slice(0, 8));
  }

  /* ───────── Levertijd / openingstijden (Amsterdamse tijd) ───────── */
  function amsNow() {
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Amsterdam', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date()).map((p) => [p.type, p.value]));
    const days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { day: days[parts.weekday], mins: (+parts.hour % 24) * 60 + +parts.minute, hh: parts.hour, mm: parts.minute };
  }
  const now = amsNow();
  const [cutH, cutM] = (SHIP.cutoff || '17:00').split(':').map(Number);
  const cutoff = cutH * 60 + cutM;
  const delivery = $('[data-delivery-text]');
  if (delivery) {
    const weekday = now.day >= 1 && now.day <= 5;
    if (weekday && now.mins < cutoff && cutoff - now.mins <= 360) {
      const left = cutoff - now.mins;
      delivery.innerHTML = `bestel binnen <strong>${Math.floor(left / 60)}u ${left % 60}m</strong>, dan versturen we vandaag nog`;
    } else if (weekday && now.mins < cutoff) {
      delivery.textContent = `voor ${SHIP.cutoff} besteld, vandaag verzonden`;
    } else {
      const nextShip = now.day === 5 || now.day === 6 || now.day === 0 ? 'maandag' : 'morgen';
      delivery.textContent = `vandaag besteld, ${nextShip} verzonden`;
    }
  }
  const clock = $('[data-clock]');
  if (clock) clock.textContent = `${now.hh}:${now.mm}`;

  const openNow = $('[data-open-now]');
  if (openNow && MK.hours) {
    const idx = now.day === 0 ? 2 : now.day === 6 ? 1 : 0;
    const m = /(\d+):(\d+)\D+(\d+):(\d+)/.exec(MK.hours[idx].time);
    const isOpen = m && now.mins >= +m[1] * 60 + +m[2] && now.mins < +m[3] * 60 + +m[4];
    openNow.classList.toggle('is-open', !!isOpen);
    openNow.textContent = isOpen ? `Nu bereikbaar · tot ${m[3]}:${m[4]}` : 'Nu gesloten · stuur gerust een WhatsApp, we reageren zo snel mogelijk';
    $$('[data-hours] li').forEach((li) => li.classList.toggle('today', +li.dataset.day === idx));
  }

  /* ───────── Keuzehulp ───────── */
  const quiz = $('[data-quiz]');
  if (quiz) {
    const Q = [
      { q: 'Wat kijk je het meest?', sub: 'Kies wat het beste bij je past.', opts: [
        { e: '📺', t: 'Vooral live-tv', d: 'Zenders, sport en nieuws', w: { iptv: 3, simple: 1 } },
        { e: '🍿', t: 'Live-tv én streaming', d: 'Ook Netflix, YouTube, Disney+', w: { iptv: 2, apps: 2 } },
        { e: '🎬', t: 'Vooral films en series', d: 'Streamingdiensten en Plex', w: { apps: 3, power: 1, iptv: -1 } },
        { e: '👑', t: 'Alles, en het beste', d: 'Geen compromissen', w: { power: 3, apps: 1, iptv: 1 } },
      ] },
      { q: 'Wie gaat de box gebruiken?', sub: 'Zo weten we hoe eenvoudig hij moet zijn.', opts: [
        { e: '👵', t: 'Iemand die het simpel wil', d: 'Aanzetten en kijken', w: { simple: 3 } },
        { e: '🙂', t: 'Een gemiddelde gebruiker', d: 'Af en toe een app installeren', w: { simple: 1, apps: 1 } },
        { e: '🧑‍💻', t: 'Iemand die graag instelt', d: 'Apps, instellingen, alles', w: { apps: 2, power: 1 } },
      ] },
      { q: 'Wat is je budget?', sub: 'Inclusief btw.', opts: [
        { e: '💶', t: 'Tot € 100', d: 'Betaalbaar en betrouwbaar', w: { budget: 3 }, max: 100 },
        { e: '💳', t: '€ 100 – € 150', d: 'De gulden middenweg', w: { budget: 1, power: 1 }, max: 150 },
        { e: '💎', t: 'Meer dan € 150', d: 'Het beste van het beste', w: { power: 2 } },
        { e: '🤷', t: 'Maakt niet uit', d: 'Adviseer me gewoon', w: {} },
      ] },
      { q: 'Wat vind je het allerbelangrijkst?', sub: 'Eén ding dat moet kloppen.', opts: [
        { e: '⚡', t: 'Snelheid', d: 'Snel opstarten en zappen', w: { power: 2, iptv: 1 } },
        { e: '🧘', t: 'Gebruiksgemak', d: 'Geen gedoe', w: { simple: 2 } },
        { e: '📱', t: 'Apps', d: 'Zoveel mogelijk mogelijkheden', w: { apps: 2 } },
        { e: '🏷️', t: 'Prijs', d: 'Zo voordelig mogelijk', w: { budget: 2 } },
      ] },
    ];
    const reasons = {
      iptv: 'Gebouwd voor live-tv met een snelle programmagids',
      apps: 'Toegang tot apps zoals Netflix, YouTube en Disney+',
      simple: 'Eenvoudig te bedienen, ook voor minder technische kijkers',
      power: 'Krachtige hardware: 4K zonder haperen',
      budget: 'Uitstekende prijs-kwaliteitverhouding',
    };
    const stage = $('[data-quiz-stage]');
    const bar = $('[data-quiz-bar]');
    let step = 0;
    const answers = [];
    function renderStep() {
      bar.style.width = `${(step / Q.length) * 100}%`;
      if (step >= Q.length) return renderResult();
      const s = Q[step];
      stage.innerHTML = `<div class="quiz-step"><span class="eyebrow">Vraag ${step + 1} van ${Q.length}</span><h2>${s.q}</h2><p class="muted">${s.sub}</p>
        <div class="quiz-opts">${s.opts.map((o, i) => `<button class="quiz-opt" data-opt="${i}" aria-pressed="${answers[step] === i}"><span class="emoji" aria-hidden="true">${o.e}</span><span><strong>${o.t}</strong><span>${o.d}</span></span></button>`).join('')}</div>
        <div class="quiz-nav">${step ? `<button class="btn btn-ghost" data-quiz-back>← Vorige</button>` : '<span></span>'}<span class="muted" style="align-self:center">Kies een antwoord om verder te gaan</span></div></div>`;
      $('.quiz-opt', stage)?.focus({ preventScroll: true });
    }
    function renderResult() {
      const w = {};
      let max = Infinity;
      answers.forEach((a, i) => {
        const o = Q[i].opts[a];
        Object.entries(o.w).forEach(([k, v]) => (w[k] = (w[k] || 0) + v));
        if (o.max) max = Math.min(max, o.max);
      });
      const scored = MK.products
        .filter((p) => p.category !== 'accessoires')
        .map((p) => {
          let s = Object.entries(w).reduce((acc, [k, v]) => acc + v * (p.fit[k] || 0), 0);
          const fits = p.price <= max;
          if (!fits) s -= 6 + (p.price - max) / 10;
          const top = Object.entries(w).filter(([, v]) => v > 0).sort((a, b) => b[1] * (p.fit[b[0]] || 0) - a[1] * (p.fit[a[0]] || 0)).slice(0, 3).filter(([k]) => (p.fit[k] || 0) >= 2).map(([k]) => reasons[k]);
          if (fits && max < Infinity) top.push('Past binnen je budget');
          return { p, s, top };
        })
        .sort((a, b) => b.s - a.s || b.p.popularity - a.p.popularity)
        .slice(0, 3);
      const best = scored[0].s || 1;
      stage.innerHTML = `<div class="quiz-step quiz-result">
        <div><span class="eyebrow">Jouw advies</span><h2>Dit zijn jouw beste matches</h2><p class="muted">Op basis van je antwoorden. Twijfel je nog? Stuur ons gerust een berichtje.</p></div>
        ${scored.map(({ p, s, top }, i) => `<div class="match${i === 0 ? ' best' : ''}">
          <a class="thumb" href="${BASE + p.url}">${p.art}</a>
          <div>${i === 0 ? '<span class="badge badge-brand">Beste match</span> ' : ''}<span class="score">${Math.max(55, Math.round((s / best) * (98 - i * 4)))}% match</span>
            <h3 style="margin:6px 0 2px"><a href="${BASE + p.url}">${esc(p.name)}</a></h3><strong>${money(p.price)}</strong>
            <ul>${(top.length ? top : [p.summary]).map((r) => `<li>${esc(r)}</li>`).join('')}</ul></div>
          <div style="display:grid;gap:8px"><button class="btn btn-primary" data-add="${p.slug}">${I.cart} In winkelwagen</button><a class="btn btn-ghost btn-sm" href="${BASE + p.url}">Bekijk details</a></div>
        </div>`).join('')}
        <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:space-between">
          <button class="btn btn-ghost" data-quiz-restart>↺ Opnieuw beginnen</button>
          <a class="btn btn-dark" href="${BASE}vergelijk.html?ids=${scored.map((x) => x.p.slug).join(',')}">${I.compare} Vergelijk deze 3</a>
        </div></div>`;
      bar.style.width = '100%';
    }
    on(stage, 'click', (e) => {
      const o = e.target.closest('[data-opt]');
      if (o) {
        answers[step] = +o.dataset.opt;
        $$('[data-opt]', stage).forEach((b) => b.setAttribute('aria-pressed', String(b === o)));
        setTimeout(() => { step++; renderStep(); quiz.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 220);
      }
      if (e.target.closest('[data-quiz-back]')) { step--; renderStep(); }
      if (e.target.closest('[data-quiz-restart]')) { step = 0; answers.length = 0; renderStep(); }
    });
    renderStep();
  }

  /* ───────── Kennisbank-filter ───────── */
  const kbf = $('[data-kb-filter]');
  on(kbf, 'click', (e) => {
    const b = e.target.closest('[data-kb]');
    if (!b) return;
    $$('[data-kb]', kbf).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    $$('[data-kb-cat]').forEach((a) => (a.hidden = !!b.dataset.kb && a.dataset.kbCat !== b.dataset.kb));
  });

  /* ───────── FAQ-zoeken ───────── */
  const fq = $('[data-faq-search]');
  on(fq, 'input', () => {
    const terms = norm(fq.value).split(/\s+/).filter(Boolean);
    let any = 0;
    $$('[data-faq-group]').forEach((g) => {
      let n = 0;
      $$('details', g).forEach((d) => {
        const ok = terms.every((t) => norm(d.dataset.faq).includes(t));
        d.hidden = !ok;
        d.open = ok && terms.length > 0;
        if (ok) n++;
      });
      g.hidden = !n;
      any += n;
    });
    $('[data-faq-empty]').hidden = any > 0;
  });

  /* ───────── Formulieren (demo) ───────── */
  $$('[data-demo-form]').forEach((f) =>
    on(f, 'submit', (e) => {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      f.classList.add('sent');
    }),
  );

  /* ───────── Afrekenen ───────── */
  const co = $('[data-checkout-form]');
  if (co) {
    const steps = $$('[data-step]', co);
    const stepper = $$('[data-stepper] li');
    let cur = 0;
    if (!cart.length) {
      co.innerHTML = `<div class="panel">${emptyHTML}</div>`;
      $('[data-stepper]').hidden = true;
    }
    const show = (i) => {
      cur = i;
      steps.forEach((s, j) => (s.hidden = j !== i));
      stepper.forEach((li, j) => { li.classList.toggle('on', j === i); li.classList.toggle('done', j < i); });
      window.scrollTo({ top: co.getBoundingClientRect().top + scrollY - 140, behavior: 'smooth' });
    };
    const valid = (i) => {
      const bad = $$('input[required]', steps[i]).find((x) => !x.checkValidity());
      if (bad) { bad.reportValidity(); return false; }
      return true;
    };
    on(co, 'click', (e) => {
      if (e.target.closest('[data-next]') && valid(cur)) show(cur + 1);
      if (e.target.closest('[data-prev]')) show(cur - 1);
    });
    on(co, 'submit', (e) => {
      e.preventDefault();
      if (!valid(cur)) return;
      const nr = 'MK-' + Math.floor(10000 + Math.random() * 89999);
      cart = [];
      coupon = null;
      store.set('mk-coupon', null);
      saveCart();
      co.hidden = true;
      $('[data-stepper]').hidden = true;
      const done = $('[data-checkout-done]');
      $('[data-order-nr]', done).textContent = nr;
      done.hidden = false;
      done.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ───────── Reveal-animaties ───────── */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el, i) => { el.style.transitionDelay = `${Math.min(i % 4, 3) * 70}ms`; io.observe(el); });
  } else reveals.forEach((el) => el.classList.add('in'));

  renderCart();
  renderFavs();
  renderCompare();
})();
