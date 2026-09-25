'use strict';
const style = document.querySelector('#style');
style?.addEventListener('change', () => {
  const url = new URL(location.href);
  url.searchParams.set('theme', style.value);
  location.assign(url);
});

const library = document.querySelector('[data-library]');
if (library) {
  const entries = [...library.querySelectorAll('[data-entry]')];
  const search = document.querySelector('#search');
  const category = document.querySelector('#category');
  const more = document.querySelector('#more');
  const params = new URLSearchParams(location.search);
  search.value = params.get('q') || '';
  if ([...category.options].some(o => o.value === params.get('category'))) category.value = params.get('category');
  let limit = 9;
  function render() {
    const query = search.value.trim().toLowerCase();
    const matching = entries.filter(e => e.dataset.search.includes(query) && (category.value === 'all' || category.value === e.dataset.category));
    const visible = new Set(matching.slice(0, limit));
    entries.forEach(e => {
      e.hidden = !visible.has(e);
      const frame = e.querySelector('iframe');
      if (!e.hidden && !frame.src) frame.src = frame.dataset.src;
    });
    document.querySelector('#result-count').textContent = `Showing ${Math.min(limit, matching.length)} of ${matching.length} designs`;
    document.querySelector('#empty').hidden = matching.length !== 0;
    more.hidden = matching.length <= limit;
    const url = new URL(location.href);
    for (const [key, value] of [['q', search.value], ['category', category.value === 'all' ? '' : category.value]]) {
      if (value) url.searchParams.set(key, value); else url.searchParams.delete(key);
    }
    history.replaceState(null, '', url);
    resize();
  }
  function resize() {
    entries.filter(e => !e.hidden).forEach(e => {
      const thumb = e.querySelector('.thumbnail');
      thumb.style.setProperty('--preview-scale', Math.max(.1, (thumb.clientWidth - 28) / 600));
    });
  }
  search.addEventListener('input', () => { limit = 9; render(); });
  category.addEventListener('change', () => { limit = 9; render(); });
  document.querySelector('#reset').addEventListener('click', () => { search.value = ''; category.value = 'all'; limit = 9; render(); search.focus(); });
  more.addEventListener('click', () => {
    const previous = new Set(entries.filter(e => !e.hidden));
    limit += 9; render();
    entries.find(e => !e.hidden && !previous.has(e))?.querySelector('a').focus();
  });
  new ResizeObserver(resize).observe(library);
  render();
}

document.querySelectorAll('[data-preview]').forEach(viewer => {
  const frames = viewer.querySelectorAll('.email-preview');
  const fit = frame => {
    try {
      const body = frame.contentDocument.body;
      if (body) frame.style.height = `${Math.max(100, body.scrollHeight + 24)}px`;
    } catch { /* Keep the usable default height if a document is unavailable. */ }
  };
  frames.forEach(frame => frame.addEventListener('load', () => {
    fit(frame);
    if (frame.contentDocument?.body) new ResizeObserver(() => fit(frame)).observe(frame.contentDocument.body);
  }));
  viewer.querySelectorAll('[data-width]').forEach(button => button.addEventListener('click', () => {
    viewer.querySelectorAll('[data-width]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    frames.forEach(frame => { frame.style.width = `${button.dataset.width}px`; });
  }));
});
