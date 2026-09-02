import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ampara — van kennis naar bescherming",
    template: "%s | Ampara",
  },
  description:
    "Ampara verbindt publieke kennis aan politieke keuzes, democratische besluiten en controleerbare uitvoering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
