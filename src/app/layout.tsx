import type { Metadata } from "next";
import { Delius_Swash_Caps, Delius, Cherry_Bomb_One } from "next/font/google";
import "./globals.css";
import ScrollGradient from "@/components/scroll_gradient";

const deliusSwashCaps = Delius_Swash_Caps({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-delius-swash-caps",
});

const deliusRegular = Delius({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-delius",
});

export const metadata: Metadata = {
  title: "Georgia + Riley 🥳",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${deliusRegular.variable} ${deliusSwashCaps.variable}`}>
        <div className="gradient-bg min-h-full">
          <ScrollGradient />
          {children}
          </div>
          </body>
    </html>
  );
}
