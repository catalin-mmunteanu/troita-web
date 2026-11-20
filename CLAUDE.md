# CLAUDE.md — troita-web (www.troita.ro)

Read this first. It records decisions made with the owner; follow them unless
the owner says otherwise in the current conversation.

## What this repo is

The website for Troița, the Romanian Orthodox calendar app. Next.js 16 (App
Router, Cache Components), TypeScript, Tailwind 4, on Vercel. All in Romanian.

Two jobs, both first-class:

1. **Portal for the app** — what it does, screenshots, Play Store link,
   privacy policy (the URL Play Console uses), App Links.
2. **Free information** — calendar, fasts, and later saints, churches, feasts.
   It must be useful without the app.

Sister repo: **troita** (`catalin-mmunteanu/troita`, Flutter app + data
pipeline). The two must stay cohesive: same data, same fasting rules, same
design, same words. When you change something here that the app also shows,
say what the app needs (or check troita).

| | troita | troita-web (this repo) |
|---|---|---|
| Default branch | `master` | `main` |
| Owns | the engine, the data pipeline, the seed DB, the golden test file, labels | **DESIGN.MD and `design/tokens.json`** |
| Deploy | Play Store release | Vercel on every push to `main` |

## Working rules

- **Never commit to `main`** (every push to `main` deploys). Work on a feature
  branch; one branch per piece of work, one PR. Don't split one task into many
  branches.
- The owner pushes from their own terminal; Claude's sandbox may not be able to
  push. If a push fails, give the exact commands instead of retrying.
- Before saying something works: `npm test`, `npm run lint`, `npm run build`
  (prebuild runs the design guard and the token check), and for markup or style
  changes `npm start` + `npm run test:a11y` (axe WCAG 2.2 AA + 320px reflow).
  `ACCESSIBILITY.md` is the public accessibility statement GitHub shows on the
  repo page; keep it true when something changes.
- Romanian text with correct diacritics (ș ț with comma below). The owner is
  rewriting the site copy in `TEXTE.md` (not in git, `.git/info/exclude`);
  don't overwrite it.

## Design — this repo is the source of truth for both projects

- `DESIGN.MD` is the spec for the site **and** the app (since 19 Nov 2026).
- `design/tokens.json` holds the values. `src/app/globals.css` is hand-written
  but `node scripts/tokens.mjs --check` (in prebuild) fails the build if it
  drifts. After changing a token:
  ```bash
  node scripts/tokens.mjs --check
  node scripts/tokens.mjs --dart ../troita/lib/app/design_tokens.dart   # then commit it in troita
  ```
- `npm run lint:design` enforces the DESIGN.MD ban list (no pills, radii > 8px,
  big shadows, blur, gradients, banned fonts — Inter, Geist, Space Grotesk —
  emoji). The ☦ cross is always SVG, never a character.
- Fonts: Literata, Alegreya Sans, Plus Jakarta Sans, JetBrains Mono, self-hosted
  in `public/fonts`. The app bundles the same four.
- Gold is never a text colour; liturgical colour = 3px bar + a written label.
- No photography for now (decided 3 Nov 2026).
- Components use tokens, never hex values.

## Calendar data and the engine

- `data/seed-export.json` comes from the app's seed DB; never edit it by hand.
  `.github/workflows/sync-app-data.yml` checks troita@`master` daily and opens a
  PR ("Date din aplicație: seed …") when the seed version changes. By hand:
  ```bash
  python3 scripts/export-calendar.py ../troita/android/app/src/main/assets/seed/churches.db \
    --golden ../troita/test/golden/engine-2026-2030.json
  ```
  It follows only the app's `master`, never its `data/auto-update` branch.
- `src/lib/liturgical.ts` is a port of the app's Dart engine. `npm test` checks
  it on every day of 2026–2030 against `data/engine-golden.json` (copied from
  troita). A rule changed in the app and not here fails the sync PR — port the
  rule, don't edit the golden file.
- **Five fast states, no "dezlegare la lactate"** (owner's decision: there is
  no dairy dezlegare in Orthodoxy). Săptămâna Brânzei = a week without fast.
- **Years 2026–2030.** `CALENDAR_YEARS` = published (2026, 2027) + computed
  (2028–2030, from `computedYears` in the export). Computed years show
  `ComputedYearNote`. Use `CALENDAR_YEARS` / `isCalendarYear` for pages,
  `isComputedYear` for the note; `src/proxy.ts` 404s every other year.
- Notable rules: Postul Sf. Apostoli from the Tuesday after Rusalii when it
  would be < 7 days (2030 computed as 18–28 June, to confirm); Sf. Gheorghe
  moves to Bright Monday from Florii to Pascha (2030 → 29 April).
- Sinaxar texts and saint images are **not** on the site: the app's current
  ones are scraped from calendar-ortodox.ro (all rights reserved). Planned
  replacement: OrthodoxWiki ro (GFDL / CC BY-SA) and ro.wikipedia (CC BY-SA 4.0)
  with attribution and share-alike, plus original summaries; images only from
  Wikimedia Commons. Only then can lives appear on the site.

## App links and launch switches (`src/lib/site.ts`)

- `playStoreUrl` — set on launch day; every "În curând" becomes "Descarcă".
- `appSigningSha256` — the release key fingerprint; fills
  `/.well-known/assetlinks.json` so troita.ro links open the app (the app's
  manifest already has the autoVerify filter). URL scheme shared with the app
  (`lib/app/site_links.dart` there): a day is
  `/calendar-ortodox/<an>/<luna>#ziua-<zi>`.
- `ADS.client` — AdSense; off until set (also produces ads.txt/app-ads.txt).
- `ADS.inApp` — **false** until the app release that ships AdMob; it gates the
  AdMob section of `/confidentialitate`. The policy must describe what the app
  really does (Play checks it).
- `SITE.email` is a personal address while the app's support email is empty on
  purpose; the owner still has to pick a dedicated mailbox.

## CI

- `test.yml`: npm test, lint, build (with design guard + token check) on every
  PR and on `main`.
- `sync-app-data.yml`: daily data PR from the app (repo setting "Allow GitHub
  Actions to create and approve pull requests" is on).

## Next content (from the plan, in value order)

Per-day pages (`calendar ortodox 21 noiembrie`) · church directory from the
app's ~13.5k OSM places (ODbL attribution + share-alike) · feast and name-day
pages · "Când e Paștele 2027–2030" · glossary · .ics subscription and printable
month · 2028 published by autumn 2027.

The full plan and status are in the claude.ai project "Troita-platform"
(`claude/integration-plan.md`, `claude/implementation-status.md`).
