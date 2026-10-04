# Kapresco — Design System (extracted from Figma)

- **File:** `Kapresco Website` — key `Tn0nyP9sDPCoBdZcDMZPzN`
- **Canvas:** single page, 88 top-level nodes — **61 screens** + 27 components
- **Frame width:** 1366px desktop (no mobile frames designed)
- **Last modified:** 2026-10-04

Raw dumps: `.figma/tokens.txt` (values), `.figma/structure.txt` (tree + flows), `.figma/asset-manifest.json`, `.figma/assets/` (48 PNGs @2x).

---

## Color

Primary is a **coffee-brown / cream / gold** palette. Counts are uses across the file.

### Brand
| Token | Hex | Uses | Role |
|---|---|---|---|
| `brown-900` | `#442808` | 200 | Darkest brown (also shadow base) |
| `brown-800` | `#603809` | 59 | |
| `brown-700` | `#693B23` | **2665** | **Primary brand brown** — nav, headings, body, icons |
| `brown-600` | `#875B42` | 9 | Muted brown |
| `brown-500` | `#9A8A80` | 24 | Warm gray (muted text) |
| `espresso` | `#2B211C` | 340 | Near-black brown — high-emphasis text |

### Accent
| Token | Hex | Uses | Role |
|---|---|---|---|
| `gold-400` | `#F9C06A` | **886** | **Primary accent** — CTAs, highlights, badges |
| `gold-500` | `#ECBD63` | 27 | Darker gold |
| `tan-200` | `#E6CDA9` | 730 | Light tan — borders, muted fills |
| `cream-100` | `#F7E9D7` | 202 | Soft cream fill |

### Surface
| Token | Hex | Uses | Role |
|---|---|---|---|
| `page` | `#FFFEFC` | 162 | **Page background** (every screen) |
| `surface` | `#FFFFFF` | **2384** | Cards, header, footer |
| `surface-warm` | `#FFF9F1` | 766 | Alternate section bg |

### Status
| Token | Hex | Uses |
|---|---|---|
| `error` | `#B94A3E` | 81 |
| `error-bg` | `#FFF2EF` | 34 |
| `success` | `#3F7D54` | 28 |
| `success-bg` | `#F0F7F0` | 16 |

### Neutrals
`#707070` (1066 — secondary text), `#DDD5CC` (45 — borders/dividers), `#1E1E1E` / `#000000` (text/icons).

> Alpha variants in use: white @ 9/10/29/67/80/85/89/91/95%, `#F9C06A` @ 10/22/42/62%, brown @ 53/66/69/77/84%. The 85% white is likely text-on-image overlays.

---

## Typography

**Albert Sans** (Google Fonts) — 5451 of 5463 text nodes. Only 10 stray `Inter` + 2 `Smooch Sans`, which look accidental.

Line heights are `INTRINSIC_%` at **120%** in most cases.

### Scale (consolidated, by frequency)
| Role | Size | Weight | Line height | Notes |
|---|---|---|---|---|
| Display / hero | 60–80 | 700–800 | 120% | `80/700`, `64/700`, `60/800` |
| H1 section | 44 | 800 | 1450 (2 uses) / 1200 | |
| H2 | 32 | 800 | 1200 | letter-spacing 4.48px on one variant |
| H3 | 28 | 800 | 1200 | |
| H4 / card title | 22–26 | 700–800 | 1200 | |
| Body L | 20 | 400 | 1200 | |
| **Body (default)** | **16** | **400** | **1160–1200** | most-used reading size |
| Nav link | 16 | 500 | 1200 | |
| Body S / label | 14 | 400 | 1300 / 1200 | most-used overall (960) |
| Label | 15 | 600 | 1200 | |
| Caption | 13 | 400 | 1450 | |
| Micro | 11–12 | 400 | 1200 | footer legal, account label |

Weights used: **400, 500, 600, 700, 800**. No 300 or 900.

### Wordmark
`K A P R E S C O` — 27px / 400 / letter-spacing **4.05px** (spaced caps). Same treatment reused in footer and auth screens.

---

## Radius
| Value | Uses | Use |
|---|---|---|
| `999px` | 876 | Pills, avatars, badges |
| `8px` | 485 | Inputs, small cards |
| `12px` | 288 | **Default card radius** |
| `24px` | 48 | Large panels |
| `20px` | 42 | |
| `10px` | 40 | Buttons |

---

