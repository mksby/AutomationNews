# DESIGN.md — automation.news

This document is the binding contract for visual & interaction design.
Sections **1 / 4 / 7 / 8 / 9** are authored. Sections **2 / 3 / 5 / 6** are
generated from `tokens/` by `pnpm tokens:build` — never hand-edit them.

---

## 1. Theme — "loft × pixel"

The visual language is **industrial loft** with dosed **pixel-art** accents.

**Materials.** Concrete and raw steel form the canvas: deep charcoals, warm
paper for the light theme. The accent is **safety amber** — sparingly used,
the way a single hazard stripe punctuates a factory floor.

**Geometry.** A rigid grid. Hard, sharp borders (default `--border-hard: 2px`).
Radii are 0 by default; `--radius-sm: 2px` is a discrete chamfer used rarely.

**Pixel idiom.** Decoration with intent, not skin-deep:

- **Hard shadows** are offset, no blur (`--shadow-pixel-sm` etc.) — they read
  as a stamped, parallax-printed mark, not a soft drop-shadow.
- The **Departure Mono** display face is pixel-perfect on multiples of 11px
  (see `--size-display-100/200/300`). Use it **only** on headings, logos,
  decorative labels. **Never** on body or any small text.
- `image-rendering: pixelated` only on assets that are genuinely pixel art.

**Mood.** Quiet, durable, slightly mechanical. Not retro for retro's sake;
the pixel marks are punctuation, not paragraphs.

---

## 4. Component intent

A short brief for each layout primitive, so component implementations stay
honest to the system. Component CSS may consume **only** semantic tokens
(`var(--color-*)`, `var(--type-*)`, `var(--space-*)`, `var(--shadow-pixel-*)`)
plus the small component token set in section 4b.

- **ArticleCard** — primary unit on the index/list pages. Hard 2px border in
  `--color-border`. On hover/focus: border swaps to `--color-border-active`
  and a small offset amber shadow appears (`--shadow-pixel-sm`). Card padding
  uses `--card-padding`; never inline rems.

- **ArticleHeader / ArticleMeta** — meta line uses `--type-meta-*` (JetBrains
  Mono, smaller, snug leading). Date format via `Intl.DateTimeFormat` so
  server and client agree.

- **Chip** (category, tag) — monospace label, `--type-label-*` (uppercase,
  letter-spacing wide). Hair border, surface-2 background.

- **AuthorByline** — small mono label + name in sans. Tight composition.

- **Pagination** — discrete prev/next buttons, hard borders, no rounding.
  Keyboard reachable; current page is `aria-current="page"`.

- **SiteHeader / SiteNav** — logo in `--font-display` at `--size-display-100`,
  pixel-snapped. Nav items in mono. Theme toggle and a single skip-link
  anchor.

- **SiteFooter** — meta info, license, machine-readable links (RSS, JSON
  Feed, sitemap, llms.txt).

- **CodeBlock** — Shiki-rendered at build time, zero client JS. Dual theme
  via CSS variables (Shiki's `themes` option). Surface uses `--color-surface-2`.

- **Callout** — left-edge accent bar (3px amber). No background tint on dark;
  subtle on light. Variants share the same border idiom.

- **Figure** — caption uses `--type-meta-*`. Border on the image is amber
  hairline only if pixel-art content; photographs get no border.

- **NewsletterCTA** — placeholder block. No form submission yet. Label, hint
  text, disabled-looking input. When wired: real `<form>`, `<label>` linked,
  16px input text minimum (iOS no-zoom), `inputmode="email"`,
  `enterkeyhint="send"`.

---

## 7. Do's and Don'ts

**Do**

- Consume only semantic tokens in components (`--color-*`, `--type-*`,
  `--space-*`, `--shadow-pixel-*`). The stylelint gate enforces it.
- Use CSS logical properties (`margin-inline`, `padding-block`, `inset-*`).
  No `left`/`right` hardcoded; RTL is then ~free later.
- Write base styles for mobile first. Scale up via `@media (min-width: …)`
  using breakpoint tokens.
- Prefer native elements (`<button>`, `<a>`, `<details>`, `<dialog>`) over
  `div + onClick` patterns.
- Use CSS-only state when possible: `:has()`, `:user-invalid`,
  `:focus-within`, `[hidden="until-found"]`.
- Use `prefers-reduced-motion` on every animation, not just nice-to-haves.

**Don't**

- Don't write a hex value, a font-family literal, or a raw `px` in any
  `*.module.scss`. (Stylelint will fail.)
- Don't put `font-display` on body or small text. Headings only.
- Don't add a second accent color, soft shadows, or radii beyond
  `--radius-sm`.
- Don't reach for ARIA when a native element would do.
- Don't break the URL contract — slugs are the addressable identity of a
  post; never derive them from titles at render time.

---

## 8. Responsive intent

**Mobile-first** without exception. The mobile layout is the contract;
larger viewports add affordances, not different content.

- **Base styles** target the narrowest viewport (≥320px usable).
- **Apply media queries** with `min-width` from the breakpoint tokens:
  `sm 640`, `md 768`, `lg 1024`, `xl 1280`.
- Reading column maxes out at `--container-reading` (`68ch`); the layout
  shell at `--container-wide` (`76rem`).
- Hit targets are ≥24×24 px (WCAG 2.2 AA), preferred ≥44×44 px on mobile.
- Use `dvh`/`svh` for full-height surfaces, never `100vh` alone.
- Use `content-visibility: auto` + `contain-intrinsic-size` on long lists
  and off-screen sections — measurable performance, no behavior change.

---

## 9. Agent prompt guide

Read this before implementing UI. **These rules override defaults.**

1. **No raw values.** Never write a hex color, a literal `font-family`, or a
   bare `px` in a component stylesheet. Use semantic tokens. Stylelint will
   block the build otherwise.
2. **Mobile-first cascade.** Base rules are mobile. Wider viewports use
   `min-width` media queries with breakpoint tokens. No `max-width` waterfall.
3. **Logical properties.** Use `margin-inline`, `padding-block`, `inset-*`,
   `border-inline-start` etc. Treat `left`/`right` as a smell.
4. **Native first.** `<button>`, `<a>`, `<details>`, `<dialog>`, `<input>` —
   reach for ARIA only when nothing native fits.
5. **Focus is sacred.** `:focus-visible` ring is 2px in `--color-focus` at 2px
   offset. Never disable it. Always keep contrast ≥3:1 against the
   surroundings.
6. **`prefers-reduced-motion`.** Every animation must opt-out gracefully.
7. **Pixel idiom dosage.** Pixel touches (Departure font, hard offset
   shadows) are punctuation. If a card has a pixel shadow, the chips inside
   should not.
8. **Light theme is a token swap.** If your component needs an
   `@media (prefers-color-scheme: light)` or `[data-theme="light"]` rule of
   its own, you've usually used a raw value — go fix the token instead.
9. **Mark unknowns.** If a design decision isn't expressed in tokens or in
   sections 1–8 above, **stop and ask** before inventing one.

---

<!-- GENERATED:tokens -->
<!-- The fragment below is overwritten by `pnpm tokens:build` —
     edit tokens/, not this region. -->
<!-- /GENERATED:tokens -->
