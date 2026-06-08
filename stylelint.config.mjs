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
        "unit-disallowed-list": [
          ["px"],
          {
            message:
              "Raw px is not allowed in component styles — use a spacing/type/border token (var(--space-*), var(--type-*), var(--border-*)).",
          },
        ],
        "declaration-property-value-allowed-list": [
          {
            "font-family": ["/^var\\(--font-/"],
          },
          {
            message:
              "font-family must reference a token: var(--font-sans|--font-mono|--font-display).",
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
  ],
};

export default config;