## Elevation
| Shadow | Uses |
|---|---|
| `0 12px 30px rgba(68,40,8,0.12)` | **268 — primary card shadow** |
| `0 4px 10px rgba(0,0,0,0.10)` | 68 — dropdowns, popovers |
| `0 6px 12px rgba(249,192,106,0.22)` | 24 — gold glow on primary CTA |
| `0 4px 4px rgba(0,0,0,0.25)` | 4 |
| `0 10px 12px rgba(0,0,0,0.34)` | 1 — modal |
| `background-blur` | 23 — sticky header / glass surfaces |

---

## Layout

### Grid
- Frame **1366px**, content container **1166px** → **100px side gutters**
- Some sections use 93px gutters (homepage sections) — inconsistent, worth normalizing
- Two-column content: `gap: 32px` (products, cart, checkout)

### Spacing
Gap values in use: `4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 38, 42, 64, 70, 120`
→ effectively a **4px base scale**, mostly `8 / 12 / 16 / 20 / 24 / 32`.

Recurring paddings:
- Page intro: `48 / 100 / 48 / 100`
- Page content: `54 / 100 / 70 / 100`
- Footer: `70 / 100 / 26 / 100`
- Section: `86–94 / 93–100`
- Cards: `28`, `20`, `16`, `22`

### Responsive constraints
`TOP/LEFT` dominates (10972), `SCALE/SCALE` 873 — **no mobile or tablet frames exist**. Responsive behavior is unspecified in the design.

---

## Components

| Component | Size | Instances |
|---|---|---|
| `Kapresco header / Logged in` | 1366×72 | 7 |
| `Kapresco header / Logged out` | 1366×72 | 0 |
| `Kapresco footer` | 1366×470 | 7 |
| `Kapresco product / …` ×7 variants | 1366×5110–5186 | 0 |
| `Kapresco account sidebar` ×6 | 280×680 | 0 |
| `Kapresco input / Single line` | 382×80 | 0 |
| `Kapresco input / Notes` | 574×124 | 0 |
| `Kapresco summary / …` ×3 | 370×325–379 | 0 |
| `Kapresco order items / Editable` | 708×364 | 0 |
| `Kapresco order items / Read only` | 708×314 | 0 |
| `Coffee Size` (variant set) | 304×371 | 0 |

> ⚠️ Most components have **0 instances** — the screens were built as flat frames with copied structure rather than by instancing. Expect drift between screens; the components are the intended source of truth.

---

## Screen inventory

**Auth (9)** — numbered `01`–`09`: Login, Sign Up, Account, Forgot Password, Reset Password, Account Created, Password Reset Success, Email Sent. All ≤1220px tall, no footer.

**Product detail (7)** — Customization selected, Quantity changed, Added to Cart, Out of stock, Unavailable, Invalid customization, Added to Favorites. Each wraps a modal overlay on a full page.

**Cart (6)** — Populated, Empty, Promo valid/applied/invalid/expired.

**Checkout (4)** — Pickup, Delivery, Validation errors, Order failed.

**Payment (5)** — GCash, Maya, Card, Successful, Cancelled.

**Orders (6)** — Confirmation, Details (Pickup/Delivery/Cancelled), History, History Empty, Track Order.

**Account (12)** — Profile, Settings, Addresses (Saved/Add/Edit/Validation/Empty/Delete), Payment Methods (Saved/Add/Empty/Remove).

**Discovery (7)** — Search Results, Search No results, Menu ×5 (All/Non-Coffee/Pastries/Best Sellers/Seasonal).

**Marketing (4)** — `01 - Public Homepage`, `Home`, `About Us`, `Menu`, `Individual Product`.

### Two competing homepages
- **`01 - Public Homepage`** — clean, component-driven, 7 sections: Hero → Featured best sellers → Why choose Kapresco → Kapresco experience → Testimonials → Final CTA → Footer
- **`Home`** — older freeform version, uses ungrouped `Group 4` / `coffee_blast` / `kapresco logo 1` layers and loose absolute positioning

**Use `01 - Public Homepage`** — it has proper auto-layout and semantic section names. `Home` looks like the earlier draft.

---

## Prototype

Only **5 interactions** in the entire file — essentially no flow is wired up:
- `Menu` → 1 link (Group 5 → Individual Product)
- `Individual Product` → 4 links (2 to node `1:722`/`1:738`, 2 to `21:4112`/`21:4128`)

Navigation, cart, checkout, and auth transitions are **not** prototyped. State changes are communicated only by the separate variant frames.

---

## Content notes

- Tagline: **"Sip. Chill. Repeat."**
- Brand voice uses Filipino/Taglish heavily: *presko, preskong kape, kaprescopeeps, tambayan, sulit, lami kaayo, barkada*
- Currency **₱ (PHP)**, standard item price **₱89.00** (one strikethrough at ₱99.00)
- Location: **Madang, City of Mati, Davao Oriental**
- Hours: Mon–Sat 8:00 AM–9:00 PM · Sun 10:00 AM–7:00 PM

