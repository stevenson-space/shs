# Stevenson Space iOS app pages

The iOS app's public pages are standalone HTML, separate from the Vue web app:

| Page | Public URL | Source |
| --- | --- | --- |
| Privacy | https://stevenson.space/app/privacy | `public/app/privacy.html` |
| Support | https://stevenson.space/app/support | `public/app/support.html` |

Shared styles live in `public/app/pages.css`. Neither page needs JavaScript,
authentication, external fonts, or the web app's analytics initialization.
Cloudflare Pages serves the HTML files at the extensionless URLs above and
redirects `.html` URLs to those canonical paths. Use normal HTML anchors to
navigate to these pages from the Vue app; they are not Vue Router routes.

The service worker excludes these routes from its generic navigation handler so
a failed request does not display the unrelated Vue app shell. The public pages
are intended to be reached online.

## Preview and maintenance

Run `npm --ignore-scripts run build`, then `npx vite preview --host 127.0.0.1`.
Check both `/app/privacy` and `/app/support`, including reloads, cross-links,
mobile layout, and use with JavaScript disabled. This build command skips the
unrelated prebuild calendar scraper and uses the repository's existing data.
The normal deployment build can continue using `npm run build`.

Vite's development server serves the public HTML at the full
`/app/privacy.html` and `/app/support.html` paths. Use the production
preview to check the clean URLs used by Cloudflare Pages.

The privacy copy was adapted from the iOS repo's `docs/privacy-policy.md` and
checked against its implementation. Maintain the published HTML when the
released app's behavior changes; there is no build dependency on that repo.
The developer confirmed `privacy@stevenson.space` is monitored for both support
and privacy questions. Keep the address and correspondence policy current.

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
  the Support URL is required and must lead to actual contact information.
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

The production build and all eight existing unit tests passed. Both clean URLs
returned their intended pages in the production preview at widths of 320, 390,
768, and 1440 pixels, without horizontal overflow or automated WCAG A/AA
violations. Reloads, cross-links, native help disclosures, and the keyboard skip
link worked, including with JavaScript disabled. Desktop and phone screenshots
were visually reviewed. The iOS repository was inspected without changes.
