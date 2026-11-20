import type { MetadataRoute } from "next";
import { CALENDAR_YEARS, SEED_VERSION } from "@/lib/calendar";
import { MONTHS } from "@/lib/dates";
import { FAST_INFO, FAST_ORDERED } from "@/lib/fasts";
import { NAMES } from "@/lib/name-days";
import { SITE } from "@/lib/site";

// The calendar pages change only when the app's data is re-exported, so their
// lastmod is the data version ("202610161318" → 16 Oct 2026). Search engines
// trust lastmod only while it is honest, so it is never "now".
const DATA_DATE = SEED_VERSION
  ? new Date(`${SEED_VERSION.slice(0, 4)}-${SEED_VERSION.slice(4, 6)}-${SEED_VERSION.slice(6, 8)}T00:00:00Z`)
  : undefined;
const NAMES_DATE = new Date("2026-11-20T00:00:00Z"); // last edit of data/name-days.json
const TEXT_DATE = new Date("2026-11-12T00:00:00Z"); // last edit of the text pages

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (path: string, lastModified: Date | undefined, priority: number) => ({
    url: `${SITE.url}${path}`,
    ...(lastModified ? { lastModified } : {}),
    priority,
  });

  return [
    // The home page and /azi change every day; no lastmod rather than a false one.
    u("", undefined, 1),
    u("/azi", undefined, 0.9),
    u("/calendar-ortodox", DATA_DATE, 0.8),
    u("/posturi", DATA_DATE, 0.8),
    ...CALENDAR_YEARS.flatMap((y) => [
      u(`/calendar-ortodox/${y}`, DATA_DATE, 0.8),
      ...MONTHS.map((m) => u(`/calendar-ortodox/${y}/${m}`, DATA_DATE, 0.7)),
      u(`/posturi/${y}`, DATA_DATE, 0.7),
      ...FAST_ORDERED.filter((s) => FAST_INFO[s].get(y)).map((s) => u(`/posturi/${y}/${s}`, DATA_DATE, 0.7)),
    ]),
    u("/nunti", DATA_DATE, 0.8),
    u("/botez", DATA_DATE, 0.8),
    ...CALENDAR_YEARS.flatMap((y) => [u(`/nunti/${y}`, DATA_DATE, 0.7), u(`/botez/${y}`, DATA_DATE, 0.7)]),
    u("/zile-de-nume", NAMES_DATE, 0.8),
    ...NAMES.map((n) => u(`/zile-de-nume/${n.slug}`, NAMES_DATE, 0.6)),
    u("/despre", TEXT_DATE, 0.4),
    u("/confidentialitate", TEXT_DATE, 0.3),
  ];
}
