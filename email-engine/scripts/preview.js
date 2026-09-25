// Usage: node scripts/preview.js [brand] [email]   e.g. npm run preview -- placeholder flows/welcome
// Serves emails, campaign recipes and the component gallery rendered live from source, and reloads the browser when a
// source file changes. Nothing is written to dist/. Placeholder-token problems are warnings here, hard errors in the build.
//
//   /                              emails, recipes and the gallery
//   /<flows|campaigns>/<email>     one email (add ?theme=luxury)
//   /recipes, /recipes/<name>      campaign recipes with their preview data
//   /brands/<brand>/              generated brand collection (npm run gallery:brand -- <brand>)
//   /components, /components/<category>/<name>   every component, every variant, with a theme switcher
const http = require('http');
const fs = require('fs');
const path = require('path');
const { ROOT, DIST_DIR, EMAIL_DIRS, EXAMPLE_DIRS, listBrands, listEmails } = require('./lib/paths');
const { loadBrand } = require('./lib/tokens');
const { renderEmail, renderComponent, renderRecipe } = require('./lib/render');
const { runChecks } = require('./lib/checks');
const { loadRegistry } = require('./lib/registry');
const { loadRecipes } = require('./lib/recipes');
const { listThemes, DEFAULT_THEME } = require('./lib/themes');

const PORT = Number(process.env.PORT) || 3000;
const brand = process.argv[2] || 'placeholder';
const firstEmail = process.argv[3];

if (!listBrands().includes(brand)) {
  console.error(`Unknown brand "${brand}". Available: ${listBrands().join(', ')}`);
  process.exit(1);
}

const RELOAD_SCRIPT = `<script>new EventSource('/__reload').onmessage = () => location.reload();</script>`;
const clients = new Set();

const escapeHtml = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const { page, intro, library, preview, styles, query, title } = require('./lib/studio');

function loadTokens() {
  return loadBrand(brand); // re-read each time so token edits show up
}

async function renderEmailPage(email, theme) {
  const { tokens, errors, placeholderIssues } = loadTokens();
  if (errors.length) return page(`<h2>tokens/${brand}.json is invalid</h2><pre>${escapeHtml(errors.join('\n'))}</pre>`);
  const { html, mjml, mjmlErrors } = await renderEmail(`${email}.mjml`, tokens, { theme, fresh: true });
  const { errors: checkErrors, warnings } = runChecks(html, brand, mjml);
  return withBanner(html, email, [
    ...placeholderIssues.map((m) => `placeholder: ${m}`),
    ...mjmlErrors.map((e) => `mjml: ${e.formattedMessage || e.message}`),
    ...checkErrors.map((m) => `check: ${m}`),
    ...warnings.map((m) => `warning: ${m}`),
  ]);
}

function withBanner(html, label, notes) {
  if (notes.length) console.warn(`\n${label}\n  ${notes.join('\n  ')}`);
  const banner = notes.length ? `<div class="warn">${escapeHtml(notes.join('\n'))}</div>` : '';
  return html.replace(/<body[^>]*>/i, (m) => `${m}${banner}`).replace('</body>', `${RELOAD_SCRIPT}</body>`);
}

function homePage(theme) {
  const collectionsDir = path.join(ROOT, 'brands');
  const collections = fs.existsSync(collectionsDir) ? fs.readdirSync(collectionsDir)
    .filter(id => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) && fs.existsSync(path.join(collectionsDir, id, 'catalog.js')))
    .map(id => {
      const catalog = require(path.join(collectionsDir, id, 'catalog.js'));
      return `<a class="collection-card" href="/brands/${id}/"><div><p class="kicker">BRAND COLLECTION</p><h3>${escapeHtml(catalog.name)}</h3><p>${escapeHtml(catalog.description)}</p></div><span class="button">Explore collection ↗</span></a>`;
    }).join('') : '';
  const paths = [
    ['emails', 'Your email library', 'Browse complete emails and flows. Preview a design at desktop or phone size.', listEmails({ examples: true }).length + ' emails'],
    ['recipes', 'Start with a recipe', 'Find a ready-made composition for your next campaign, then explore its style.', loadRecipes().size + ' recipes'],
    ['components', 'Build block by block', 'Explore reusable components and their variants to find the right fit.', loadRegistry().all().length + ' components'],
  ];
  return page(`${intro('Your creative workspace', 'Good emails start here.', 'From a single block to a complete campaign. Find your starting point, explore a style, and make it yours.', `<aside><span class="edition">THE WORKSPACE / 01</span><p>A little structure.<br>A lot of possibility.</p><small>Preview brand: ${escapeHtml(brand)}<br>Live previews from your design system</small></aside>`)}
    <div class="section-heading"><h2>What are you working on?</h2></div><section class="path-grid" aria-label="Explore the studio">${paths.map(([href, name, desc, count], i) => `<a class="path-card" href="/${href}${query(theme)}"><span class="number">0${i + 1} / ${count}</span><h3>${name}</h3><p>${desc}</p><span class="action">Explore ${href} ↗</span></a>`).join('')}</section>
    ${collections ? `<div class="section-heading"><h2>Made for your brand</h2></div>${collections}` : ''}`, { theme });
}

