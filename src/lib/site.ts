export const SITE = {
  name: "Troița",
  url: "https://www.troita.ro",
  tagline: "Calendarul ortodox, zi de zi",
  description:
    "Calendarul ortodox românesc: sfântul zilei, posturile și dezlegările, bisericile și troițele din toată țara. Aplicația Troița vine pe Google Play.",
  operator: "Munteanu Catalin",
  email: "catalinmunteanudev@gmail.com",
  /** Set to the Play Store URL on launch day; the site switches to "Descarcă". */
  playStoreUrl: null as string | null,
  androidPackage: "ro.troita",
  /**
   * Search engine verification codes, only needed if you verify with a meta
   * tag instead of DNS. Google: the content of google-site-verification.
   * Bing: the content of msvalidate.01 (or import the site from Search
   * Console in Bing Webmaster Tools, which needs no code at all).
   */
  verification: {
    google: null as string | null,
    bing: null as string | null,
  },
};

/**
 * Google AdSense. Everything ad-related stays off until `client` is set, so
 * the site can be deployed and reviewed before the AdSense account exists.
 *
 *  - client: the publisher ID from AdSense → Account → Account information,
 *    written as "ca-pub-1234567890123456". It also produces /ads.txt and
 *    /app-ads.txt (AdMob reads the latter for the Android app).
 *  - slots: ad unit IDs from AdSense → Ads → By ad unit → Display ads. Leave a
 *    slot null to rely on Auto ads alone.
 *
 * The cookie banner is Google's own (AdSense → Privacy & messaging → European
 * regulations message). It is a Google-certified CMP, which Google requires in
 * the EEA, and it loads together with the AdSense script: no code needed here.
 */
export const ADS = {
  client: null as string | null,
  slots: {
    inContent: null as string | null,
  },
  /**
   * True only from the app release that actually ships Google AdMob. The
   * privacy policy's AdMob section is shown only then: Google Play checks that
   * the policy and the Data safety form describe what the app really does, and
   * today the app has no ads.
   */
  inApp: false,
};

export const NAV = [
  { href: "/azi", label: "Azi" },
  { href: "/calendar-ortodox", label: "Calendar" },
  { href: "/posturi", label: "Posturi" },
  { href: "/despre", label: "Despre" },
];
