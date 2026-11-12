# Troița: Design System & Visual Architecture

Specification for the Troița app (Flutter, Android) and the website (www.troita.ro).

> **Scope (decided 3 November 2026):** this spec is applied to the **website first**. The Flutter app keeps its current `theme.dart` until the website has been tested; it follows later.

---

## 1. Core brand and design philosophy

Troița is a modern, high-precision Romanian Orthodox calendar application (mobile and web).

- The design **MUST** evoke the solemnity, warmth and timeless heritage of Eastern Orthodox ecclesiastical art and Romanian woodcraft (troițe).
- It **MUST NOT** look like a generic, modern SaaS app or an AI-generated template.

---

## 2. Ban list (never use)

1. The **Inter**, **Geist** or **Space Grotesk** fonts, for headings or body.
2. Purple-to-blue or neon **gradients** in heroes, backgrounds or buttons.
3. Generic **3-card feature grids** with Lucide icon headers on top.
4. **Rounded pill buttons** with heavy Gaussian shadows for primary actions.
5. **Centered H1 hero blocks** with a floating pill badge directly above the headline.
6. Generic **stock imagery** or smooth 3D plastic illustrations.
7. Uniform **16px or 24px border radii** on all cards.
8. **Emoji icons** for navigation menus or section indicators.

---

## 3. Typography

All fonts **MUST** support Romanian diacritics (ă, â, î, ș, ț), using the correct comma-below characters (ș ț, not the cedilla forms ş ţ).

### Font families

| Role | Font | Fallback |
|---|---|---|
| Display / headings | `Literata`, serif | `Alegreya`, `Georgia`, serif |
| Subtitles / UI buttons | `Alegreya Sans`, sans-serif | — |
| Body text / synaxarion | `Plus Jakarta Sans`, sans-serif | `system-ui` |
| Liturgical rubrics / verses | `JetBrains Mono`, monospace | — |

### Type scale

| Use | Size | Font and weight | Other |
|---|---|---|---|
| Hero / date display | 32–40px | Literata Bold | line-height 1.15 |
| Feast title (cruce roșie) | 20–24px | Literata SemiBold | color `#8B1E1E` |
| Saint name / daily commemoration | 16–18px | Plus Jakarta Sans Medium | — |
| Rubric / fasting note | 13–14px | JetBrains Mono Regular | uppercase, tracking 0.05em |

---

## 4. Color tokens

### Neutral palette

| Token | Light mode | Dark mode |
|---|---|---|
| Background (Parchment Light) | `#FDFBF7` | `#141211` |
| Surface / cards (Parchment Surface) | `#F5F0EB` | `#1E1B18` |
| Text primary (Deep Charcoal) | `#1A1817` | — |
| Text secondary (Muted Umber) | `#574F4A` | — |
| Border (Carved Oak) | `#E2D8C8` | `#322A22` |

Dark-mode text colors (added, not in the original spec): text primary `#EDE6DA`, text secondary `#B5AA9C`.

### Liturgical accent tokens

These change dynamically with the calendar state.

| Token | Used for | Hex |
|---|---|---|
| Gold | Feasts of the Lord, Sundays | `#D4AF37` |
| Red | Martyrs, Holy Cross, Pascha | `#8B1E1E` |
| Blue | Mother of God, Angels | `#1A365D` |
| Green | Trinity, Pentecost, Palm Sunday | `#1E4D2B` |
| Purple / violet | Great Lent, fasting | `#3B0764` |

**Dark-mode accents (added).** The light accents almost disappear on `#141211` (red 2.1:1, blue 1.5:1, purple 1.25:1), so dark mode uses lighter variants:

| Token | Dark mode |
|---|---|
| Gold | `#D4AF37` (unchanged, 8.9:1) |
| Red | `#E07B72` |
| Blue | `#8EB1DE` |
| Green | `#7DBE8E` |
| Purple | `#C2A3E8` |

**Gold is never used for text** (2.0:1 on parchment). A gold bar is always paired with a written label, such as „Duminică” or „Praznic împărătesc”.

### Which liturgical color a day gets

In priority order (website, `src/lib/liturgical-colour.ts`):

