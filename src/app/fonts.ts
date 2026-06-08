import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

export const fontSans = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans-loaded",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono-loaded",
  display: "swap",
  weight: ["400", "500", "700"],
});

// Departure Mono is SIL OFL 1.1; the binary lives in public/fonts/.
export const fontDisplay = localFont({
  src: "../../public/fonts/departure-mono-regular.woff2",
  variable: "--font-display-loaded",
  display: "swap",
  weight: "400",
});

export const fontVariableClasses = [
  fontSans.variable,
  fontMono.variable,
  fontDisplay.variable,
].join(" ");
