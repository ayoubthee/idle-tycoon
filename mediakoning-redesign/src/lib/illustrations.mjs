// Eigen SVG-productillustraties. Geen externe afbeeldingen nodig: snel, scherp
// op elk scherm en automatisch in de kleuren van het product.
// Vervang ze later eenvoudig door echte productfoto's (zie README.md).

let uid = 0;

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const clamp = (v) => Math.max(0, Math.min(255, v));
  const r = clamp((n >> 16) + amt);
  const g = clamp(((n >> 8) & 255) + amt);
  const b = clamp((n & 255) + amt);
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

function isLight(hex) {
  const n = parseInt(hex.slice(1), 16);
  const lum = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  return lum > 150;
}

const wrap = (inner, label, view = '0 0 400 300') =>
  `<svg viewBox="${view}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

function defs(id, color, accent) {
  return `<defs>
    <linearGradient id="t${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${shade(color, 42)}"/><stop offset="1" stop-color="${shade(color, 6)}"/></linearGradient>
    <linearGradient id="f${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(color, -6)}"/><stop offset="1" stop-color="${shade(color, -26)}"/></linearGradient>
    <radialGradient id="g${id}"><stop offset="0" stop-color="${accent}" stop-opacity=".9"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
    <radialGradient id="s${id}"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
  </defs>`;
}

function slab(id, { w = 280, top = 70, front = 56, cx = 200, base = 210, accent, color, label }) {
  const x1 = cx - w / 2;
  const x2 = cx + w / 2;
  const inset = w * 0.12;
  const yTop = base - front - top;
  const yMid = base - front;
  const sheen = isLight(color) ? '#fff' : '#ffffff';
  return `
    <ellipse cx="${cx}" cy="${base + 22}" rx="${w * 0.6}" ry="20" fill="url(#s${id})"/>
    <path d="M${x1 + 6} ${yMid} H${x2 - 6} Q${x2} ${yMid} ${x2} ${yMid + 8} V${base - 10} Q${x2} ${base} ${x2 - 12} ${base} H${x1 + 12} Q${x1} ${base} ${x1} ${base - 10} V${yMid + 8} Q${x1} ${yMid} ${x1 + 6} ${yMid}Z" fill="url(#f${id})"/>
    <path d="M${x1 + 4} ${yMid} L${x1 + inset} ${yTop + 6} Q${x1 + inset + 3} ${yTop} ${x1 + inset + 12} ${yTop} H${x2 - inset - 12} Q${x2 - inset - 3} ${yTop} ${x2 - inset} ${yTop + 6} L${x2 - 4} ${yMid} Z" fill="url(#t${id})"/>
    <path d="M${x1 + inset + 14} ${yTop + 3} H${x2 - inset - 14}" stroke="${sheen}" stroke-opacity=".25" stroke-width="2" stroke-linecap="round"/>
    <path d="M${x1 + 10} ${yMid + 1.5} H${x2 - 10}" stroke="${sheen}" stroke-opacity=".18" stroke-width="2"/>
    <rect x="${cx - 34}" y="${yTop + top * 0.45}" width="68" height="7" rx="3.5" fill="${sheen}" opacity=".16"/>
    <circle cx="${x2 - 40}" cy="${yMid + front / 2}" r="16" fill="url(#g${id})"/>
    <circle cx="${x2 - 40}" cy="${yMid + front / 2}" r="3.6" fill="${accent}"/>
    <rect x="${x1 + 26}" y="${yMid + front / 2 - 2}" width="${w * 0.18}" height="4" rx="2" fill="${sheen}" opacity=".12"/>
    ${label ? `<text x="${cx}" y="${yTop + top * 0.45 + 22}" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="800" letter-spacing="3" fill="${sheen}" opacity=".35">${label}</text>` : ''}`;
}

const shapes = {
  box: (id, p) => slab(id, { ...p, w: 290, top: 78, front: 52 }),
  'box-small': (id, p) => slab(id, { ...p, w: 230, top: 70, front: 44, base: 214 }),
  'box-flat': (id, p) => slab(id, { ...p, w: 280, top: 92, front: 30, base: 206 }),
  'box-tall': (id, p) => {
    const { color, accent } = p;
    return `
      <ellipse cx="200" cy="246" rx="120" ry="18" fill="url(#s${id})"/>
      <path d="M110 230 L170 60 Q176 46 190 46 H210 Q224 46 230 60 L290 230 Q292 238 284 238 H116 Q108 238 110 230Z" fill="url(#t${id})"/>
      <path d="M200 46 L200 238" stroke="#fff" stroke-opacity=".08" stroke-width="2"/>
      <path d="M140 150 L260 150" stroke="${accent}" stroke-width="3" stroke-linecap="round" opacity=".9"/>
      <circle cx="200" cy="150" r="22" fill="url(#g${id})"/>
      <path d="M118 236 H282" stroke="${shade(color, -30)}" stroke-width="6" stroke-linecap="round"/>`;
  },
  puck: (id, p) => {
    const { accent } = p;
    return `
      <ellipse cx="200" cy="232" rx="140" ry="22" fill="url(#s${id})"/>
      <path d="M90 150 V182 A110 40 0 0 0 310 182 V150Z" fill="url(#f${id})"/>
      <ellipse cx="200" cy="150" rx="110" ry="40" fill="url(#t${id})"/>
      <ellipse cx="200" cy="146" rx="80" ry="26" fill="none" stroke="#000" stroke-opacity=".06" stroke-width="2"/>
      <circle cx="262" cy="196" r="12" fill="url(#g${id})"/>
      <circle cx="262" cy="196" r="3" fill="${accent}"/>`;
  },
  stick: (id, p) => {
    const { color, accent } = p;
    return `
      <ellipse cx="200" cy="236" rx="150" ry="16" fill="url(#s${id})"/>
      <g transform="rotate(-14 200 160)">
        <rect x="70" y="128" width="210" height="60" rx="18" fill="url(#t${id})"/>
        <rect x="70" y="164" width="210" height="24" rx="12" fill="${shade(color, -20)}" opacity=".7"/>
        <rect x="274" y="140" width="46" height="36" rx="6" fill="#c9ced8"/>
        <rect x="314" y="146" width="26" height="24" rx="3" fill="#9aa1ad"/>
        <rect x="320" y="152" width="14" height="12" rx="2" fill="#5d6370"/>
        <circle cx="104" cy="158" r="10" fill="url(#g${id})"/>
        <circle cx="104" cy="158" r="2.6" fill="${accent}"/>
        <rect x="150" y="148" width="70" height="6" rx="3" fill="#fff" opacity=".14"/>
      </g>`;
  },
  remote: (id, p) => {
    const { color, accent } = p;
    const btn = shade(color, 34);
    return `
      <ellipse cx="200" cy="270" rx="70" ry="10" fill="url(#s${id})"/>
      <g transform="rotate(-10 200 150)">
        <rect x="158" y="18" width="84" height="250" rx="40" fill="url(#t${id})"/>
        <rect x="164" y="24" width="72" height="238" rx="34" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="2"/>
        <circle cx="200" cy="48" r="6" fill="${accent}"/>
        <circle cx="200" cy="48" r="14" fill="url(#g${id})"/>
        <circle cx="200" cy="104" r="28" fill="${btn}"/>
        <circle cx="200" cy="104" r="12" fill="${shade(color, 12)}"/>
        <circle cx="178" cy="152" r="7" fill="${btn}"/><circle cx="200" cy="152" r="7" fill="${btn}"/><circle cx="222" cy="152" r="7" fill="${btn}"/>
        <rect x="178" y="172" width="12" height="36" rx="6" fill="${btn}"/><rect x="210" y="172" width="12" height="36" rx="6" fill="${btn}"/>
        <circle cx="184" cy="226" r="5" fill="${btn}"/><circle cx="200" cy="226" r="5" fill="${btn}"/><circle cx="216" cy="226" r="5" fill="${btn}"/>
        <circle cx="184" cy="242" r="5" fill="${btn}"/><circle cx="200" cy="242" r="5" fill="${accent}" opacity=".8"/><circle cx="216" cy="242" r="5" fill="${btn}"/>
      </g>`;
  },
  keyboard: (id, p) => {
    const { color, accent } = p;
    const key = shade(color, 30);
    let keys = '';
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 9; c++) keys += `<rect x="${92 + c * 18}" y="${126 + r * 18}" width="14" height="14" rx="3" fill="${key}"/>`;
    return `
      <ellipse cx="200" cy="236" rx="160" ry="16" fill="url(#s${id})"/>
      <g transform="rotate(-6 200 160)">
        <rect x="70" y="100" width="260" height="120" rx="24" fill="url(#t${id})"/>
        ${keys}
        <rect x="264" y="126" width="48" height="68" rx="10" fill="${shade(color, 18)}"/>
        <circle cx="288" cy="206" r="4" fill="${accent}"/>
        <rect x="128" y="200" width="90" height="12" rx="4" fill="${key}"/>
      </g>`;
  },
  cable: (id, p) => {
    const { color, accent } = p;
    return `
      <ellipse cx="200" cy="246" rx="150" ry="14" fill="url(#s${id})"/>
      <path d="M90 200 C 60 120, 180 70, 220 130 S 330 210, 300 120 S 170 40, 140 120 S 230 230, 280 200" fill="none" stroke="${color}" stroke-width="14" stroke-linecap="round"/>
      <path d="M90 200 C 60 120, 180 70, 220 130 S 330 210, 300 120 S 170 40, 140 120 S 230 230, 280 200" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="3" stroke-dasharray="3 7" stroke-linecap="round"/>
      <g transform="translate(64 196) rotate(-60)"><rect x="-18" y="-14" width="44" height="28" rx="6" fill="${shade(color, 20)}"/><rect x="-36" y="-9" width="22" height="18" rx="2" fill="#c7ccd6"/></g>
      <g transform="translate(296 204) rotate(20)"><rect x="-18" y="-14" width="44" height="28" rx="6" fill="${shade(color, 20)}"/><rect x="24" y="-9" width="22" height="18" rx="2" fill="#c7ccd6"/></g>
      <circle cx="220" cy="130" r="10" fill="${accent}" opacity=".25"/>`;
  },
};

export function productArt(p, opts = {}) {
  const id = `${p.slug.replace(/[^a-z0-9]/g, '')}${uid++}`;
  const draw = shapes[p.shape] ?? shapes.box;
  const brandLabel = opts.label === false ? '' : (p.brandName || '').toUpperCase();
  const inner = defs(id, p.color, p.accent) + draw(id, { color: p.color, accent: p.accent, label: brandLabel });
  return wrap(inner, p.name);
}

// Alternatieve "foto's" voor de galerij: zelfde product, andere compositie.
export function productArtVariant(p, variant) {
  const svg = productArt(p, { label: variant !== 2 });
  if (variant === 1) return svg.replace('<svg ', '<svg style="transform:scale(1.25) rotate(-6deg)" ');
  if (variant === 2) return svg.replace('<svg ', '<svg style="transform:scaleX(-1)" ');
  if (variant === 3) {
    // detailweergave van de poorten
    return wrap(
      `<rect x="40" y="90" width="320" height="120" rx="18" fill="${shade(p.color, -10)}"/>
       ${['HDMI', 'LAN', 'USB', 'DC'].map((t, i) => `<g transform="translate(${80 + i * 72} 130)"><rect width="${t === 'DC' ? 24 : 44}" height="${t === 'LAN' ? 34 : 18}" rx="4" fill="#0a0b10" stroke="${p.accent}" stroke-opacity=".5"/><text x="${t === 'DC' ? 12 : 22}" y="62" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="12" font-weight="700" fill="#fff" opacity=".6">${t}</text></g>`).join('')}`,
      `${p.name} — aansluitingen`,
    );
  }
  return svg;
}

// Abstracte omslagen voor kennisbank-artikelen
const palettes = [
  ['#4f3cff', '#9b5cff', '#3fd0ff'],
  ['#0c1024', '#4f3cff', '#f5b300'],
  ['#ff5a5f', '#9b5cff', '#ffb547'],
  ['#0f9d58', '#3fd0ff', '#4f3cff'],
  ['#1b1d27', '#ff7a00', '#ffb547'],
  ['#4f3cff', '#d14dff', '#46e39b'],
];
export function articleCover(i, title) {
  const [a, b, c] = palettes[i % palettes.length];
  const id = `ac${uid++}`;
  return wrap(
    `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
     <rect width="400" height="225" fill="url(#${id})"/>
     <circle cx="${320 - i * 20}" cy="${40 + i * 12}" r="${90 + (i % 3) * 20}" fill="${c}" opacity=".35"/>
     <circle cx="${60 + i * 25}" cy="200" r="70" fill="#fff" opacity=".08"/>
     <g opacity=".9" transform="translate(${130 + (i % 2) * 40} 60)">
       <rect width="140" height="88" rx="10" fill="#0a0b14" opacity=".55"/>
       <rect x="8" y="8" width="124" height="64" rx="5" fill="#fff" opacity=".12"/>
       <rect x="54" y="92" width="32" height="6" rx="3" fill="#0a0b14" opacity=".55"/>
       <path d="M60 30 l22 12 -22 12z" fill="#fff" opacity=".85"/>
     </g>`,
    title,
    '0 0 400 225',
  );
}

// Gestileerde kaart (geen externe kaartdienst nodig, privacyvriendelijk)
export function mapArt(seed) {
  const id = `mp${uid++}`;
  const roads = Array.from({ length: 6 }, (_, i) => {
    const y = 20 + ((seed * 37 + i * 53) % 200);
    return `<path d="M0 ${y} Q 200 ${y + ((i % 2 ? 1 : -1) * 30)} 400 ${y + 10}" stroke="var(--line-strong)" stroke-width="${i === 2 ? 10 : 4}" fill="none"/>`;
  }).join('');
  return wrap(
    `<defs><radialGradient id="${id}"><stop offset="0" stop-color="#4f3cff" stop-opacity=".35"/><stop offset="1" stop-color="#4f3cff" stop-opacity="0"/></radialGradient></defs>
     <rect width="400" height="225" fill="var(--surface-2)"/>
     <path d="M0 ${160 + seed * 6} C 120 ${120 + seed * 8} 260 220 400 ${150 - seed * 4} V225 H0Z" fill="#3fd0ff" opacity=".18"/>
     ${roads}
     <path d="M${120 + seed * 30} 0 Q 200 120 ${180 + seed * 20} 225" stroke="var(--line-strong)" stroke-width="6" fill="none"/>
     <circle cx="200" cy="105" r="50" fill="url(#${id})"/>
     <path d="M200 120 s-20-18-20-34a20 20 0 0 1 40 0c0 16-20 34-20 34Z" fill="#4f3cff"/>
     <circle cx="200" cy="86" r="7" fill="#fff"/>`,
    'Kaart',
    '0 0 400 225',
  );
}
