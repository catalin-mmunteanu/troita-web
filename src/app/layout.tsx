import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Footer, Header } from "@/components/chrome";
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
  // Paste the token from Google Search Console here if you verify with a meta
  // tag instead of DNS: verification: { google: "..." }
  // AdSense site verification ("Meta tag" option in AdSense → Sites).
  ...(ADS.client ? { other: { "google-adsense-account": ADS.client } } : {}),
};

export const viewport: Viewport = {
  themeColor: "#5c1321",
  colorScheme: "light",
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
    <html lang="ro" className="h-full">
      <head>
        <link rel="preload" href="/fonts/fraunces-latin-full-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/geist-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
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
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-burgundy focus:px-4 focus:py-2 focus:text-paper"
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
