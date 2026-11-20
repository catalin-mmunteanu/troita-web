# Accessibility

www.troita.ro is a calendar people read every day, many of them older, many of
them on a phone. It should work for everyone: with a screen reader, with the
keyboard alone, zoomed in, in dark mode, on a slow connection.

**Target:** [WCAG 2.2](https://www.w3.org/TR/WCAG22/) level AA, for every page
of the site. This file covers the website; the Android app is in the
[troita](https://github.com/catalin-mmunteanu/troita) repository.

## What the site does today

- **Language.** Every page is marked as Romanian (`<html lang="ro">`), so screen
  readers pronounce it correctly, diacritics included (ș ț with comma below).
- **Keyboard.** Everything works without a mouse. "Sari la conținut" is the
  first link on every page; the focus is always visible (a 2px outline).
- **Contrast.** All text passes 4.5:1, in light and in dark mode. DESIGN.MD
  sets this as a rule: dark mode has its own lighter accent colours because the
  light ones fall to 1.3–2.1:1 on the dark background, and gold is never used
  for text (2.0:1).
- **Colour is never the only signal.** The liturgical colour of a day is a bar
  *and* a written label ("Duminică", "Praznic împărătesc"); every fasting badge
  is an icon *and* text ("Zi de post", "Dezlegare la pește"); the strictest day,
  "Ajunare", is also the only filled badge.
- **Images and icons.** App screenshots have descriptive `alt` text. Decorative
  icons and ornaments are hidden from screen readers. The Orthodox cross ☦ is
  drawn as SVG, never typed, so it can't turn into a colour emoji.
- **Dark mode** follows the device setting, with a switch in the header that is
  a labelled button.
- **Motion.** Nothing moves, autoplays or flashes; only colour transitions on
  hover.
- **Zoom.** Pages reflow to a 320px-wide screen without sideways scrolling
  (long words in big headings hyphenate or wrap) and pinch-zoom is never
  blocked.

## How it is checked

- **Every pull request** runs [axe-core](https://github.com/dequelabs/axe-core)
  against WCAG 2.2 A/AA on every kind of page (home, today, year, month, fasts,
  about, privacy, 404), in light and dark mode, at phone and desktop width,
  plus a reflow check at 320px: `npm run test:a11y` against a production
  build, in `.github/workflows/test.yml`. A violation fails the check.
- `npm run lint:design` enforces the DESIGN.MD rules that protect legibility
  (no emoji icons, no low-contrast decoration).
- Automated tools catch only part of the problems. Manual testing with screen
  readers (TalkBack on Android, NVDA on Windows) is planned before launch and
  has not been done yet.

Last full run: 20 November 2026 — 48 axe page checks and 12 reflow checks, no
problems. The run found one: "Confidențialitate" in the 36px heading made
/confidentialitate scroll sideways at 320px; fixed in the same change.

## Known limitations

- The weekday headers of the month grid and the month on a date badge are
  short abbreviations at 11px. The full day names and dates are in the day list
  under the grid.
- When ads are switched on (Google AdSense, off today), the ads and Google's
  consent banner are third-party content we can't fully control. Ad slots are
  labelled "Publicitate" and keep their space, so the page doesn't jump.
- The site has not yet been tested by people who use assistive technology, or
  audited by an accessibility specialist.

## Reporting a problem

If something on troita.ro is hard or impossible to use, please tell us:

- open an [issue](https://github.com/catalin-mmunteanu/troita-web/issues) with
  the page, your device and browser, and any assistive technology you use; or
- write to the address on [troita.ro/despre](https://www.troita.ro/despre).

Romanian or English are both fine. Accessibility problems are treated as bugs.

## For contributors

- Follow [DESIGN.MD](DESIGN.MD): its colours already pass contrast; don't
  introduce new ones outside `design/tokens.json`.
- Every icon-only control needs an `aria-label`; decorative SVGs get
  `aria-hidden`.
- Never use colour alone to carry meaning; pair it with text.
- Run `npm run build && npm start` and `npm run test:a11y` before opening a pull
  request that changes markup or styles.

This file is maintained by the site's owner and reviewed with every design
change.
