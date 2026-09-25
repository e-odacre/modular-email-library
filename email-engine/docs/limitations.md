# Limitations

Read this before sending anything. It lists what has not been verified and what is only an approximation.

## What has been tested

One session, 2026-09-21, with `examples/client-test.mjml` (the placeholder brand, eight numbered blocks): built, pasted into a Klaviyo custom HTML template, sent with Klaviyo's preview test send, and viewed in **Gmail on the web, on a desktop, in light mode**, from a screenshot. Seen working there:

- The template saved as an HTML template and the send went through. The Klaviyo tags resolved in the test send: first name, postal address, unsubscribe, manage preferences and view in browser.
- Block 2 (photo behind a hero), the three buttons of block 3, and the desktop layout of blocks 4 and 5 (image left of text, four tiles in a row).
- `email/desktop-only` was visible and `email/mobile-only` was hidden on the desktop.

Also seen:

- Klaviyo's template library preview does not resolve tags: it showed the raw `{{ first_name|default:'Friend' }}`. The preview test send did resolve them.
- The hero text is white with no overlay. Over the light grey placeholder image it is close to unreadable. Check it with a real photo before using it.

## Not tested in real email clients

Everything else is unverified. **Not yet seen: Apple Mail, Outlook desktop, Gmail on a phone or with a non-Google account, any phone at all, any dark mode, and the fallback when a profile has no first name.** The rest was built against MJML's strict validation and checked by inspecting the generated HTML, and the components' `compat` notes describe how those clients are known to behave, not what was observed here. Expect surprises in:

- **Dark mode.** The `dm-*` selectors were written against MJML's output structure and never seen in a client. Apple Mail and iOS Mail honor `prefers-color-scheme`, Gmail apps only partly (they may recolor on their own), Outlook desktop ignores it. Images are never recolored.
- **Outlook desktop.** Rounded corners, box shadows and `border-radius` are ignored (square). Background images rely on the VML that MJML generates, and `email/outlook-safe-button` on hand-written VML, neither has been seen in Outlook. Dashed and dotted borders can render solid.
- **Mobile behavior.** `mobileColumns`, `mobileAlignment`, `hideOnMobile`, `hideOnDesktop` and reversed columns are media queries and CSS classes. Outlook desktop and Gmail on non-Google accounts ignore them.
- **Visual quality.** Layouts were checked structurally, not by eye in a browser or a client. Spacing, proportions and the look of each theme need a human review.

## Not tested in Klaviyo

- **Pasting the output into a Klaviyo custom HTML template and sending a preview has worked once**, for the client test email. Flows and campaigns sent to real audiences have not been tried.
- The tags seen resolving in that test send (see above) worked against a real account. Every other tag was checked against Klaviyo's help center only. [Variables](variables.md) marks each entry as verified or not.
- **Cart and order variables depend on your ecommerce integration.** Klaviyo's own pages show two shapes (`item.product.title` and `item.title`). The defaults are the Shopify ones, copy the exact names from your event preview. `cart.checkout_url` is not confirmed by Klaviyo's docs at all and is marked unverified.
- Klaviyo also rewrites links for click tracking. Check its UTM settings before using `email/tracking-safe-cta`, so parameters are not added twice.

## Approximations

- **Countdown timers.** A live timer is impossible in email. `promotional/countdown` places an image URL from an external timer service and always writes the end time as text. Gmail's image proxy can cache a timer image and show a stale time, and Outlook desktop shows only the first frame of an animated GIF. No service is bundled or recommended.
- **Product carousel.** Real swipeable carousels need JavaScript or fragile CSS that breaks in Gmail and Outlook. `commerce/product-carousel` is a compact static row with a view-all link.
- **FAQ.** All answers are shown, there is no accordion, for the same reason.
- **Social icons.** MJML's built-in icons are hosted by Mailjet. Pass your own `icon` URLs for production, and TikTok has no built-in icon at all.
- **Emoji** (`promotional/mystery-gift`) render differently per client and may be monochrome in Outlook desktop.
- **Tables** (`comparison/*`) shrink on phones rather than stack, so keep them to 2 to 4 columns and short cell text.

## Size

Gmail clips messages over about 102 KB. The 12 recipes render between 32 KB and 85 KB with their preview content (`welcome` 85 KB, `black-friday` 81 KB), so an email with real content and more sections can reach the clip. The build warns when it does. Explicit typography attributes on every text element are the main cost.

## Scope

- No visual editor or drag-and-drop builder. The component metadata, node format and remix API are what a builder would sit on top of.
- Only the placeholder brand exists. Real brand token files are waiting on real brand assets, and building a brand with placeholder values fails on purpose.
- Only Klaviyo is supported, delivery is manual paste, and only full emails (no hybrid-editor snippets).
- Themes are style-only by design: a seasonal theme cannot bring its own palette, it emphasizes brand color roles instead.