### Bestsellers
Midnight Brew · Chill Latte · Caramel Cloud · Velvet Macchiato

### Testimonials
Andrea M. (Student) · Leah C. (First-time visitor) · Kevin R. (Freelancer)

### Team
Mark — Kapresco Manager · Ella — Head Barista · Rhea — Interior & Vibe Curator · Paolo — Marketing & Socials · Jenny — Customer Care

### Core values
Presko Vibes · Homegrown Flavor · Affordability with Quality · Community First

---

## Issues to resolve before build

1. **No mobile/tablet frames.** 1366px desktop only. Responsive is undefined — needs a decision.
2. **Duplicate homepages** (`Home` vs `01 - Public Homepage`) and duplicate menu/product screens.
3. **Components unused** (mostly 0 instances) — screens are flat copies. Build from components, not screens.
4. **Inconsistent gutters** — 93px vs 100px on the same page.
5. **`Coffee Size` variant set has unnamed properties** (`Property 1` / `Default` / `Variant2` / `Variant3`) — the size options were never labelled.
6. **Stray fonts** — 10 `Inter`, 2 `Smooch Sans` nodes (likely pasted artifacts).
7. **102 unique type styles** for what should be ~10. Needs consolidating into a real scale.
8. **Prototype is essentially empty** (5 links) — interaction specs must be written from scratch.
9. Missing logo vector — logo is a raster `IMAGE` fill at 50×50 and 30×30, too small for production. **Request an SVG.**

---

## Implementation deviations (documented)

| # | Deviation | Rationale |
|---|-----------|-----------|
| 1 | **Cart icon in header** (not in Figma header spec) | The Figma header has no cart link, but the Cart page exists (`Shopping Cart — Populated/Empty/Promo`). Without a header cart icon, users cannot reach `/cart`. Added a cart icon with badge next to the profile avatar. |
| 2 | **Contrast fix: `--brown-600` (`#875B42`) replaces `--text-muted` (`#707070`) on `#F7E9D7` cream band** | `#707070` on `#F7E9D7` = 4.14:1 (fails WCAG AA). `#875B42` on `#F7E9D7` = 4.88:1 (passes). Both colours are inside the Figma palette. |
| 3 | **Contrast fix: Removed invented gold index numbers (`01`/`02`/`03`/`04`) on Value cards** | Figma Value cards have **no index numbers**; the implementation added gold-on-white numbers (1.74:1 fail). Removing them restores Figma fidelity and fixes contrast. |
| 4 | **Contrast fix: Team cards use Figma gold-tinted background (`#F9C06A@42%`) with `#707070` role text, not gold** | Implementation had gold role text on white (1.74:1 fail). Figma spec uses gold-tinted card with `#707070` role → 4.73:1 pass. |
| 5 | **`html, body { overflow-x: clip }` (with `overflow-x: hidden` fallback)** | Kills off-canvas horizontal overflow without breaking sticky positioning. |
| 6 | **Mobile hamburger menu focus management** | Focus moves into the sheet via `requestAnimationFrame` because links can't receive focus while the panel is `visibility: hidden`. |
| 7 | **Brand link `aria-label="${BRAND.wordmark} — home"`** | Accessible name quotes the visible spaced wordmark verbatim, avoiding axe `label-content-name-mismatch`. |
| 8 | **Auth forms submit empty** | Requirement: "empty forms must still submit" — demo frontend auth with no validation blocking submission. |
| 9 | **Orders/Favorites in `localStorage`; checkout draft in `sessionStorage`** | No backend — demo persistence using Web Storage. `KAP-####` reference generator in `orderService`. |
| 10 | **Menu page catalog controls (Availability / Sort by / Status banner / Footer note)** | Figma "Catalog content" frame includes Availability chips, Sort by chips, catalog heading with item count, status message banner, and "Showing all N items in this view" footer. All implemented. |
| 11 | **Menu hero is dark image banner (1366×417, `#442808` @27% scrim)** | Replaced the cream `PageIntro` with a left-aligned dark hero matching Figma "Menu hero" frame. |
| 12 | **Search bar has gold 52×52 action button (r10)** | Matches Figma search action button exactly. |
| 13 | **Order Details page (`/orders/:reference`) and Track Order page** | Added to match Figma "Order Details — Delivery/Pickup/Cancelled" and "Track Order — Delivery" frames. |
| 14 | **ProductCard out-of-stock badge** | Added to match Figma "Product — Out of stock" frame; 3 products seeded as out of stock for demo. |
