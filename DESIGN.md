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
<!-- GENERATED: do not edit by hand -->

## 2. Color

### Color tokens

| Token | Value | Notes |
|---|---|---|
| `--color-charcoal-100` | `#e8e6e1` | Body on dark bg, 14.4:1 |
| `--color-charcoal-300` | `#a8aeb4` | Dimmed text on light bg |
| `--color-charcoal-400` | `#868d94` | Muted text, 5.3:1 on bg |
| `--color-charcoal-500` | `#5a6068` | UI outline, ≥3:1 contrast |
| `--color-charcoal-600` | `#33373e` | Hairline divider |
| `--color-charcoal-700` | `#25282e` | Elevated surface, code |
| `--color-charcoal-800` | `#1e2024` | Raw steel |
| `--color-charcoal-900` | `#16171b` | Concrete dark bg |
| `--color-charcoal-950` | `#0f1014` | Almost-black, sub-bg |
| `--color-paper-100` | `#fafaf7` | Light bg |
| `--color-paper-200` | `#f2f1ed` | Light surface |
| `--color-paper-300` | `#e6e4de` | Light elevated surface |
| `--color-paper-400` | `#d3d0c8` | Light border |
| `--color-amber-500` | `#f5a623` | Safety amber accent, 8.8:1 on dark bg |
| `--color-amber-600` | `#c8841a` | Amber on light bg, 4.6:1 |
| `--color-bg` | `#16171b` |  |
| `--color-bg-deep` | `#0f1014` |  |
| `--color-surface` | `#1e2024` |  |
| `--color-surface-2` | `#25282e` |  |
| `--color-border` | `#33373e` |  |
| `--color-border-active` | `#5a6068` |  |
| `--color-text` | `#e8e6e1` |  |
| `--color-text-muted` | `#868d94` |  |
| `--color-accent` | `#f5a623` |  |
| `--color-accent-strong` | `#c8841a` |  |
| `--color-focus` | `#f5a623` |  |

## 3. Typography

### Font families & weights

| Token | Value | Notes |
|---|---|---|
| `--font-family-sans` | `'Space Grotesk', system-ui, -apple-system, sans-serif` | Body and UI |
| `--font-family-mono` | `'JetBrains Mono', ui-monospace, Menlo, monospace` | Meta, labels, code |
| `--font-family-display` | `'Departure Mono', 'JetBrains Mono', ui-monospace, monospace` | Pixel display — headings/logo/decor only, never body |
| `--font-weight-regular` | `400` |  |
| `--font-weight-medium` | `500` |  |
| `--font-weight-bold` | `700` |  |

### Size scale

| Token | Value | Notes |
|---|---|---|
| `--size-type-100` | `0.75rem` | 12px — micro/meta |
| `--size-type-200` | `0.875rem` | 14px — meta |
| `--size-type-300` | `1rem` | 16px — body base |
| `--size-type-400` | `1.125rem` | 18px — large body |
| `--size-type-500` | `1.25rem` | 20px — h4/lead |
| `--size-type-600` | `1.5rem` | 24px — h3 |
| `--size-type-700` | `1.875rem` | 30px — h2 |
| `--size-type-800` | `2.5rem` | 40px — h1 |
| `--size-type-900` | `3.5rem` | 56px — display |
| `--size-display-100` | `1.375rem` | 22px (2×11) — Departure pixel-snap |
| `--size-display-200` | `2.0625rem` | 33px (3×11) — Departure pixel-snap |
| `--size-display-300` | `2.75rem` | 44px (4×11) — Departure pixel-snap |

### Line heights

| Token | Value | Notes |
|---|---|---|
| `--line-height-tight` | `1.1` |  |
| `--line-height-snug` | `1.3` |  |
| `--line-height-normal` | `1.55` |  |
| `--line-height-relaxed` | `1.75` |  |

### Letter spacing

| Token | Value | Notes |
|---|---|---|
| `--letter-spacing-tight` | `-0.02em` |  |
| `--letter-spacing-normal` | `0em` |  |
| `--letter-spacing-wide` | `0.04em` |  |
| `--letter-spacing-label` | `0.08em` |  |

### Type roles

