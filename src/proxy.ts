import { NextResponse, type NextRequest } from "next/server";
import data from "../data/seed-export.json";
import { NAMES } from "./lib/name-days";

/**
 * Real 404s for calendar and fast URLs that don't exist (/calendar-ortodox/2031,
 * /posturi/2026/foo). Without this, an unknown param can be answered 200 with
 * the not-found page inside, which Search Console reports as a "soft 404".
 */
const YEARS = new Set(
  [...data.publishedYears, ...((data as { computedYears?: number[] }).computedYears ?? [])].map(String),
);
const MONTHS = new Set([
  "ianuarie", "februarie", "martie", "aprilie", "mai", "iunie",
  "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie",
]);
const FASTS = new Set([
  "postul-mare", "postul-sfintilor-petru-si-pavel", "postul-sfintei-marii", "postul-craciunului",
]);

const NAME_SLUGS = new Set(NAMES.map((n) => n.slug));
// A real date in the calendar years, checked without loading the readings
// (the proxy bundle stays small).
const isReadingDate = (s: string | undefined) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s ?? "");
  if (!m || !YEARS.has(m[1])) return false;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3];
};

export function proxy(request: NextRequest) {
  const [section, year, sub, ...rest] = request.nextUrl.pathname.split("/").filter(Boolean);
  // /nunti/2027, /botez/2027: a year and nothing after it. /zile-de-nume/andrei: a known name.
  const valid =
    section === "evanghelia-zilei"
      ? sub === undefined && isReadingDate(year)
      : section === "zile-de-nume"
      ? sub === undefined && NAME_SLUGS.has(year)
      : section === "nunti" || section === "botez"
        ? sub === undefined && YEARS.has(year)
        : rest.length === 0 &&
    (year === undefined || YEARS.has(year)) &&
    (sub === undefined || (section === "calendar-ortodox" ? MONTHS.has(sub) : FASTS.has(sub)));
  if (valid) return NextResponse.next();
  // Any path with no page renders app/not-found.tsx with a 404 status.
  return NextResponse.rewrite(new URL("/pagina-inexistenta", request.url));
}

export const config = {
  matcher: ["/calendar-ortodox/:path+", "/posturi/:path+", "/nunti/:path+", "/botez/:path+", "/zile-de-nume/:path+", "/evanghelia-zilei/:path+"],
};
