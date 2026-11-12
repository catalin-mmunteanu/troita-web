import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Footer, Header } from "@/components/chrome";
import { THEME_INIT_SCRIPT } from "@/components/theme-toggle";
import { ADS, SITE } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name}: ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    siteName: SITE.name,
    url: SITE.url,
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
  // Search engine and AdSense verification meta tags, each only when its code
  // is set in src/lib/site.ts (DNS verification needs none of them).
  verification: {
    ...(SITE.verification.google ? { google: SITE.verification.google } : {}),
    other: {
      ...(SITE.verification.bing ? { "msvalidate.01": SITE.verification.bing } : {}),
      ...(ADS.client ? { "google-adsense-account": ADS.client } : {}),
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdfbf7" },
    { media: "(prefers-color-scheme: dark)", color: "#141211" },
  ],
  colorScheme: "light dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      inLanguage: "ro-RO",
      description: SITE.description,
    },
    // A MobileApplication node belongs here on launch day, with `offers` and
    // the Play Store URL. Added before then, Search Console reports it as an
    // invalid Software App item (it requires a price and ratings).
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the theme script sets data-theme before React loads.
    <html lang="ro" className="h-full" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {/* The two faces seen above the fold; the rest load on demand. */}
        <link rel="preload" href="/fonts/literata-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/plus-jakarta-sans-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        {ADS.client && (
          // A plain <script>, not next/script: AdSense rejects the extra
          // data-nscript attribute next/script adds. Google's consent banner
          // (Privacy & messaging) is loaded by this same script.
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS.client}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#continut"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-sm focus:bg-red focus:px-4 focus:py-2 focus:text-on-red"
        >
          Sari la conținut
        </a>
        <Header />
        <main id="continut" className="flex-1">
          {children}
        </main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
