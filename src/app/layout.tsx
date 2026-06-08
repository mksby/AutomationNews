import type { Metadata, Viewport } from "next";
import "@/styles/generated/tokens.css";
import "@/styles/generated/tokens.light.css";
import "./globals.scss";
import { fontVariableClasses } from "./fonts";
import { IS_PREVIEW, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  robots: IS_PREVIEW ? { index: false, follow: false } : { index: true, follow: true },
  alternates: {
    types: {
      "application/rss+xml": "/rss",
      "application/feed+json": "/feed.json",
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#16171B" },
    { media: "(prefers-color-scheme: light)", color: "#FAFAF7" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariableClasses}>
      <body>{children}</body>
    </html>
  );
}
