# automation.news

A static news desk for industrial, business-process, RPA and AI automation.

- **Stack:** Next.js 16 (App Router, Turbopack), TypeScript strict, SCSS Modules.
- **Content:** MDX in this repository, no CMS — `content-collections` with
  Zod-validated frontmatter.
- **Design system:** DTCG tokens → Style Dictionary v5 → CSS variables.
  Binding contract lives in [`DESIGN.md`](./DESIGN.md).
- **Agent-readiness:** stable URLs, JSON-LD, RSS, JSON Feed, llms.txt,
  per-page raw markdown, RFC 9727 api-catalog, HTTP Link headers.

## Quick start

```sh
pnpm install
pnpm tokens:build  # runs automatically on dev/build, but you can do it manually
pnpm dev
```

Production build:

```sh
pnpm build && pnpm start
```

Pre-commit gates (the CI runs the same):

```sh
pnpm typecheck
pnpm lint
pnpm stylelint     # design-token gate — no raw hex/px/font-family in components
pnpm format:check
pnpm build
```

## Repo layout

```
tokens/                       DTCG token sources — single source of truth
build-tokens.mjs              Style Dictionary pipeline → src/styles/generated
DESIGN.authored.md            authored sections (1, 4, 7, 8, 9)
DESIGN.md                     authored + generated; committed; regenerated on every tokens:build

content/                      MDX articles and YAML taxonomy
content-collections.ts        Zod schemas + Shiki dual-theme MDX compile

src/
  app/                        Next.js App Router (route groups, /(site), feeds, well-known)
  components/layout/          UI primitives — consume tokens via var(--…)
  components/mdx/             prose styles + MDX component overrides
  components/seo/             JsonLd + SpeculationRules
  lib/content/                THE ONLY way to read content (never import "content-collections" from app/)
  lib/site.ts                 SITE_URL / SITE_NAME / IS_PREVIEW
  styles/generated/           Style Dictionary output (committed; auditable in PRs; do not edit)
  proxy.ts                    Link header + /posts/<slug>.md rewrite (was middleware.ts pre-Next-16)
```

## Adding a new article

Create `content/articles/<year>/<date>-<slug>.mdx`:

```mdx
---
slug: my-article # URL contract — never derived from title
title: "My article"
description: "One-paragraph summary."
date: 2026-01-20
category: ai # one of: ai | rpa | industrial | business-process | policy
tags: [some-tag, another] # lowercase kebab-case
author: editorial # matches a file in content/authors/
---

Body here.
```

The build fails (loudly) on any frontmatter that breaks the schema. The
`slug` is the addressable identity of the article — once published, do
not rename it; add a 301 redirect in `next.config.ts` if you must.

### Adding a category or author

- **Category:** add a YAML file in `content/categories/<slug>.yml` AND
  extend the `articleCategory` enum in `content-collections.ts`. The enum
  exists to catch typos in frontmatter at build time.
- **Author:** add `content/authors/<slug>.yml` (no schema change needed).

## Design tokens

Tokens are the **single source of truth** for color/typography/space/etc.
Components consume only semantic CSS variables (`var(--color-*)`,
`var(--type-*-size)`, `var(--space-*)`, `var(--shadow-pixel-*)` …).
Stylelint blocks raw hex, raw px, and literal `font-family` in
`src/**/*.module.scss`.

After editing `tokens/`:

```sh
pnpm tokens:build
```

Outputs:

- `src/styles/generated/tokens.css` — `:root` vars (primitives + dark semantic + component)
- `src/styles/generated/tokens.light.css` — `[data-theme="light"]` overrides
- `src/styles/generated/_tokens.scss` — SCSS variables (use in @media)
- `src/styles/generated/_tokens-map.scss` — flat `$tokens` map + `token()` helper
- `DESIGN.md` — authored + generated sections spliced together

Read [`DESIGN.md`](./DESIGN.md) before writing UI. Sections **1, 4, 7,
8, 9** are binding; **2, 3, 5, 6, 4b** are generated and must not be
hand-edited.

## Live styleguide

`/styleguide` is the in-repo catalogue — every primitive rendered against
the live design system, plus an auto-generated token table sourced
directly from `tokens/*.tokens.json`. Marked `robots: noindex`.

## Agent-readiness surfaces

| URL                         | What                                                                          |
| --------------------------- | ----------------------------------------------------------------------------- |
| `/sitemap.xml`              | Home, categories, tags, articles.                                             |
| `/robots.txt`               | AI-crawler policy (see below).                                                |
| `/rss`                      | RSS 2.0 (force-static).                                                       |
| `/feed.json`                | JSON Feed 1.1.                                                                |
| `/llms.txt`                 | Curated markdown index for LLMs.                                              |
| `/posts/<slug>.md`          | Raw markdown source per article (proxy rewrite → `/api/post-source/<slug>`).  |
| `/.well-known/security.txt` | Vulnerability-disclosure contact.                                             |
| `/.well-known/api-catalog`  | RFC 9727 linkset JSON.                                                        |
| `Link` header               | Every response advertises sitemap + RSS + feed.json + llms.txt + api-catalog. |

On article pages, the HTML carries `NewsArticle` and `BreadcrumbList`
JSON-LD. The (site) layout carries `WebSite` + `Organization`.

### AI-crawler policy

`src/app/robots.ts` lists named user-agents under two buckets:

- **Search & citation** (`OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`,
  `Perplexity-User`, `Claude-SearchBot`, `Claude-User`): **allowed** —
  they drive cited traffic.
