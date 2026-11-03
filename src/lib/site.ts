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

export const NAV = [
  { href: "/azi", label: "Azi" },
  { href: "/calendar-ortodox", label: "Calendar" },
  { href: "/posturi", label: "Posturi" },
  { href: "/despre", label: "Despre" },
];
