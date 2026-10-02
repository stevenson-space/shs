# [stevenson.space](https://stevenson.space)
Beautiful and practical agenda management tool for SHS students

![media-preview-image](https://user-images.githubusercontent.com/31457361/190948845-b6870bef-9186-4971-b398-47616f503c6b.png)

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Setting up your .env file
Duplicate the `.env-template` and rename the duplicate to `.env`. This will keep the template, and give you a personal development environment that won't get commited to github.

## Static data API

`ingest/api.ts` generates a read-only JSON API at build time into `public/api/v1/`, which
Vite copies into `dist/`. These are plain files on the CDN, not Worker routes, so serving
them costs nothing.

| Endpoint | Contents |
| --- | --- |
| `/api/v1/signature.json` | Just the signature and lunch window — cheap to poll |
| `/api/v1/schedules.json` | Schedules and their period times, with `dates` resolved |
| `/api/v1/schedule-dates.json` | The raw schedule name → dates map |
| `/api/v1/lunch.json` | One menu per school day in a rolling window |

Every response carries `version`, `generatedAt`, and a `signature`. Each data endpoint
carries only its own section's hash (`"signature": "52e9262b…"`), while `signature.json`
carries all three so a client can poll it:

```json
"signature": {
  "schedules": "52e9262b…",
  "scheduleDates": "8de5ff53…",
  "lunch": "c147cb88…"
}
```

Each value is a SHA-256 over the section's **JSON data** in canonical form
([RFC 8785](https://www.rfc-editor.org/rfc/rfc8785)), so reformatting a file or reordering
its keys never moves a hash. `schedules` and `scheduleDates` hash the data exactly as
served. `lunch` hashes every menu across `validRange` rather than just the window's days,
so it moves whenever any menu the API could serve changes: the menu data in
`src/data/lunch-rotating/`, the rotation in `src/utils/food/rotating-map.ts`, or which days
are school days (adding a no-school day drops a menu).
A client caches the hashes it last saw and only refetches a section whose hash moved.

### The lunch window

`lunch.json` covers one week behind and three weeks ahead of the build date (the current
date in the school's time zone, America/Chicago, wherever the build runs), skipping
weekends, no-school days, and summer. The site is rebuilt nightly, so the window advances
on its own.

Because the lunch signature hashes the whole valid range rather than the window, it does *not*
change when the window slides. That is deliberate — it separates "the menu data changed" from "I am running
out of days". For the second, use `window.refreshAfter`: refetch once the current date
reaches it, which is the point where only a week of future menus is left.

```json
"window": {
  "start": "2026-09-13",
  "end": "2026-10-11",
  "refreshAfter": "2026-10-04"
}
```

`end` is clamped to `validRange`, the range the rotating menu data actually covers. Once
`end` reaches `validRange.end`, the source data is exhausted and refetching will not produce
more days until `src/data/lunch-rotating/` is updated, so `refreshAfter` is `null` and only a
change to the lunch signature is worth refetching for. If the window falls outside that range
entirely, `start` and `end` are `null` and `days` is empty; before the school year,
`refreshAfter` is the date the first menu enters the window.

### Regenerating

```
npm run generate-api
```

This also runs as part of `npm run dev` and `npm run prebuild`. Pass `--today` to anchor the
window somewhere other than the real current date, which is useful for inspecting a past or
future window:

```
npx tsx ingest/api.ts --today 2026-10-15
```

The output is generated, not committed — `public/api/` is gitignored.

## Contributing
Interested in contributing? Check out the [documentation](https://github.com/stevenson-space/shs/wiki) (WIP)
