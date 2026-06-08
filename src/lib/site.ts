/**
 * Single source of truth for site identity. Override the URL via the
 * SITE_URL env var (Vercel sets this in production / preview).
 */

export const SITE_URL = process.env.SITE_URL?.replace(/\/$/, "") ?? "https://automation.news";

export const SITE_NAME = "automation.news";

export const SITE_DESCRIPTION =
  "News and analysis on industrial, business-process, RPA and AI automation.";

export const SITE_LOCALE = "en-US";

export const SITE_PUBLISHER = {
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
} as const;

export const IS_PREVIEW =
  process.env.VERCEL_ENV === "preview" || process.env.NEXT_PUBLIC_NOINDEX === "1";

export function absoluteUrl(pathname: string): string {
  const clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE_URL}${clean}`;
}
