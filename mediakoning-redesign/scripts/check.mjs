// Kwaliteitscheck: start een lokale server, opent elke pagina in Chromium,
// meldt JS-fouten en kapotte interne links. Gebruik: npm run check
import http from 'node:http';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, extname, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = await import('/opt/node22/lib/node_modules/playwright/index.js').catch(() => import('playwright'))); }

const dist = resolve(dirname(fileURLToPath(import.meta.url)), '..', process.env.DIST || 'dist');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json' };
const server = http.createServer(async (req, res) => {
  const p = join(dist, decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/\/$/, '/index.html'));
  try { const b = await readFile(p); res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' }); res.end(b); }
  catch { res.writeHead(404); res.end('nf'); }
}).listen(4173);

async function walk(d) { const out = []; for (const e of await readdir(d, { withFileTypes: true })) { const f = join(d, e.name); if (e.isDirectory()) out.push(...await walk(f)); else if (f.endsWith('.html')) out.push(f.slice(dist.length + 1)); } return out; }
const pages = await walk(dist);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }).catch(() => chromium.launch());
const ctx = await browser.newContext();
await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
const errors = [];
const broken = new Set();
for (const path of pages) {
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`${path}: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error' && !/fonts|ERR_FAILED/.test(m.text())) errors.push(`${path}: ${m.text()}`); });
  await page.goto(`http://localhost:4173/${path}`, { waitUntil: 'load' });
  const links = await page.$$eval('a[href]', (as) => as.map((a) => a.href).filter((h) => h.startsWith('http://localhost:4173/')));
  for (const l of links) {
    const f = join(dist, new URL(l).pathname);
    try { await stat(f); } catch { broken.add(`${path} → ${new URL(l).pathname}`); }
  }
  await page.close();
}
console.log(`Pagina's gecontroleerd: ${pages.length}`);
console.log(errors.length ? `JS-fouten:\n  ${errors.join('\n  ')}` : 'Geen JS-fouten ✓');
console.log(broken.size ? `Kapotte links:\n  ${[...broken].join('\n  ')}` : 'Geen kapotte links ✓');
await browser.close();
server.close();
process.exit(errors.length || broken.size ? 1 : 0);