1. Trinity, Pentecost, Palm Sunday → green
2. Holy Cross feasts and Pascha → red
3. Feasts of the Lord → gold
4. Feasts of the Mother of God and of the Archangels → blue
5. Every other Sunday → gold
6. A martyr as the day's main commemoration, with a cross (roșie or albastră) → red. Most days remember some martyr, so the bar is kept for the ones a calendar marks.
7. Any other day of Great Lent → purple
8. Otherwise → no bar

---

## 5. Containers and borders

- **Card border radius:** 4px by default, 8px at most. No 16px+ rounded cards.
- **Card borders:** `1px solid #E2D8C8` (light mode), `1px solid #322A22` (dark mode).
- **Shadows:** flat borders, or a micro drop-shadow only:
  ```css
  box-shadow: 0px 1px 3px rgba(26, 24, 23, 0.06);
  ```
  No multi-layered blue or violet glow shadows.
- **Accent highlight:** the liturgical color indicator **MUST** be a 3px solid vertical bar on the left edge of commemorated event cards.

---

## 6. Components

### Feast day cards (cruci)

| Variant | Background | Border | Icon | Title |
|---|---|---|---|---|
| Cruce roșie (red cross) | `#FFF8F8` | `#F0C8C8` | red Orthodox cross ☦ | Literata Bold, `#8B1E1E` |
| Cruce albastră (blue cross) | `#F4F6FA` | `#C9D4E6` | blue Orthodox cross | Literata SemiBold, `#1A365D` |
| Cruce neagră (black cross) | `#FDFBF7` | `#E2D8C8` | black Orthodox cross ☦ | Literata SemiBold, `#1A1817` |

**Cruce albastră (added, decided 3 November 2026).** The calendar data marks the middle rank as *cruce albastră*, printed blue in some Romanian calendars and black in others. The website keeps it as its own rank, between cruce roșie and an ordinary day. On the website the cruce neagră style is used for ordinary days (no cross icon), since the data has no separate black rank.

Dark-mode feast cards (added): cruce roșie `#2A1A18` / border `#4A2A26` / title `#F08C82`; cruce albastră `#19202B` / border `#2C3A50` / title `#8EB1DE`.

**The ☦ cross is drawn as SVG, never typed as a character.** None of the four fonts contains U+2626, so browsers fall back to a system font, and on Android and Windows that renders a color emoji, which the ban list forbids.

### Fasting status badge (post / harți)

Compact pill or rectangular badge, **24px high**, **2px radius**, always icon + text.

The original colors (`#F3E8FF`, `#E0F2FE`, `#FEF3C7`…) were Tailwind's stock palette. **Decided 3 November 2026: warmed** towards the parchment palette, same hues. The calendar has five fasting states, not three; the two extra ones follow the same family. **There is no „dezlegare la lactate” state (decided 12 November 2026):** Săptămâna Brânzei is shown as a week without fast, like the other days outside a fast. All text passes 4.5:1.

| State | Label | Background | Text | Dark bg | Dark text |
|---|---|---|---|---|---|
| Fasting day | „Zi de post” | `#EFE5EC` | `#3B0764` | `#2A1E2C` | `#D2B6E6` |
| Fish allowed | „Dezlegare la pește” | `#E2ECEC` | `#1D5468` | `#17262A` | `#8EC3D2` |
| Oil and wine (added) | „Dezlegare la ulei și vin” | `#ECE8CF` | `#55500F` | `#25241A` | `#CFC88A` |
| Strict fast (added) | „Ajunare” | `#3B0764` | `#FDFBF7` | `#D2B6E6` | `#141211` |
| No fasting | „Harți” / „Fără post” | `#F5EACB` | `#7A3B0C` | `#2C2314` | `#E8C27E` |

Ajunare is the only filled badge: the strictest day is the one that stands out.

### Navigation

- **Mobile (Flutter):** parchment bottom-sheet navigation. The active icon is highlighted in Gold (`#D4AF37`) or in the active liturgical color.
- **Web (www.troita.ro):** logo with a carved-wood emblem, left-aligned at the top; a date quick-jump picker on the right; a clean, uncrowded horizontal layout.

---

## 7. Imagery

**Decided 3 November 2026: no photography for now.** The site uses only typography, the SVG emblem and ornaments, and app screenshots once they exist. No stock or AI-generated images in the meantime.
