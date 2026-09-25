// Shared interface for the live email studio. Email markup stays inside frames.
const { listThemes, DEFAULT_THEME } = require('./themes');
const escape = (value) => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const title = value => value.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
const query = theme => `?theme=${encodeURIComponent(theme || DEFAULT_THEME)}`;

function page(body, { theme = DEFAULT_THEME, path: here = '/', title: name = 'Email studio' } = {}) {
  const links = [['/', 'Overview'], ['/emails', 'Emails'], ['/recipes', 'Recipes'], ['/components', 'Components']];
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(name)} / Email studio</title><link rel="stylesheet" href="/studio/gallery.css"><link rel="stylesheet" href="/studio/studio.css"></head><body>
  <a class="skip-link" href="#main">Skip to content</a><header class="masthead"><a class="wordmark" href="/${query(theme)}">modular<span> / EMAIL STUDIO</span></a><nav aria-label="Main navigation">${links.map(([href, label]) => `<a href="${href}${query(theme)}" ${here === href || (href !== '/' && here.startsWith(href + '/')) ? 'aria-current="page"' : ''}>${label}</a>`).join('')}</nav><span class="draft-pill">DESIGN WORKSPACE</span></header>
  <main id="main">${body}</main><footer class="studio-footer">Modular email studio <span>Explore. Preview. Make it yours.</span></footer><script src="/studio/studio.js" defer></script><script>new EventSource('/__reload').onmessage=()=>location.reload();</script></body></html>`;
}

function intro(kicker, heading, description, aside = '') {
  return `<section class="intro"><div><p class="kicker">${escape(kicker)}</p><h1>${escape(heading)}</h1><p class="lede">${escape(description)}</p></div>${aside}</section>`;
}

function styles(theme) {
  return `<label>Style<select id="style">${listThemes().map(t => `<option value="${escape(t)}" ${t === (theme || DEFAULT_THEME) ? 'selected' : ''}>${title(t)}</option>`).join('')}</select></label>`;
}

function library(entries, theme, noun) {
  const categories = [...new Set(entries.map(e => e.category))];
  return `<section class="library" data-library><div class="toolbar"><p class="library-label">Find your starting point</p><div class="filters"><label>Search ${escape(noun)}<input id="search" type="search" placeholder="Search by name or description"></label><label>Category<select id="category"><option value="all">All categories</option>${categories.map(c => `<option value="${escape(c)}">${escape(title(c))}</option>`).join('')}</select></label>${styles(theme)}</div></div>
  <p id="result-count" class="result-count" role="status">${entries.length} ${escape(noun)}</p><div class="grid">${entries.map(e => `<article class="card" data-entry data-category="${escape(e.category)}" data-search="${escape(`${e.name} ${e.description} ${e.category}`.toLowerCase())}"><a class="thumbnail" href="${escape(e.href)}" aria-label="Explore ${escape(e.name)}"><iframe data-src="${escape(e.preview)}" title="${escape(e.name)} thumbnail" loading="lazy" tabindex="-1" aria-hidden="true" sandbox="allow-same-origin" scrolling="no"></iframe></a><div class="card-meta"><span>${escape(title(e.category))}</span><span>${escape(e.label || 'Ready to explore')}</span></div><h2><a href="${escape(e.href)}">${escape(e.name)}</a></h2><p>${escape(e.description)}</p></article>`).join('')}</div>
  <div id="empty" class="empty-state" hidden><h2>No matches found</h2><p>Try a different search or explore all categories.</p><button id="reset" class="button">Clear filters</button></div><button id="more" class="more" hidden>Show more</button><noscript><p>Enable JavaScript for thumbnail previews and filtering. You can still open every design above.</p></noscript></section>`;
}

function preview(src, name, { theme, back, backLabel, description = '', details = '' } = {}) {
  return `<a class="back-link" href="${back}${query(theme)}">&larr; ${escape(backLabel)}</a>${intro('Design preview', name, description)}
  <section data-preview><div class="toolbar"><div class="tabs" aria-label="Preview width"><button data-width="600" aria-pressed="true">Desktop · 600</button><button data-width="375" aria-pressed="false">Phone · 375</button></div><div class="filters">${styles(theme)}<a class="button" href="${escape(src)}" target="_blank" rel="noopener">Open HTML ↗</a><a class="button" href="${escape(src)}" download="${escape(name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}.html">Download HTML</a></div></div>
  <div class="preview-stage"><iframe class="email-preview" src="${escape(src)}" title="${escape(name)} preview" sandbox="allow-same-origin" width="600"></iframe></div></section>${details}`;
}

module.exports = { page, intro, library, preview, styles, query, escape, title };
