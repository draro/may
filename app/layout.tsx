import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Providers from "@/components/layout/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NYC Professional Photographer | Architecture, Interiors & Travel Photography",
  description: "Award-winning NYC-based photographer specializing in architectural photography, interior design, and travel documentation. Available for commercial and editorial projects.",
  keywords: ["photographer", "NYC photographer", "architecture photography", "interior photography", "travel photography", "commercial photographer", "New York"],
  authors: [{ name: "Professional Photographer NYC" }],
  openGraph: {
    title: "NYC Professional Photographer Portfolio",
    description: "Explore stunning architecture, interior, and travel photography by a professional NYC-based photographer.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "NYC Professional Photographer Portfolio",
    description: "Architecture, Interior & Travel Photography",
  },
  robots: {
    index: true,
    follow: true,
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
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}
      >
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
