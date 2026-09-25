/* Static, dependency-free gallery. Works directly from index.html without a server. */
'use strict';
const collection = JSON.parse(document.getElementById('collection-data').textContent);
const byId = (id) => document.getElementById(id);
const state = { kind: 'emails', category: 'all', query: '', theme: collection.themes[0], limit: 6, selected: null };
const grid = byId('grid');
const viewer = byId('viewer');
const make = (tag, className, value) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (value !== undefined) el.textContent = value;
  return el;
};

function setCategories() {
  const select = byId('category');
  select.replaceChildren(new Option('All categories', 'all'));
  [...new Set(collection.entries.filter((entry) => entry.kind === state.kind).map((entry) => entry.category))].sort().forEach((category) => select.add(new Option(category, category)));
  state.category = 'all';
}

const resizeThumbs = () => document.querySelectorAll('.thumbnail').forEach((el) => el.style.setProperty('--preview-scale', Math.max(.2, (el.clientWidth - 28) / 600)));
const observer = new ResizeObserver(resizeThumbs);
observer.observe(grid);

function render() {
  const entries = collection.entries.filter((entry) => entry.kind === state.kind && (state.category === 'all' || entry.category === state.category) && `${entry.name} ${entry.description} ${entry.category} ${entry.components.join(' ')}`.toLowerCase().includes(state.query));
  byId('result-count').textContent = `${entries.length} ${state.kind === 'emails' ? 'complete emails' : 'blocks'} · ${state.theme} style${state.kind === 'blocks' ? ' · shown with a header and footer for context' : ''}`;
  grid.replaceChildren();
  for (const entry of entries.slice(0, state.limit)) {
    const preview = entry.previews[state.theme];
    const card = make('article', 'card');
    const button = make('button', 'thumbnail');
    button.setAttribute('aria-label', `Preview ${entry.name}`);
    const frame = document.createElement('iframe');
    frame.src = preview.href;
    frame.title = `${entry.name} thumbnail`;
    frame.loading = 'lazy';
    frame.setAttribute('scrolling', 'no');
    frame.tabIndex = -1;
    frame.setAttribute('sandbox', '');
    frame.setAttribute('aria-hidden', 'true');
    button.append(frame);
    button.addEventListener('click', () => openEntry(entry));
    const meta = make('div', 'card-meta');
    meta.append(make('span', '', entry.category), make('span', '', `${Math.ceil(preview.bytes / 1024)} KB`));
    card.append(button, meta, make('h2', '', entry.name), make('p', '', entry.description));
    grid.append(card);
  }
  if (!entries.length) grid.append(make('p', '', 'No designs match. Try another search or category.'));
  byId('more').hidden = entries.length <= state.limit;
  resizeThumbs();
}

function setWidth(mobile) {
  byId('preview').style.width = mobile ? '375px' : '600px';
  byId('desktop').setAttribute('aria-pressed', String(!mobile));
  byId('mobile').setAttribute('aria-pressed', String(mobile));
}

function openEntry(entry) {
  state.selected = entry;
  const preview = entry.previews[state.theme];
  byId('viewer-category').textContent = `${entry.category} / ${state.theme}`;
  byId('viewer-title').textContent = entry.name;
  byId('viewer-description').textContent = entry.description;
  byId('preview').src = preview.href;
  byId('open-email').href = preview.href;
  byId('download').href = preview.href;
  byId('download').download = `${collection.brand}-${entry.id}-${state.theme}-draft.html`;
  byId('preview-notes').textContent = [`${Math.ceil(preview.bytes / 1024)} KB`, 'Draft review only. Client rendering and automatic recoloring are untested.', ...preview.warnings].join(' · ');
  byId('components').textContent = `Uses: ${entry.components.join(', ')}`;
  const sources = byId('source-links');
  sources.replaceChildren();
  const sourceUrls = entry.sources.length ? entry.sources : [...new Set(entry.blockIds.flatMap((id) => collection.entries.find((e) => e.kind === 'blocks' && e.id === id).sources))];
  for (const url of sourceUrls) {
    const anchor = make('a', '', url);
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    sources.append(anchor);
  }
  byId('composition').value = JSON.stringify(entry.composition, null, 2);
  byId('copy-status').textContent = '';
  setWidth(false);
  viewer.showModal();
}

for (const kind of ['emails', 'blocks']) byId(`${kind}-tab`).addEventListener('click', () => {
  state.kind = kind;
  state.limit = 6;
  for (const tab of ['emails', 'blocks']) byId(`${tab}-tab`).setAttribute('aria-pressed', String(tab === kind));
  setCategories();
  render();
});
byId('search').addEventListener('input', (event) => { state.query = event.target.value.trim().toLowerCase(); state.limit = 6; render(); });
byId('category').addEventListener('change', (event) => { state.category = event.target.value; state.limit = 6; render(); });
byId('theme').addEventListener('change', (event) => { state.theme = event.target.value; render(); });
byId('more').addEventListener('click', () => { state.limit += 6; render(); });
byId('close').addEventListener('click', () => viewer.close());
byId('desktop').addEventListener('click', () => setWidth(false));
byId('mobile').addEventListener('click', () => setWidth(true));
byId('copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(byId('composition').value);
    byId('copy-status').textContent = 'Copied.';
  } catch {
    byId('composition').focus();
    byId('composition').select();
    byId('copy-status').textContent = 'Selected. Press Ctrl+C or Command+C to copy.';
  }
});
setCategories();
render();
