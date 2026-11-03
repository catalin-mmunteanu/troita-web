export const SITE = {
  name: "Troița",
  url: "https://www.troita.ro",
  tagline: "Calendarul ortodox, zi de zi",
  description:
    "Troița: calendarul ortodox românesc pe telefon. Sfântul zilei, posturile și dezlegările, bisericile, mănăstirile și troițele de pe hartă. Aplicația vine în curând pe Google Play.",
  operator: "Munteanu Catalin",
  email: "catalinmunteanudev@gmail.com",
  /** Set to the Play Store URL on launch day; the site switches to "Descarcă". */
  playStoreUrl: null as string | null,
  androidPackage: "ro.troita",
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
};

export const NAV = [
  { href: "/azi", label: "Azi" },
  { href: "/calendar-ortodox", label: "Calendar" },
  { href: "/posturi", label: "Posturi" },
  { href: "/despre", label: "Despre" },
];
