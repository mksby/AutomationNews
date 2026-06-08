import type { Metadata, Viewport } from "next";
import "@/styles/generated/tokens.css";
import "@/styles/generated/tokens.light.css";
import "./globals.scss";

export const metadata: Metadata = {
  title: {
    default: "automation.news",
    template: "%s · automation.news",
  },
  description: "News and analysis on industrial, business-process, RPA and AI automation.",
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
