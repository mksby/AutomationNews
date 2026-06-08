/**
 * Stylelint enforces the design-token contract:
 *
 *   In component SCSS modules (src/**\/*.module.scss), raw color values,
 *   raw px units, and literal font-family declarations are forbidden.
 *   Components consume tokens only — `var(--color-*)`, `var(--space-*)`,
 *   `var(--type-*)`, etc.
 *
 *   Token sources (`tokens/`) and the Style-Dictionary output
 *   (`src/styles/generated/`) are exempt — that is where literal values
 *   are allowed to live.
 */
/** @type {import('stylelint').Config} */
const config = {
  extends: ["stylelint-config-standard-scss", "stylelint-config-prettier-scss"],
  ignoreFiles: [
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "src/styles/generated/**",
    ".content-collections/**",
  ],
  rules: {
    // Pixel-art idiom uses 0 radius/no shadow blur — allow custom property names freely.
    "custom-property-pattern": null,
    "selector-class-pattern": null,
    "scss/dollar-variable-pattern": null,
    "scss/at-mixin-pattern": null,
    "scss/at-function-pattern": null,
    // Allow CSS Modules `:global(...)` selectors.
    "selector-pseudo-class-no-unknown": [true, { ignorePseudoClasses: ["global", "local"] }],
    "no-descending-specificity": null,
    "scss/no-global-function-names": null,
  },
  overrides: [
    {
      files: ["src/**/*.module.scss"],
      rules: {
        "color-no-hex": true,
        "color-named": "never",
        // px is forbidden in declarations — but @media (min-width: …) needs raw
        // pixel values (CSS variables don't resolve inside media-query expressions).
        // The breakpoint tokens are the source of truth; keep them in sync with
        // tokens/primitive/dimension.tokens.json by convention.
        "unit-disallowed-list": [
          ["px"],
          {
            ignoreMediaFeatureNames: {
              px: ["min-width", "max-width", "min-height", "max-height"],
            },
            message:
              "Raw px is not allowed in component styles — use a spacing/type/border token (var(--space-*), var(--type-*), var(--border-*)).",
          },
        ],
        "media-feature-range-notation": null,
        "declaration-property-value-allowed-list": [
          {
            // Allow either a direct font-stack token (--font-family-*) or a
            // semantic type-role family (--type-*-family).
            "font-family": ["/^var\\(--font-/", "/^var\\(--type-.+-family\\)/"],
          },
          {
            message:
              "font-family must reference a token: var(--font-family-*) or var(--type-*-family).",
          },
        ],
      },
    },
    {
      // Global stylesheet may set up resets/base rules but should still avoid hex.
      files: ["src/app/globals.scss", "src/styles/**/*.scss"],
      rules: {
        "color-no-hex": true,
      },
    },
    {
      // Prose styles do typography micro-adjustments (underline thickness/offset,
      // inline-code padding) that have no semantic token. Tokens still required
      // for color/font-family — only the px-gate is relaxed here.
      files: ["src/components/mdx/prose.module.scss"],
      rules: {
        "unit-disallowed-list": null,
      },
    },
  ],
};

export default config;
