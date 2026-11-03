# Troița: Design System & Visual Architecture

Specification for the Troița app (Flutter, Android) and the website (www.troita.ro).

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

### Liturgical accent tokens

These change dynamically with the calendar state.

| Token | Used for | Hex |
|---|---|---|
| Gold | Feasts of the Lord, Sundays | `#D4AF37` |
| Red | Martyrs, Holy Cross, Pascha | `#8B1E1E` |
| Blue | Mother of God, Angels | `#1A365D` |
| Green | Trinity, Pentecost, Palm Sunday | `#1E4D2B` |
| Purple / violet | Great Lent, fasting | `#3B0764` |

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
| Cruce neagră (black cross) | `#FDFBF7` | `#E2D8C8` | black Orthodox cross ☦ | Literata SemiBold, `#1A1817` |

### Fasting status badge (post / harți)

Compact pill or rectangular badge, **24px high**, **2px radius**.

| State | Label | Background | Text |
|---|---|---|---|
| Fasting day | „Zi de Post” | `#F3E8FF` | `#3B0764` |
| Fish allowed | „Dezlegare la Pește” | `#E0F2FE` | `#0369A1` |
| No fasting | „Harți” | `#FEF3C7` | `#92400E` |

### Navigation

- **Mobile (Flutter):** parchment bottom-sheet navigation. The active icon is highlighted in Gold (`#D4AF37`) or in the active liturgical color.
- **Web (www.troita.ro):** logo with a carved-wood emblem, left-aligned at the top; a date quick-jump picker on the right; a clean, uncrowded horizontal layout.
