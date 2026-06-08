@AGENTS.md

# automation.news — assistant rules

## Design contract

All UI work follows **[`DESIGN.md`](./DESIGN.md)**. Read it before generating
or editing any component.

- Authored sections **1, 4, 7, 8, 9** are binding — do not invent against them.
- Sections **2, 3, 5, 6** and **4b** are generated from `tokens/` by
  `pnpm tokens:build`. Never edit them by hand. Edit the DTCG sources under
  `tokens/` and rerun the build.

## Token contract (stylelint-enforced)

Component SCSS modules (`src/**/*.module.scss`) may consume **only** semantic
tokens via CSS variables:

- `var(--color-*)` for color
- `var(--space-*)`, `var(--container-*)`, `var(--border-*)`, `var(--radius-*)`
- `var(--type-*-size)`, `var(--type-*-leading)`, `var(--font-family-*)`
- `var(--shadow-pixel-*)`
- `var(--duration-*)`, `var(--easing-*)`
- `var(--z-*)`

Raw `#hex`, raw `px`, and literal `font-family` strings in component files
will fail `pnpm stylelint`. `tokens/` and `src/styles/generated/` are the
only places where literal values are permitted.

## Mobile-first

Always write the narrowest-viewport rule first; widen via `@media (min-width: …)`
using `--breakpoint-*` tokens. No `max-width` cascades.

## Logical properties

Use `margin-inline`, `padding-block`, `inset-*`, `border-inline-start`, etc.
Hardcoded `left`/`right` is a code smell — RTL must be a no-op later.
