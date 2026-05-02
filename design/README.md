# Hearth Design System

> Booking & guest management for small homestays and guesthouses.

Hearth is a SaaS portal that helps independent guesthouse owners manage reservations, guests, rooms, and daily operations — without the cold corporate feel of enterprise PMS tools. The product is built for hosts who run 2–20 room properties and want software that feels as warm and personal as the homes they run.

**Brand promise.** Software that feels like a well-tended garden, not a spreadsheet.

---

## Sources

This design system was created from the brief alone — no codebase, Figma file, or existing screenshots were provided. Visual decisions were made fresh against the brief:

> _"Sass idea for building localstay manager booking guest management for small guesthouse — let's use warm earth green to make it apparent very nature for homestay portal."_

If you have an existing codebase, Figma file, or brand assets, attach them and we'll reconcile this system with what already exists.

---

## Index

Root files:
- `README.md` — this file (brand, content, visual foundations, iconography)
- `SKILL.md` — agent-skill manifest for downstream use
- `colors_and_type.css` — design tokens (CSS variables) for color, type, spacing, radius, shadow

Folders:
- `assets/` — logos, marks, brand illustrations
  - `logo-wordmark.svg`, `logo-mark.svg`, `sprig.svg`, `vine.svg`, `icons/key.svg`
- `preview/` — 18 design-system preview cards (the Design System tab pulls from here)
  - **Type**: `type-display.html`, `type-body.html`, `type-pairing.html`
  - **Colors**: `colors-brand.html`, `colors-neutrals.html`, `colors-semantic.html`
  - **Spacing**: `spacing.html`, `radii.html`, `elevation.html`
  - **Components**: `buttons.html`, `fields.html`, `badges.html`, `cards.html`, `calendar.html`
  - **Brand**: `logo.html`, `illustrations.html`, `voice.html`, `icons.html`
- `ui_kits/manager/` — the host-facing web app UI kit (React/JSX)
  - `index.html` — interactive click-thru: dashboard → calendar → guests → booking drawer
  - `App.jsx`, `Sidebar.jsx`, `TopBar.jsx`, `Dashboard.jsx`, `Calendar.jsx`, `Guests.jsx`, `BookingDrawer.jsx`, `Settings.jsx`, `primitives.jsx`, `icons.jsx`, `styles.css`

---

## Content Fundamentals

**Voice.** Warm host, not a hotel concierge. Hearth speaks the way a thoughtful innkeeper would — direct, human, never stiff. We say "your guests," "your stay," "your morning." We never say "users," "customers," or "inventory."

**Tone spectrum.**
- Empty states are encouraging, never preachy. ("No arrivals today — a quiet morning.")
- Errors are honest and short. ("That room's already booked. Pick another?")
- Success is understated. ("Booked. Sent the welcome note.")
- Marketing copy leans pastoral and concrete, not aspirational fluff.

**Person.** Second person ("you," "your"). The product talks _to_ the host, never _about_ them. We're a tool, not a brand performing.

**Casing.** Sentence case for everything — buttons, headings, menu items, table headers. Never Title Case. Never ALL CAPS except for tiny eyebrow labels (`tracking-wider`, `12px`, used sparingly).

**Numbers and dates.** Friendly first, precise second. "Tomorrow" before "Apr 30." "3 nights" before "3 × 1 night." "₹4,200/night" with the host's local currency.

**Punctuation.** En-dashes for ranges (Apr 28 – May 2). Oxford commas. Periods on full sentences in body copy; no periods on button labels or single-line UI strings.

**Emoji.** Almost never. A single 🌿 or 🔑 may appear in a celebratory moment (first booking confirmed) but never in nav, buttons, or labels.

**Examples.**

| Don't | Do |
|---|---|
| "Manage Your Property Inventory" | "Your rooms" |
| "User successfully created!" | "Guest added." |
| "An error has occurred. Please try again." | "Something didn't save. Try again?" |
| "Welcome back, valued partner!" | "Welcome back." |
| "Synchronize Calendar" | "Sync calendar" |
| "0 results found" | "Nothing here yet." |

