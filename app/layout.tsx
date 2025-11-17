import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Providers from "@/components/layout/Providers";
import clientPromise from "@/lib/db/mongodb";
import { SiteConfig } from "@/models/SiteConfig";

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

async function getSiteConfig(): Promise<SiteConfig | null> {
  try {
    const client = await clientPromise;
    const db = client.db('portfolio');
    const config = await db.collection<SiteConfig>('siteConfig').findOne({});
    return config;
  } catch (error) {
    console.error('Error fetching site config for metadata:', error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();

  if (!config) {
    // Default fallback metadata
    return {
      title: "NYC Professional Photographer | Architecture, Interiors & Travel Photography",
      description: "Award-winning NYC-based photographer specializing in architectural photography, interior design, and travel documentation.",
      keywords: ["photographer", "NYC photographer", "architecture photography", "interior photography", "travel photography"],
      robots: {
        index: true,
        follow: true,
      },
    };
  }

  const metadata: Metadata = {
    title: config.seo.title,
    description: config.seo.description,
    keywords: config.seo.keywords,
    authors: [{ name: "Professional Photographer NYC" }],
    openGraph: {
      title: config.seo.title,
      description: config.seo.description,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: config.seo.title,
      description: config.seo.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };

  // Add favicon if configured
  if (config.seo.favicon) {
    metadata.icons = {
      icon: config.seo.favicon,
      shortcut: config.seo.favicon,
      apple: config.seo.favicon,
    };
  }

  return metadata;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
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
