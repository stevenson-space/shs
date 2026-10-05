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
redirects `.html` URLs to those canonical paths. Use normal HTML anchors to
navigate to these pages from the Vue app; they are not Vue Router routes.

Once a visitor's browser has the website's service worker, it precaches both
pages and serves `/app/privacy` and `/app/support` from that cache (Workbox
matches clean URLs to the `.html` files), including offline. The service worker
also excludes these routes from its generic navigation handler, so a request it
cannot answer, such as `/app/privacy/` while offline, fails instead of showing
the unrelated Vue app shell. Because precached pages are served cache-first, a
browser with an older worker shows the previous copy until the worker updates.

## Preview and maintenance

Run `npm --ignore-scripts run build`, then `npx vite preview --host 127.0.0.1`.
Check both `/app/privacy` and `/app/support`, including reloads, cross-links,
mobile layout, light and dark mode, and use with JavaScript disabled. If the
browser has visited the website on that port, clear its service worker or use a
fresh profile so the new build is not hidden by the precache. This build command
skips the unrelated prebuild calendar scraper and uses the repository's existing
data.
The normal deployment build can continue using `npm run build`.

Vite's development server serves the public HTML at the full
`/app/privacy.html` and `/app/support.html` paths. Use the production
preview to check the clean URLs used by Cloudflare Pages.

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
  The support page lists an email address; confirm whether any storefront you
  distribute in requires more.
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
App Privacy answers in App Store Connect. Those app and submission changes are
separate from this website change.

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
