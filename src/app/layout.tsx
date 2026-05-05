import { RSVPProvider } from "@/components/RSVPModal/RSVPContext";
import type { Metadata, Viewport } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-quicksand",
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
      className={`${quicksand.variable} antialiased`}
    >
      <body>
        <RSVPProvider>{children}</RSVPProvider>
      </body>
    </html>
  );
}