---

## Visual Foundations

**Mood.** A south-facing kitchen at 9am. Warm light on a wooden table. A jar of dried herbs. The internet, but it remembered there's a world outside.

### Color

The palette is rooted in **moss, bark, clay, and cream**. No pure white, no pure black. Greens lean warm and earthy (toward olive and forest), never minty or corporate-saas-teal.

- **Forest** `#2F4A3A` — primary brand. Headings, primary buttons, key marks.
- **Moss** `#5C7A52` — secondary actions, hover accents, links.
- **Sage** `#A8B89A` — soft fills, dividers, calendar "available" cells.
- **Clay** `#C97B5B` — warm accent, used sparingly for arrivals / today / notifications.
- **Bark** `#3A2E26` — body text, deep neutrals.
- **Cream** `#F5EFE3` — page background; the "paper" of the product.
- **Linen** `#FAF6EC` — surface elevation 1 (cards on cream).
- **Stone** `#7A736B` — secondary text.
- **Ember** `#B84A2E` — destructive / errors. Burnt, not bright red.
- **Honey** `#D9A441` — warnings, pending status.

Semantics: `--fg-1` (Bark), `--fg-2` (Stone), `--fg-3` (warm grey), `--bg-app` (Cream), `--bg-surface` (Linen), `--bg-raised` (#FFFFFE warm-white), `--accent` (Forest), `--accent-soft` (Sage), `--success` (Moss), `--warning` (Honey), `--danger` (Ember).

### Type

- **Display: Fraunces** — a warm, slightly-flared serif with generous optical sizes. Used for headings and the wordmark. Weight 400–600.
- **Body: Inter** — clean, neutral sans for UI and reading. Weight 400 / 500 / 600.
- **Mono: JetBrains Mono** — only in code blocks and confirmation numbers (e.g. booking `#HRT-2401`).

> Fraunces and Inter are loaded from Google Fonts. If you have licensed alternates (e.g. Söhne, Domaine Display), swap them via the `--font-display` and `--font-body` tokens.

Scale (rem-based, 16px root):
- `--text-xs` 12 / 16
- `--text-sm` 14 / 20
- `--text-base` 16 / 24
- `--text-lg` 18 / 28
- `--text-xl` 22 / 30
- `--text-2xl` 28 / 36
- `--text-3xl` 36 / 44
- `--text-4xl` 48 / 56 (display)
- `--text-5xl` 64 / 72 (hero, marketing only)

### Spacing & Layout

- 4px base grid. Scale: 4, 8, 12, 16, 20, 24, 32, 40, 56, 72, 96.
- Generous breathing room. Default card padding is 24px; key surfaces use 32px.
- Max content width 1240px on marketing surfaces; the app uses fluid layout with a 240px sidebar.
- Density skews comfortable, not compact. Tables have 56px row height.

### Backgrounds

- Default: `--bg-app` Cream — subtly warm, never pure white.
- Marketing hero: large photographs (golden-hour exteriors, hands holding tea, linens drying) with a soft 8% Forest overlay for legibility. Always full-bleed, never boxed.
- Decorative: a faint **botanical line illustration** (eucalyptus sprig, fern, climbing vine) in `--sage` at 30% opacity, anchored bottom-right of empty states and section dividers. Never tiled, never busy.
- Patterns: occasional `linen-texture.png` at 6% opacity for premium surfaces (settings, billing). No gradients in product UI; one earthy gradient (`Forest → Moss`) is reserved for the marketing CTA strip.

### Imagery

Warm, naturally-lit, photographic. Real homes, real hands, real plants. Avoid stocky-perfect interiors; favor lived-in. No people-staring-at-laptops shots. Color-grade slightly warmer (+5 temperature, +3 saturation on greens). Never B&W. Subtle film grain at 4% is acceptable on hero images.

### Borders, radii, shadows

- Radii: `--radius-sm` 6, `--radius-md` 10, `--radius-lg` 16, `--radius-xl` 24, `--radius-pill` 999. The system leans toward 10–16px on most surfaces — soft, hand-thrown ceramic, not Material-Design-pill.
- Borders: 1px hairlines in `--bark / 12%` for dividers; 1.5px in `--moss` for input focus.
- Shadows: low and warm, tinted with bark, never neutral grey.
  - `--shadow-1` `0 1px 2px rgba(58,46,38,.06)` — list rows, table cells
  - `--shadow-2` `0 4px 12px rgba(58,46,38,.08)` — cards
  - `--shadow-3` `0 12px 32px rgba(58,46,38,.12)` — drawers, modals
  - `--shadow-inset` `inset 0 1px 0 rgba(255,255,255,.6)` — top-light on raised buttons

### Hover, press, focus

- Hover on dark fills: lighten by ~6% (mix in 6% Linen).
- Hover on light fills: darken by ~4%, plus a 1.5px Forest hairline appears.
- Press: scale to 0.98 over 80ms, ease-out. No color change beyond hover.
- Focus: 2px Moss ring at 2px offset, never the browser default.
- Disabled: 40% opacity, no pointer events. No "greyed out cement" treatment.

### Motion

- Easing: `cubic-bezier(.32, .72, 0, 1)` ("settle") for most UI; `cubic-bezier(.6, 0, .2, 1)` for emphatic.
- Durations: 120ms (toggles), 180ms (hovers), 240ms (panels), 320ms (drawers), 480ms (page transitions).
- No bouncy springs. No parallax. The product moves like a page being turned, not a notification arriving.
- Page transitions: 8px upward translate + opacity fade.
- Skeletons shimmer slowly (1600ms cycle) in `--sage / 20%`.

### Transparency & blur

- Used sparingly. The mobile bottom sheet has a 14px backdrop-blur over a 70% Cream tint. Modals dim the page with `bark / 32%` — warm overlay, not black.
- Glass effects are not part of the brand.

### Layout rules

- The host app has a fixed 240px left sidebar (collapsible to 64px). Top bar is 64px. Content scrolls.
- Marketing pages are vertically scrolled; sections are 96–160px of vertical rhythm.
- Cards use `--shadow-2` and `--radius-lg`. They never have colored left borders.
- Tables sit on `--bg-surface` with hairline dividers. Zebra striping is _not_ used.

---

## Iconography

Hearth uses **Lucide** as its primary icon set, loaded from CDN (`https://unpkg.com/lucide@latest`). Lucide's 1.5px stroke, rounded caps, and lightly humanist construction sit naturally next to Fraunces and the warm palette. We render Lucide icons in `currentColor` and never recolor strokes mid-icon.

> **Substitution flag.** Lucide is a CDN-substitute set chosen to fit the brand mood — there is no proprietary Hearth icon library yet. If you commission a custom set, replace the Lucide imports in `ui_kits/manager/icons.jsx`.

**Sizing.**
- 16px in dense UI (table cells, inline buttons)
- 20px default (sidebar nav, toolbar buttons)
- 24px in primary actions and section headers
- 32px+ only in empty-state illustrations

**Color rules.**
- Default to `--fg-2` (Stone) for inactive icons
- `--accent` (Forest) for active nav items, primary actions
- `--clay` for "today" / arrival markers on the calendar
- Never use multiple colors within a single icon

**Brand-specific marks** (in `assets/`):
- `logo-wordmark.svg` — full Hearth wordmark (forest on cream)
- `logo-mark.svg` — square mark for app icons / favicons (cream-on-forest)
- `icons/key.svg` — celebratory key glyph used on first-booking confetti and check-in confirmations
- `sprig.svg` — eucalyptus-style botanical illustration for empty states (use at 30% opacity, anchored bottom-right)
- `vine.svg` — climbing-vine flourish for marketing hero corners and footer edges

**Emoji.** Almost never — see Content Fundamentals. The single exception is a 🌿 sprig used in the welcome email and the very-first-booking celebration toast. Never in nav, buttons, or table cells.

**Unicode chars as icons.** Avoided. Use Lucide. The only allowed unicode glyphs are the en-dash (`–`) for date ranges and the multiplication sign (`×`) for "3 × king bed".
