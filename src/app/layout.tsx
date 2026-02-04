import type { Metadata, Viewport } from "next";
import { Delius_Swash_Caps, Delius } from "next/font/google";
import "./globals.css";

const deliusSwash = Delius_Swash_Caps({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-delius-swash",
});

const deliusRegular = Delius({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-delius",
});

export const metadata: Metadata = {
  title: "Georgia + Riley 🥳",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#a952b3",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${deliusRegular.variable} ${deliusSwash.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
