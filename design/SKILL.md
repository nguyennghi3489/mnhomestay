---
name: hearth-design
description: Use this skill to generate well-branded interfaces and assets for Hearth, a SaaS booking & guest-management portal for small homestays and guesthouses, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

The brand is **Hearth** — warm, natural, hand-crafted. Earth-green palette (forest, moss, sage), cream paper backgrounds, clay accents, bark-toned text. Fraunces (display serif) + Inter (body sans). The voice is a thoughtful innkeeper, not a hotel concierge — second person, sentence case, no emoji in UI.

Key files:
- `README.md` — brand voice, content fundamentals, visual foundations, iconography
- `colors_and_type.css` — design tokens (CSS variables) ready to import
- `assets/` — logos, marks, illustrations
- `preview/` — atomic preview cards for each token group
- `ui_kits/manager/` — host-facing web app (React/JSX components + interactive index.html)

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out of this skill folder and create static HTML files for the user to view. Always import `colors_and_type.css` and wrap your design in `.hearth` so semantic styles apply.

If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions about scope (marketing page? product screen? slide deck? email?), and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

**Never** introduce: bluish-purple gradients, neon teals, pure white, pure black, emoji-heavy UI, Material-style pill buttons, or generic stock-photo interiors. Stay rooted in the warm, earthy, hand-crafted mood.
