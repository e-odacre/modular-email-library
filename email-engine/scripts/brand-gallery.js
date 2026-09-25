// node scripts/brand-gallery.js <brand> [--theme minimal|all]
const fs = require('node:fs');
const path = require('node:path');
const { DIST_DIR } = require('./lib/paths');
const { loadCollection, renderCollectionItem } = require('./lib/brand-collection');

const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function buildGallery(brand, requestedTheme = 'all') {
  const collection = loadCollection(brand);
  const themes = requestedTheme === 'all' ? collection.catalog.themes : [requestedTheme];
  if (themes.some((theme) => !collection.catalog.themes.includes(theme))) throw new Error(`Choose a theme: ${collection.catalog.themes.join(', ')}, all`);
  const out = path.join(DIST_DIR, brand, 'gallery');
  const manifest = { brand, name: collection.catalog.name, description: collection.catalog.description, themes, notes: collection.catalog.notes || [], placeholderIssues: collection.placeholderIssues, entries: [] };
  for (const kind of ['emails', 'blocks']) {
    for (const item of collection.catalog[kind]) {
      const entry = { id: item.id, name: item.name, category: item.category, description: item.description, kind, sources: item.sources || [], previews: {} };
      for (const theme of themes) {
        const result = await renderCollectionItem(collection, kind, item.id, theme);
        const relative = `${theme}/${kind}/${item.id}.html`;
        const file = path.join(out, relative);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, result.html);
        entry.previews[theme] = { href: relative, bytes: result.bytes, warnings: result.warnings };
        entry.components = result.components;
        entry.blockIds = result.blockIds;
      }
      entry.composition = kind === 'blocks' ? { brand, nodes: item.nodes } : { brand, blockIds: item.blockIds };
      manifest.entries.push(entry);
    }
  }
  fs.mkdirSync(out, { recursive: true });
  for (const file of ['gallery.css', 'gallery.js']) fs.copyFileSync(path.join(__dirname, 'gallery', file), path.join(out, file));
  fs.writeFileSync(path.join(out, 'manifest.json'), JSON.stringify(manifest, null, 2));
  const payload = JSON.stringify(manifest).replace(/</g, '\\u003c');
  fs.writeFileSync(path.join(out, 'index.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(manifest.name)} / Email collection</title><link rel="stylesheet" href="gallery.css"></head>
<body><header class="masthead"><a href="index.html" class="wordmark">${escape(manifest.name)}<span> / EMAIL STUDIO</span></a><span class="draft-pill">DRAFT COLLECTION</span></header>
<main><section class="intro"><div><p class="kicker">${escape(manifest.description || 'Brand collection')}</p><h1>${escape(collection.catalog.galleryTitle || 'A collection built\naround your brand.').replace(/\n/g, '<br>')}</h1><p class="lede">Explore ${collection.catalog.blocks.length} reusable blocks and ${collection.catalog.emails.length} complete emails. Choose a direction, find your starting point, make it yours.</p></div><aside><span class="edition">01 / BRAND COLLECTION</span><p>Built for ${escape(manifest.name)}.<br>Ready to explore.</p><small>Draft copy · Website imagery<br>Browser previews · Inbox testing pending</small></aside></section>
<section class="toolbar" aria-label="Collection controls"><div class="tabs" aria-label="Design type"><button id="emails-tab" aria-pressed="true">Complete emails <span>${collection.catalog.emails.length}</span></button><button id="blocks-tab" aria-pressed="false">Blocks <span>${collection.catalog.blocks.length}</span></button></div><div class="filters"><label>Find a design<input id="search" type="search" placeholder="Try sensors, newsletter, pools…"></label><label>Category<select id="category"><option value="all">All categories</option></select></label><label>Style<select id="theme">${themes.map((t) => `<option value="${escape(t)}">${escape(t)}</option>`).join('')}</select></label></div></section>
<p id="result-count" class="result-count" role="status"></p><section id="grid" class="grid" aria-label="Designs"></section><button id="more" class="more">Show more designs</button>
<details class="notes"><summary>Draft notes and brand values</summary><ul>${[...manifest.notes, ...manifest.placeholderIssues].map((n) => `<li>${escape(n)}</li>`).join('')}</ul><p>Individual blocks appear inside a header/footer frame for context. Style choices change spacing and type treatment; they are not separate designs.</p></details></main>
<dialog id="viewer" aria-labelledby="viewer-title"><div class="viewer-head"><div><p class="kicker" id="viewer-category"></p><h2 id="viewer-title"></h2></div><button id="close" aria-label="Close preview">✕</button></div><p id="viewer-description"></p><div class="viewer-actions"><div><button id="desktop" aria-pressed="true">Desktop · 600</button><button id="mobile" aria-pressed="false">Phone · 375</button></div><a id="open-email" target="_blank" rel="noopener">Open HTML ↗</a><a id="download" download>Download HTML</a></div><div id="preview-stage"><iframe id="preview" title="Selected email preview" sandbox="" width="600"></iframe></div><p id="preview-notes"></p><details><summary>Composition and sources</summary><p id="components"></p><div id="source-links"></div><textarea id="composition" aria-label="Reusable composition" readonly></textarea><button id="copy">Copy composition</button><span id="copy-status" role="status"></span></details></dialog>
<script id="collection-data" type="application/json">${payload}</script><script src="gallery.js"></script></body></html>`);
  console.log(`${manifest.name}: ${collection.catalog.blocks.length} blocks + ${collection.catalog.emails.length} emails × ${themes.length} styles`);
  console.log(`DRAFT gallery: ${path.join(out, 'index.html')}`);
  if (collection.placeholderIssues.length) console.warn('Draft brand values remain unresolved; normal production brand validation is unchanged.');
  return manifest;
}

if (require.main === module) {
  const [brand, flag, theme, ...extra] = process.argv.slice(2);
  if (!brand || (flag && flag !== '--theme') || (flag && !theme) || extra.length) {
    console.error('Usage: node scripts/brand-gallery.js <brand> [--theme <name|all>]');
    process.exitCode = 1;
  } else buildGallery(brand, theme || 'all').catch((error) => { console.error(error.message); process.exitCode = 1; });
}
module.exports = { buildGallery };