function emailsIndex(theme) {
  const entries = listEmails({ examples: true }).map(id => ({
    name: title(id.split('/').pop()), category: id.split('/')[0],
    description: id.startsWith('examples/') ? 'An example composition to explore and adapt.' : 'Preview this email in your chosen style.',
    href: `/${id}${query(theme)}`, preview: `/frame/email/${id}${query(theme)}`,
  }));
  return page(intro('Complete designs', 'Your email library.', 'Explore emails, automated flows, and examples. Open any design to take a closer look.') + library(entries, theme, 'emails'), { theme, path: '/emails', title: 'Emails' });
}

function recipesIndex(theme) {
  const entries = [...loadRecipes({ fresh: true })].map(([id, r]) => ({ name: r.name, description: r.description, category: r.suggestedTheme || DEFAULT_THEME, label: 'Campaign recipe', href: `/recipes/${id}${query(theme)}`, preview: `/frame/recipe/${id}${query(theme)}` }));
  return page(intro('Ready-made compositions', 'A head start for every send.', 'Explore campaign recipes, from a first welcome to a new launch. Choose a style and find your next email.') + library(entries, theme, 'recipes'), { theme, path: '/recipes', title: 'Campaign recipes' });
}

function recipePage(id, theme) {
  const recipe = loadRecipes({ fresh: true }).get(id);
  if (!recipe) return null;
  const chosen = theme || recipe.suggestedTheme || DEFAULT_THEME;
  return page(preview(`/frame/recipe/${id}${query(chosen)}`, recipe.name, { theme: chosen, back: '/recipes', backLabel: 'All recipes', description: recipe.description }), { theme: chosen, path: `/recipes/${id}`, title: recipe.name });
}

function componentsIndex(registry, theme) {
  const entries = registry.all().map(e => ({ name: e.meta.name, description: e.meta.description, category: e.category, label: `${Object.keys(e.meta.variants).length} variants`, href: `/components/${e.id}${query(theme)}`, preview: `/frame/component/${e.id}${query(theme)}` }));
  return page(intro('The building blocks', 'Small pieces. Endless possibilities.', 'Find a header, hero, product grid, or finishing touch. Explore each component to compare its variants.') + library(entries, theme, 'components'), { theme, path: '/components', title: 'Components' });
}

