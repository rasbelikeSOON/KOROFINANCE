import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import NewsletterPopup from "@/components/common/NewsletterPopup";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://korofinance.com'),
  title: "Korofinance | Where money makes sense.",
  description: "Simplifying financial growth, real-time markets, and economy insights for every Nigerian.",
  icons: {
    icon: "/favicon-premium.png",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://korofinance.com",
  },
  openGraph: {
    title: "Korofinance",
    description: "Africa's sharpest financial digest & real-time market terminal.",
    url: "https://korofinance.com",
    siteName: "Korofinance",
    images: [
      {
        url: "/og-image.jpg",
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
    description: "Where money makes sense. Real-time NGX stocks, Crypto, and African financial news.",
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
    <html lang="en" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        <NewsletterPopup />
      </body>
    </html>
  );
}