- **Training** (`GPTBot`, `ClaudeBot`, `Google-Extended`,
  `Applebot-Extended`, `CCBot`, `Amazonbot`): **allowed by default**.
  Flip to `disallow` by setting `AI_TRAINING_DISALLOW=1` in env.

The named-UA list **must be reviewed quarterly** — agents launch, rename,
or split (e.g. `ChatGPT-User` vs `OAI-SearchBot` distinction). Track
changes against the OWASP / robotstxt.org bot inventories.

`IS_PREVIEW` (true on Vercel preview env or when `NEXT_PUBLIC_NOINDEX=1`)
forces a hard `noindex` + `disallow: /` everywhere.

Non-compliant crawlers that ignore robots.txt (e.g. Bytespider) are an
**infra concern**, not an app concern — block at the Vercel Firewall.

## CSP

Locked in at Stage 5: `script-src 'self' 'unsafe-inline'` and
`style-src 'self' 'unsafe-inline'`. Trade-off considered:

- **Nonce-based** would force every page out of pure SSG into proxy-
  rendered dynamic. Not acceptable for a static-first news site.
- **Hash-based** is brittle in Next.js — bundle hashes rotate between
  minor versions, and per-article JSON-LD payloads would each need
  their own hash.
- **`'self' 'unsafe-inline'`** for script/style keeps SSG, accepts the
  weaker XSS posture which is acceptable because: (a) zero user-generated
  content, (b) zero third-party scripts, (c) all inline payloads are
  data (JSON-LD) or Next.js hydration shims.

`frame-ancestors 'none'`, `object-src 'none'`, and `base-uri 'self'`
still close the meaningful attack surfaces.

## Security headers

Applied via `next.config.ts` `headers()`:

- HSTS: `max-age=63072000; includeSubDomains`. **`preload` is omitted
  deliberately** — adding `preload` is an effectively permanent
  commitment that should be made post-launch in infra once you're
  confident the cert/CN/etc. are stable.
- `x-content-type-options: nosniff`
- `referrer-policy: strict-origin-when-cross-origin`
- `x-frame-options: DENY`
- `permissions-policy`: camera/mic/geolocation/payment/usb all off
- `no-vary-search: params, except=("q")` — utm\_\*/gclid/fbclid don't bust cache

## CI gates

`.github/workflows/ci.yml`:

- **`quality`** job (every push + PR, Node 20 + pnpm 10):
  `tokens:build` → `tsc --noEmit` → eslint → stylelint → `format:check`
  → `next build` (Turbopack). Any failure blocks merge.
- **`lighthouse`** job (PRs only): waits for the Vercel preview,
  runs LHCI against home + a sample post + a category page. Budgets in
  `.lighthouserc.json`: **Accessibility = 1.0**, **SEO = 1.0**,
  Best-Practices ≥ 0.95, Performance ≥ 0.9; LCP ≤ 2.5s, CLS ≤ 0.1.
- **`spec-smoke`** step in the lighthouse job: asserts every security
  header, the CSP `frame-ancestors 'none'`, the Link header relations,
  and every agent/well-known endpoint returns 200.

Branch protection on `main` (configured in GitHub, not in this file)
**must** require both `quality` and `lighthouse` checks.

## Infra checklist (not in this repo)

- **Domain:** point `automation.news` apex + `www` to the Vercel project.
- **DNS CAA:** restrict cert issuance to your chosen CA. Vercel's CA is
  typically `letsencrypt.org`.
- **HSTS preload:** _after_ HSTS has been served from production for
  ≥ a few weeks with `max-age` of 2 years and no surprises, submit at
  https://hstspreload.org. This change is effectively permanent.
- **Vercel env vars:** `SITE_URL` (production canonical), optionally
  `AI_TRAINING_DISALLOW=1` to block training crawlers.
- **Uptime monitor:** a third-party (BetterStack, Pingdom, etc.) hitting
  `/sitemap.xml` and the home page. Status page on a separate host so a
  Vercel outage doesn't take both down.
- **WAF / Vercel Firewall:** block crawlers that ignore robots.txt
  (Bytespider has been a frequent offender). Rate-limit `/api/*`.

## Versions pinned

- Next.js 16.2.7 (Turbopack default; `middleware.ts` → `proxy.ts` rename).
- React 19.
- `content-collections` 0.15.x — **pre-1.0**, expect minor API churn.
  The `collections` → `content` config rename and the explicit `content`
  field on each schema are already adopted.
- `style-dictionary` 5.4.x — **pre-1.0**, DTCG `$value` shapes can
  shift; dimension values use strings ("1rem") not the `{value,unit}`
  object form to sidestep known v4/v5 transform edge cases.

## Future watchlist

- **Cache Components / ISR.** Currently 100% SSG. When traffic +
  publishing cadence push past the build-time budget, flip
  `src/lib/content` and add `unstable_cache` / cache directives —
  callers don't need to change.
- **Agent Skills well-known.** Draft proposal (Cloudflare). Cheap to
  ship later once standardised.
- **Search.** Pagefind or Orama, indexed at build.
- **Real newsletter wiring.** `<NewsletterCTA>` is a placeholder.
- **Mobile-first foundation already laid.** Logical properties +
  `lang` + locale-ready URL structure (root = English). Real
  multilingual support — hreflang, language switcher, plural rules,
  metadata translation — not built; foundations don't need to change
  when added.

## License

Code: not yet licensed publicly. Departure Mono font included under
SIL OFL 1.1 (`public/fonts/DepartureMono-LICENSE.txt`).
