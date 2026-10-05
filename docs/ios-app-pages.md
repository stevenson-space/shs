# Stevenson Space iOS app pages

The iOS app's public pages are standalone HTML, separate from the Vue web app:

| Page | Public URL | Source |
| --- | --- | --- |
| Privacy | https://stevenson.space/app/privacy | `public/app/privacy.html` |
| Support | https://stevenson.space/app/support | `public/app/support.html` |

Shared styles live in `public/app/pages.css`. Neither page needs JavaScript,
authentication, external fonts, or the web app's analytics initialization. The
header reuses the crest from `public/favicon/`, the system font matches the iOS
app, and the colors are CSS custom properties with a dark-mode override. Check
any new color pair against WCAG AA in both color schemes.

Cloudflare Pages serves the HTML files at the extensionless URLs above and
redirects `.html` URLs to those canonical paths. Use the extensionless URLs in
App Store Connect, the canonical tags, and links between the pages. A small
Vite development middleware serves `/app/privacy` and `/app/support` from their
HTML files without redirecting, including requests with query strings.
Link to these pages from the Vue app with normal HTML anchors; they are not Vue
Router routes. The local Vite servers show the blank Vue app shell for a
trailing-slash URL such as `/app/privacy/`.

`public/_redirects` tells Cloudflare Pages to send `/app` and `/app/` to
`/app/support` with a temporary (302) redirect, so a later `/app` landing page
would not be blocked by cached redirects. Vite's local servers ignore this file,
so locally `/app` shows the blank Vue app shell.

Once a visitor's browser has the website's service worker, `/app/privacy` and
`/app/support` (including their `.html` aliases and query strings) use a dedicated
network-first cache. The HTML is excluded from precaching so online visits fetch
current content; offline visits can use a copy previously loaded at that URL.
The shared stylesheet and crest remain precached. The service worker also
excludes everything under `/app` from its generic navigation handler, so a
request it cannot answer, such as `/app?ref=appstore` or `/app/privacy/` while
offline, fails instead of showing the unrelated Vue app shell. Online, `/app`
reaches the Cloudflare redirect. Existing visitors get this behavior once the
updated service worker activates.

## Preview and maintenance

Run `npm --ignore-scripts run build`, then `npx vite preview --host 127.0.0.1`.
Check both `/app/privacy` and `/app/support`, including reloads, cross-links,
mobile layout, light and dark mode, and use with JavaScript disabled. If the
browser has visited the website on that port, clear its service worker or use a
fresh profile when checking service-worker installation and updates. This build command
skips the unrelated prebuild calendar scraper and uses the repository's existing
data.
The normal deployment build can continue using `npm run build`.

Both `npm run dev` and the production preview support the clean URLs used by
Cloudflare Pages. The `.html` files remain accessible locally.

The privacy copy was adapted from the iOS repo's `docs/privacy-policy.md` and
checked against its implementation. The published page adds an "At a glance"
summary and a few clarifications that are not yet in that Markdown copy; update
both together. Support instructions name controls exactly as the app shows them.
Maintain the published HTML when the released app's behavior changes; there is
no build dependency on that repo.
Support uses `admin@stevenson.space`; privacy questions and deletion requests use
`privacy@stevenson.space`. Keep both monitored addresses and the correspondence
policy current.

## Apple guidance reviewed on October 4, 2026

- [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/):
  1.5 requires an easy contact method in the app and at its Support URL;
  2.1(a) requires working URLs without empty or placeholder pages; 2.3 requires
  accurate metadata; 5.1.1(i) requires a privacy link both in App Store Connect
  and easily accessible inside the app, with data uses, sharing protections,
  retention, deletion, and consent withdrawal explained.
- [App privacy metadata](https://developer.apple.com/help/app-store-connect/reference/app-information/app-privacy/):
  a publicly accessible Privacy Policy URL is required for every app.
- [Platform version information](https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information/):
  the Support URL is required and must lead to actual contact information
  (legal address, email address, telephone number) as local law may require.
  The app is distributed only in the United States, where no law found
  requires a free app's support page to list a postal address or phone number,
  so the support email meets this requirement. COPPA would require the
  operator's name, address, telephone number, and email address in the privacy
  policy ([16 CFR 312.4(d)](https://www.law.cornell.edu/cfr/text/16/312.4)),
  but only for an app [directed to children under 13 or that knowingly collects
  their personal information](https://www.law.cornell.edu/cfr/text/16/312.3).
  Revisit this before distributing outside the United States or to younger
  children.
- [EU Digital Services Act trader requirements](https://developer.apple.com/help/app-store-connect/manage-compliance-information/manage-european-union-digital-services-act-trader-requirements):
  Apple publishes an address and phone number only on EU product pages, but
  every developer must declare a trader status. An app distributed only outside
  the EU is not acting as a trader on the App Store.
- [App Privacy Details](https://developer.apple.com/app-store/app-privacy-details/):
  processing solely on-device is not collection for App Store privacy labels.
  Assess off-device data separately, including retained network metadata and
  third-party practices; local ID processing alone does not settle every answer.
- [PhotosPicker](https://developer.apple.com/documentation/photosui/photospicker):
  the picker provides access to the selected image without full-library access.
- [Keychain data protection](https://support.apple.com/guide/security/keychain-data-protection-secb0694df1a/web),
  [iCloud backup contents](https://support.apple.com/en-us/108770), and
  [managing backups](https://support.apple.com/en-us/108922): device-only Keychain
  protection prevents migration to a different device. It is not a promise that
  all ID data is excluded from backups; saved photos may be backed up.
- [TestFlight privacy](https://www.apple.com/legal/privacy/data/en/test-flight/)
  and [notification settings](https://support.apple.com/guide/iphone/change-notification-settings-iph7c3d96bab/ios)
  support the platform-service disclosures and troubleshooting steps.

Before submission, deploy the website and verify the public HTTPS URLs, add the
privacy/support contact links inside the iOS app, and enter the URLs and accurate
App Privacy answers in App Store Connect. For United States-only distribution,
declare that you are not a trader under the EU Digital Services Act. Those app
and submission changes are separate from this website change.

## Verification

Checked on October 4, 2026 against the production build and `vite preview`:

- The production build and all eight existing unit tests passed.
- Playwright (Chromium) loaded both clean URLs at 320, 390, 768, and 1440
  pixels, in light and dark mode, with JavaScript on and off. Every combination
  had the right page and stylesheet, no horizontal overflow, controls at least
  24 by 24 pixels, working reloads, header and footer cross-links,
  table-of-contents anchors, and native disclosures.
- axe-core reported no WCAG 2.2 A/AA or best-practice violations. Its only
  "needs review" items were the setup-step text, which sits on the page
  background at 15:1 or more; the token contrast ratios were calculated
  separately.
- Keyboard: the first Tab shows the skip link, which moves to the content.
  Focus then follows the visual order with a visible ring on each stop, and
  Enter opens disclosures.
- With the service worker installed, both clean URLs loaded online and offline,
  and the trailing-slash variants never showed the Vue app shell.
- iOS 27 Safari in the Simulator rendered both pages in light and dark mode,
  including anchor links. Desktop and phone screenshots were reviewed visually.
- The iOS repository was inspected without changes.