| Token | Value | Notes |
|---|---|---|
| `--type-body-family` | `'Space Grotesk', system-ui, -apple-system, sans-serif` |  |
| `--type-body-size` | `1rem` |  |
| `--type-body-leading` | `1.55` |  |
| `--type-body-weight` | `400` |  |
| `--type-body-tracking` | `0em` |  |
| `--type-lead-size` | `1.25rem` |  |
| `--type-lead-leading` | `1.3` |  |
| `--type-meta-family` | `'JetBrains Mono', ui-monospace, Menlo, monospace` |  |
| `--type-meta-size` | `0.875rem` |  |
| `--type-meta-leading` | `1.3` |  |
| `--type-meta-tracking` | `0em` |  |
| `--type-label-family` | `'JetBrains Mono', ui-monospace, Menlo, monospace` |  |
| `--type-label-size` | `0.75rem` |  |
| `--type-label-leading` | `1.1` |  |
| `--type-label-tracking` | `0.08em` |  |
| `--type-label-weight` | `500` |  |
| `--type-h1-family` | `'Space Grotesk', system-ui, -apple-system, sans-serif` |  |
| `--type-h1-size` | `2.5rem` |  |
| `--type-h1-leading` | `1.1` |  |
| `--type-h1-weight` | `700` |  |
| `--type-h1-tracking` | `-0.02em` |  |
| `--type-h2-size` | `1.875rem` |  |
| `--type-h2-leading` | `1.1` |  |
| `--type-h2-weight` | `700` |  |
| `--type-h3-size` | `1.5rem` |  |
| `--type-h3-leading` | `1.3` |  |
| `--type-display-family` | `'Departure Mono', 'JetBrains Mono', ui-monospace, monospace` |  |
| `--type-display-size` | `2.75rem` |  |
| `--type-display-leading` | `1.1` |  |
| `--type-display-tracking` | `0em` |  |

## 5. Layout

### Spacing scale

| Token | Value | Notes |
|---|---|---|
| `--space-0` | `0` |  |
| `--space-1` | `0.25rem` | 4px |
| `--space-2` | `0.5rem` | 8px |
| `--space-3` | `0.75rem` | 12px |
| `--space-4` | `1rem` | 16px |
| `--space-5` | `1.5rem` | 24px |
| `--space-6` | `2rem` | 32px |
| `--space-7` | `3rem` | 48px |
| `--space-8` | `4rem` | 64px |
| `--space-9` | `6rem` | 96px |

### Border widths

| Token | Value | Notes |
|---|---|---|
| `--border-hair` | `1px` | Subtle divider |
| `--border-hard` | `2px` | Pixel-loft default border |
| `--border-thick` | `3px` | Emphasis/focus |

### Radii

| Token | Value | Notes |
|---|---|---|
| `--radius-none` | `0` | Pixel idiom default |
| `--radius-sm` | `2px` | Discrete pixel chamfer — rare |

### Breakpoints (min-width)

| Token | Value | Notes |
|---|---|---|
| `--breakpoint-sm` | `640px` |  |
| `--breakpoint-md` | `768px` |  |
| `--breakpoint-lg` | `1024px` |  |
| `--breakpoint-xl` | `1280px` |  |

### Container widths

| Token | Value | Notes |
|---|---|---|
| `--container-reading` | `68ch` | Article body max-inline-size |
| `--container-wide` | `76rem` | Layout max-width |

## 6. Depth

### Pixel shadows

| Token | Value | Notes |
|---|---|---|
| `--shadow-pixel-sm` | `3px 3px 0 0 #f5a623` |  |
| `--shadow-pixel-md` | `6px 6px 0 0 #f5a623` |  |
| `--shadow-pixel-border` | `4px 4px 0 0 #5a6068` |  |

### Motion durations

| Token | Value | Notes |
|---|---|---|
| `--duration-instant` | `75ms` |  |
| `--duration-fast` | `150ms` |  |
| `--duration-base` | `250ms` |  |
| `--duration-slow` | `400ms` |  |

### Motion easings

| Token | Value | Notes |
|---|---|---|
| `--easing-standard` | `cubic-bezier(0.2, 0, 0, 1)` |  |
| `--easing-out` | `cubic-bezier(0, 0, 0, 1)` |  |
| `--easing-in` | `cubic-bezier(0.4, 0, 1, 1)` |  |

### z-index scale

| Token | Value | Notes |
|---|---|---|
| `--z-base` | `0` |  |
| `--z-raised` | `10` |  |
| `--z-sticky` | `100` |  |
| `--z-header` | `200` |  |
| `--z-overlay` | `1000` |  |
| `--z-skiplink` | `9999` |  |

## 4b. Component tokens

### Card

| Token | Value | Notes |
|---|---|---|
| `--card-bg` | `#1e2024` |  |
| `--card-border` | `#33373e` |  |
| `--card-border-hover` | `#5a6068` |  |
| `--card-padding` | `1.5rem` |  |
| `--card-gap` | `0.75rem` |  |

### Chip

| Token | Value | Notes |
|---|---|---|
| `--chip-bg` | `#25282e` |  |
| `--chip-text` | `#868d94` |  |
| `--chip-border` | `#33373e` |  |
| `--chip-padding-x` | `0.5rem` |  |
| `--chip-padding-y` | `0.25rem` |  |

<!-- /GENERATED -->

<!-- /GENERATED:tokens -->
