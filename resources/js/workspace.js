// Preserve source-change refresh without a second development web server.
let revision;
let checking = false;
setInterval(async () => {
    if (document.hidden || checking) return;
    checking = true;
    try {
        const response = await fetch(document.body.dataset.revisionUrl, { cache: 'no-store' });
        if (!response.ok) return;
        const next = (await response.json()).revision;
        if (revision && next !== revision) location.reload();
        revision = next;
    } catch { /* A temporary connection failure should leave the current preview usable. */ }
    finally { checking = false; }
}, 4000);
