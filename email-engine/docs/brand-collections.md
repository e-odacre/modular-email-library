# Brand design collections

A collection is a brand-local set of reusable block presets and complete email compositions. It uses the same `component`, `data`, `variant`, and `settings` nodes as the main library. Brand copy and public asset URLs stay in `brands/<brand>/`; the renderer and gallery work for any collection with the same contract.

## Browse SanEcoTec

```powershell
npm run gallery:brand -- sanecotec
# Faster rebuild of one style:
npm run gallery:brand -- sanecotec --theme minimal
```

Open `dist/sanecotec/gallery/index.html`. It works from disk without starting a server. Search, select a category, switch styles, and open a design at desktop or phone width. A block is framed by a header/footer for context; its copied composition contains only that block's nodes. Full-email compositions contain an ordered list of block IDs. Each preview offers an HTML download, source references, and image-format warnings where applicable.

For localhost, run `npm run preview` and open `http://localhost:3000/brands/sanecotec/`. The server home page also links to available brand collections. The gallery serves generated files: after changing collection content, run `npm run gallery:brand -- sanecotec` again and refresh the browser.

The gallery's controls are browser UI; they are not inserted into the email HTML. The preview iframe is sandboxed. Draft output and browser-review artifacts stay in gitignored `dist/`.

## Edit a block or email

SanEcoTec groups presets by purpose in `brands/sanecotec/collection/`. The starting catalog contains 48 block presets and 12 email recipes. It leaves the original four `.mjml` includes and their `preview.js` working unchanged.

Change content in a preset's nodes, styling in its settings, or the order of blocks in `collection/emails.js`. Rebuild the gallery afterwards. There is no visual editing or drag-and-drop functionality.

To compose another email, add an entry to the brand catalog's `emails` array:

```js
{
  id: 'pool-reading-list',
  name: 'Pool reading list',
  category: 'Complete emails',
  description: 'Pool introduction and useful reading.',
  preheader: 'A few resources for your pool team.',
  blockIds: ['header-left', 'industry-pools', 'editorial-digest', 'cta-peach', 'footer-minimal'],
}
```

From code:

```js
const { loadCollection, composeItem, renderCollectionItem } = require('./scripts/lib/brand-collection');
const collection = loadCollection('sanecotec');
const { nodes } = composeItem(collection, 'emails', 'welcome');
const { html, warnings } = await renderCollectionItem(collection, 'emails', 'welcome', 'minimal');
```

`composeItem` returns a fresh node copy. Pass those nodes to `cn()` inside a base-layout template using the same brand's tokens. Gallery JSON is a composition description, not a standalone HTML file or a Klaviyo template.

## Add another brand later

Create `brands/<brand>/catalog.js` and a complete token JSON file in that folder. Use a lowercase, hyphenated brand ID. Do not copy SanEcoTec's content or asset URLs into the shared renderer.

The catalog exports:

- `name`, optional `description` and `galleryTitle`.
- `tokenFile`: a JSON filename inside the same brand folder. Every required token must be present; unresolved values stay marked.
- `themes`: a non-empty list of existing library theme IDs.
- `header` and `footer`: default block IDs with the corresponding `role`.
- `blocks`: objects with unique `id`, `name`, `category`, `description`, `nodes`, and HTTPS `sources`. Frame blocks also declare `role: 'header'` or `'footer'`.
- `emails`: objects with unique `id`, `name`, `category`, `description`, `preheader`, and `blockIds`. Start with a header and finish with a footer.
- Optional `notes`: short draft-review notes shown in the gallery.

Run `npm run gallery:brand -- <brand>`. It selects only that brand's catalog and tokens. The normal all-brand build and generic component registry are unchanged. Folder separation prevents accidental content mixing in this workflow; it is not an access-control boundary.

## Checks and limits

Each preview compiles strict MJML and runs the existing output checks. Tests compile SanEcoTec's entire collection in every offered theme, check image alt text and the clipping budget, reject broken references, and verify that drafts remain excluded from production discovery.

Catalog code is trusted repository code, like existing recipe files; this is not an importer for untrusted JavaScript. Text fields follow the existing library's HTML behavior. Keep only public brand content in version control.

Browser layouts are not inbox certification. Review copy, resolve brand tokens, confirm durable PNG/JPEG assets, set the right Klaviyo organization details, and test actual sends before use. MJML emits web-font references for recognized fonts; email clients may still use the supplied Arial/Helvetica fallbacks.
