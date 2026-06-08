import type { NextConfig } from "next";
import { withContentCollections } from "@content-collections/next";

/**
 * Security & resilience headers applied to every response.
 *
 * CSP rationale (locked in at Stage 5):
 *   We're a content-only static news site — no user-generated content,
 *   no third-party scripts. Inline scripts come from two sources only:
 *   (a) Next.js hydration shims, (b) our own JSON-LD payloads (data, not
 *   executable). Using nonce-based CSP would force every page out of
 *   pure SSG into proxy-rendered dynamic; hash-based CSP is brittle in
 *   Next.js because the bundler rotates hashes between minor versions.
 *   So script-src/style-src include 'unsafe-inline'. frame-ancestors
 *   'none' + the surrounding directives keep the meaningful attack
 *   surface closed. See README ("CSP" section) for the trade-off.
 *
 * HSTS does NOT include `preload` — that's a near-irreversible commitment
 * to https that should be made deliberately, post-launch, in infra.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const PERMISSIONS_POLICY = [
  "camera=()",
  "microphone=()",
  "geolocation=()",
  "payment=()",
  "usb=()",
  "fullscreen=(self)",
].join(", ");

const SECURITY_HEADERS = [
  // Tell browsers to stick to HTTPS for two years. NO preload — preload
  // is effectively permanent; opt in later via the HSTS preload list
  // manually once you're sure the cert/CN/etc. are stable.
  {
    key: "strict-transport-security",
    value: "max-age=63072000; includeSubDomains",
  },
  { key: "x-content-type-options", value: "nosniff" },
  { key: "referrer-policy", value: "strict-origin-when-cross-origin" },
  { key: "x-frame-options", value: "DENY" },
  { key: "permissions-policy", value: PERMISSIONS_POLICY },
  { key: "content-security-policy", value: CSP },
  // Stops utm_* / fbclid / gclid query variants from busting the cache.
  { key: "no-vary-search", value: 'params, except=("q")' },
];

const nextConfig: NextConfig = {
  // Next 16's image pipeline ships modern formats by default; keep the
  // formats list explicit so a stale config can't regress us.
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
    ];
  },
  async redirects() {
    // Reserve here for any future slug renames — 308 keeps method + body.
    return [];
  },
};

// withContentCollections must be the outermost plugin. The cast pins the
// return type to NextConfig: the wrapper's own type declaration is slightly
// out of step with Next 16's interface, which is a known nuisance with these
// pre-1.0 versions.
export default withContentCollections(nextConfig) as NextConfig;
