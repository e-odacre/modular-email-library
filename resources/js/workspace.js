const getPreference = key => { try { return localStorage.getItem(key); } catch { return null; } };
const setPreference = (key, value) => { try { localStorage.setItem(key, value); return true; } catch { return false; } };
function notify(message) {
    const status = document.querySelector('#workspace-status');
    if (!status) return;
    status.replaceChildren(Object.assign(document.createElement('div'), { className: 'alert alert-info text-sm', textContent: message }));
    status.hidden = false;
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => { status.hidden = true; }, 4000);
}
document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dim' ? 'light' : 'dim';
    document.documentElement.dataset.theme = theme;
    setPreference('modular-ui-theme', theme);
});
document.querySelector('#style')?.addEventListener('change', event => {
    const url = new URL(location.href);
    url.searchParams.set('theme', event.target.value);
    location.assign(url);
});
const library = document.querySelector('[data-library]');
if (library) {
    const entries = [...library.querySelectorAll('[data-entry]')];
    const search = library.querySelector('#search');
    const category = library.querySelector('#category');
    const more = library.querySelector('#more');
    const grid = library.querySelector('[data-grid]');
    const params = new URLSearchParams(location.search);
    search.value = params.get('q') || '';
    if ([...category.options].some(option => option.value === params.get('category'))) category.value = params.get('category');
    let limit = 9;
    let view = getPreference('modular-library-view') === 'list' ? 'list' : 'grid';
    function resize() {
        entries.filter(entry => !entry.hidden).forEach(entry => {
            const thumbnail = entry.querySelector('.design-thumbnail');
            thumbnail?.style.setProperty('--preview-scale', Math.max(.1, (thumbnail.clientWidth - 32) / 600));
        });
    }
    function render() {
        const matching = entries.filter(entry => entry.dataset.search.includes(search.value.trim().toLowerCase()) && (category.value === 'all' || entry.dataset.category === category.value));
        const visible = new Set(matching.slice(0, limit));
        grid.dataset.view = view;
        entries.forEach(entry => {
            entry.hidden = !visible.has(entry);
            const frame = entry.querySelector('iframe');
            if (!entry.hidden && view === 'grid' && frame && !frame.getAttribute('src')) frame.src = frame.dataset.src;
        });
        library.querySelector('#result-count').textContent = 'Showing ' + Math.min(limit, matching.length) + ' of ' + matching.length + ' designs';
        library.querySelector('#empty').hidden = matching.length !== 0;
        more.hidden = matching.length <= limit;
        library.querySelectorAll('[data-library-view]').forEach(button => {
            button.setAttribute('aria-pressed', String(button.dataset.libraryView === view));
            button.classList.toggle('btn-active', button.dataset.libraryView === view);
        });
        const url = new URL(location.href);
        for (const [key, value] of [['q', search.value], ['category', category.value === 'all' ? '' : category.value]]) {
            if (value) url.searchParams.set(key, value); else url.searchParams.delete(key);
        }
        history.replaceState(null, '', url);
        resize();
    }
    search.addEventListener('input', () => { limit = 9; render(); });
    category.addEventListener('change', () => { limit = 9; render(); });
    library.querySelector('#reset').addEventListener('click', () => { search.value = ''; category.value = 'all'; limit = 9; render(); search.focus(); });
    more.addEventListener('click', () => { const oldLimit = limit; limit += 9; render(); entries.filter(entry => !entry.hidden)[oldLimit]?.querySelector('a')?.focus(); });
    library.querySelectorAll('[data-library-view]').forEach(button => button.addEventListener('click', () => { view = button.dataset.libraryView; setPreference('modular-library-view', view); render(); }));
    new ResizeObserver(resize).observe(grid);
    render();
}
document.querySelectorAll('[data-preview]').forEach(viewer => {
    const frames = viewer.querySelectorAll('.email-preview');
    const fit = frame => {
        try {
            const body = frame.contentDocument?.body;
            if (body) frame.style.height = Math.max(300, body.getBoundingClientRect().height + 20) + 'px';
        } catch {}
    };
    frames.forEach(frame => frame.addEventListener('load', () => {
        fit(frame);
        try {
            frame.contentDocument?.fonts?.ready.then(() => fit(frame));
            frame.contentDocument?.querySelectorAll('img').forEach(image => image.addEventListener('load', () => fit(frame)));
        } catch {}
    }));
    viewer.querySelectorAll('[data-width]').forEach(button => button.addEventListener('click', () => {
        viewer.querySelectorAll('[data-width]').forEach(other => { other.setAttribute('aria-pressed', String(other === button)); other.classList.toggle('btn-active', other === button); });
        frames.forEach(frame => { frame.style.width = button.dataset.width + 'px'; requestAnimationFrame(() => fit(frame)); });
    }));
});
document.querySelectorAll('[data-copy-target]').forEach(button => button.addEventListener('click', async () => {
    const target = document.getElementById(button.dataset.copyTarget);
    try {
        if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(target.value);
        else { target.focus(); target.select(); if (!document.execCommand('copy')) throw new Error('manual'); }
        notify('Copied to clipboard.');
    } catch { target.focus(); target.select(); notify('Text selected. Press Ctrl+C or Command+C to copy.'); }
}));
document.querySelectorAll('[data-download-target]').forEach(button => button.addEventListener('click', () => {
    const target = document.getElementById(button.dataset.downloadTarget);
    const url = URL.createObjectURL(new Blob([target.value], { type: 'text/markdown;charset=utf-8' }));
    const link = Object.assign(document.createElement('a'), { href: url, download: button.dataset.filename });
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}));
const briefForm = document.querySelector('[data-brief-form]');
if (briefForm) {
    const fields = [...briefForm.querySelectorAll('[name]')].filter(field => field.name !== '_token');
    const key = 'modular-email-brief';
    if (briefForm.dataset.restore === 'true') {
        try {
            const saved = JSON.parse(getPreference(key) || '{}');
            const params = new URLSearchParams(location.search);
            fields.forEach(field => { if (!params.has(field.name) && typeof saved[field.name] === 'string') field.value = saved[field.name]; });
        } catch {}
    }
    briefForm.addEventListener('input', () => {
        const saved = setPreference(key, JSON.stringify(Object.fromEntries(fields.map(field => [field.name, field.value]))));
        const status = document.querySelector('[data-brief-status]');
        if (status) status.textContent = saved ? 'Brief saved in this browser' : 'Browser storage unavailable; keep this page open';
    });
    document.querySelector('[data-reset-brief]')?.addEventListener('click', () => {
        try { localStorage.removeItem(key); } catch {}
        location.assign(briefForm.action);
    });
}
// A source change should not erase an in-progress brief.
let revision;
let checking = false;
if (!briefForm) setInterval(async () => {
    if (document.hidden || checking) return;
    checking = true;
    try {
        const response = await fetch(document.body.dataset.revisionUrl, { cache: 'no-store' });
        if (!response.ok) return;
        const next = (await response.json()).revision;
        if (revision && next !== revision) location.reload();
        revision = next;
    } catch {} finally { checking = false; }
}, 5000);
