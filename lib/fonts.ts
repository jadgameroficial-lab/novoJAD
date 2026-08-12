import { Inter } from "next/font/google";
import localFont from "next/font/local";

export const interFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const jadWordmarkFont = localFont({
  src: "../public/fonts/researcher.ttf",
  variable: "--font-jad-wordmark",
  display: "swap",
});
