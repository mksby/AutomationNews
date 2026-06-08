import type { Metadata, Viewport } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: {
    default: "automation.news",
    template: "%s · automation.news",
  },
  description: "News and analysis on industrial, business-process, RPA and AI automation.",
};

export const viewport: Viewport = {
  themeColor: "#16171B",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