function componentPage(registry, id, theme) {
  if (!registry.has(id)) return null;
  const e = registry.get(id);
  const chosen = theme || DEFAULT_THEME;
  const required = Object.entries(e.meta.fields).filter(([, v]) => typeof v === 'object' && v.required).map(([k]) => k);
  const details = `<details class="notes"><summary>Component fields and settings</summary><p>Component: <code>${escapeHtml(e.id)}</code></p><p>Required fields: ${required.map(escapeHtml).join(', ') || 'None'}</p><p>Settings: ${Object.keys(e.meta.settings).map(escapeHtml).join(', ') || 'None'}</p></details>`;
  const variants = Object.entries(e.meta.variants).map(([v, def]) => `<article class="variant"><h2>${escapeHtml(title(v))}</h2><p>${escapeHtml(def.description)}</p><a class="back-link" href="/frame/component/${e.id}${query(chosen)}&amp;variant=${encodeURIComponent(v)}" target="_blank" rel="noopener">Open variant HTML ↗</a><div class="preview-stage"><iframe class="email-preview" src="/frame/component/${e.id}${query(chosen)}&amp;variant=${encodeURIComponent(v)}" title="${escapeHtml(e.meta.name)} — ${escapeHtml(v)} variant" sandbox="allow-same-origin" loading="lazy" width="600"></iframe></div></article>`).join('');
  return page(`<a class="back-link" href="/components${query(chosen)}">&larr; All components</a>${intro(e.category, e.meta.name, e.meta.description)}<section data-preview><div class="toolbar"><div class="tabs" aria-label="Preview width"><button data-width="600" aria-pressed="true">Desktop · 600</button><button data-width="375" aria-pressed="false">Phone · 375</button></div><div class="filters">${styles(chosen)}</div></div>${variants}</section>${details}`, { theme: chosen, path: `/components/${id}`, title: e.meta.name });
}
const server = http.createServer(async (req, res) => {
  const parsed = new URL(req.url, 'http://localhost');
  const url = decodeURIComponent(parsed.pathname);
  const theme = parsed.searchParams.get('theme') || undefined;
  const variant = parsed.searchParams.get('variant') || undefined;

  if (url === '/__reload') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
    res.write('retry: 500\n\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

  const send = (status, body) => {
    res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(body);
  };

  try {
    if (url.startsWith('/studio/')) {
      const asset = url.slice('/studio/'.length);
      if (!['gallery.css', 'studio.css', 'studio.js'].includes(asset)) return send(404, page('<h1>Page not found</h1>'));
      res.writeHead(200, { 'Content-Type': asset.endsWith('.css') ? 'text/css; charset=utf-8' : 'text/javascript; charset=utf-8' });
      return res.end(fs.readFileSync(path.join(__dirname, 'gallery', asset)));
    }
    if (url.startsWith('/brands/')) {
      const match = /^\/brands\/([a-z0-9]+(?:-[a-z0-9]+)*)(?:\/(.*))?$/.exec(url);
      if (!match) return send(404, page('<p>No such collection.</p>'));
      const [, collectionId, requested] = match;
      if (requested === undefined) {
        res.writeHead(302, { Location: `/brands/${collectionId}/` });
        return res.end();
      }
      const artifact = requested || 'index.html';
      // Only generated gallery artifacts are public, never source files or arbitrary paths.
      if (!/^(?:index\.html|gallery\.(?:css|js)|manifest\.json|[a-z0-9-]+\/(?:blocks|emails)\/[a-z0-9-]+\.html)$/.test(artifact)) {
        return send(404, page('<p>No such gallery file.</p>'));
      }
      const file = path.join(DIST_DIR, collectionId, 'gallery', artifact);
      if (!fs.existsSync(file)) return send(404, page(`<h2>Gallery not built</h2><p>Run <code>npm run gallery:brand -- ${escapeHtml(collectionId)}</code>, then refresh this page.</p>`));
      const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json' }[path.extname(file)];
      res.writeHead(200, { 'Content-Type': `${mime}; charset=utf-8`, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      return res.end(fs.readFileSync(file));
    }
    if (url === '/') return send(200, homePage(theme));
    if (url === '/emails') return send(200, emailsIndex(theme));
    if (url === '/recipes') return send(200, recipesIndex(theme));
    if (url === '/components') return send(200, componentsIndex(loadRegistry({ fresh: true }), theme));

    if (url.startsWith('/recipes/')) {
      const html = recipePage(url.slice('/recipes/'.length), theme);
      return html ? send(200, html) : send(404, page(`<p>No such recipe.</p>`));
    }
    if (url.startsWith('/components/')) {
      const html = componentPage(loadRegistry({ fresh: true }), url.slice('/components/'.length), theme);
      return html ? send(200, html) : send(404, page(`<p>No such component.</p>`));
    }

    if (url.startsWith('/frame/')) {
      const { tokens, errors } = loadTokens();
      if (errors.length) return send(200, page(`<pre>${escapeHtml(errors.join('\n'))}</pre>`));
      const [, , kind, ...rest] = url.split('/');
      const id = rest.join('/');
      if (kind === 'email') {
        if (!listEmails({ examples: true }).includes(id)) return send(404, page('<p>No such email.</p>'));
        return send(200, await renderEmailPage(id, theme));
      }
      if (kind === 'recipe') {
        const { html, mjml, mjmlErrors } = await renderRecipe(id, undefined, tokens, { theme, fresh: true });
        const { errors: checkErrors, warnings } = runChecks(html, brand, mjml);
        return send(200, withBanner(html, id, [...mjmlErrors.map((e) => `mjml: ${e.formattedMessage || e.message}`), ...checkErrors.map((m) => `check: ${m}`), ...warnings.map((m) => `warning: ${m}`)]));
      }
      if (kind === 'component') {
        const { html, mjmlErrors } = await renderComponent(id, tokens, { theme, variant, fresh: true });
        return send(200, mjmlErrors.length ? withBanner(html, id, mjmlErrors.map((e) => `mjml: ${e.formattedMessage || e.message}`)) : html);
      }
      return send(404, page('<p>Unknown frame.</p>'));
    }

    const email = url.slice(1);
    if (!listEmails({ examples: true }).includes(email)) return send(404, page(`<p>No such email: ${escapeHtml(email)}</p>`));
    return send(200, page(preview('/frame/email/' + email + query(theme), title(email.split('/').pop()), { theme, back: '/emails', backLabel: 'All emails', description: 'Explore this email at desktop and phone sizes, or download its HTML.' }), { theme, path: '/emails/' + email, title: title(email.split('/').pop()) }));
  } catch (err) {
    send(500, page(`<h2>Render failed</h2><pre>${escapeHtml(err.message)}</pre>`));
  }
});

let timer;
function scheduleReload() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    for (const res of clients) res.write('data: reload\n\n');
  }, 100);
}
for (const dir of ['components', 'layouts', 'tokens', 'themes', 'sections', 'recipes', 'variables', ...EMAIL_DIRS, ...EXAMPLE_DIRS]) {
  const full = path.join(ROOT, dir);
  if (fs.existsSync(full)) fs.watch(full, { recursive: true }, scheduleReload);
}

server.listen(PORT, () => {
  const target = firstEmail ? `/${firstEmail}` : '/';
  console.log(`Previewing "${brand}" at http://localhost:${PORT}${target}  (Ctrl+C to stop)`);
});
