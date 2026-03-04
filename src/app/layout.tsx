import type { Metadata } from "next";
import { Syne, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import NewsletterPopup from "@/components/common/NewsletterPopup";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://korofinance.com'),
  title: "Korofinance | Money's an easy thing.",
  description: "Simplifying financial growth, real-time markets, and economy insights for every Nigerian.",
  icons: {
    icon: "/favicon-premium.png",
  },
  openGraph: {
    title: "Korofinance",
    description: "Africa's sharpest financial digest & real-time market terminal.",
    url: "https://korofinance.com",
    siteName: "Korofinance",
    images: [
      {
        url: "/og-image.jpg", // We'll assume/use a generic placeholder path for now, user can swap
        width: 1200,
        height: 630,
        alt: "Korofinance Market Dashboard Preview",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Korofinance",
    description: "Money's an easy thing. Real-time NGX stocks, Crypto, and African financial news.",
    images: ["/og-image.jpg"],
    creator: "@korofinance",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${syne.variable} ${instrumentSans.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        <NewsletterPopup />
      </body>
    </html>
  );
}
