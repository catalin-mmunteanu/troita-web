import type { MetadataRoute } from "next";
import { PUBLISHED_YEARS } from "@/lib/calendar";
import { MONTHS } from "@/lib/dates";
import { FAST_INFO, FAST_ORDERED } from "@/lib/fasts";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]) => ({
    url: `${SITE.url}${path}`,
    priority,
    changeFrequency,
  });

  return [
    u("", 1, "daily"),
    u("/azi", 0.9, "daily"),
    u("/calendar-ortodox", 0.8, "monthly"),
    u("/posturi", 0.8, "monthly"),
    ...PUBLISHED_YEARS.flatMap((y) => [
      u(`/calendar-ortodox/${y}`, 0.8, "monthly"),
      ...MONTHS.map((m) => u(`/calendar-ortodox/${y}/${m}`, 0.7, "monthly")),
      u(`/posturi/${y}`, 0.7, "monthly"),
      ...FAST_ORDERED.filter((s) => FAST_INFO[s].get(y)).map((s) => u(`/posturi/${y}/${s}`, 0.7, "monthly")),
    ]),
    u("/despre", 0.4, "yearly"),
    u("/confidentialitate", 0.3, "yearly"),
  ];
}
