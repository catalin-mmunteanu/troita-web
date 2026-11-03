import { NextResponse, type NextRequest } from "next/server";
import data from "../data/seed-export.json";

/**
 * Real 404s for calendar and fast URLs that don't exist (/calendar-ortodox/2031,
 * /posturi/2026/foo). Without this, an unknown param can be answered 200 with
 * the not-found page inside, which Search Console reports as a "soft 404".
 */
const YEARS = new Set(data.publishedYears.map(String));
const MONTHS = new Set([
  "ianuarie", "februarie", "martie", "aprilie", "mai", "iunie",
  "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie",
]);
const FASTS = new Set([
  "postul-mare", "postul-sfintilor-petru-si-pavel", "postul-sfintei-marii", "postul-craciunului",
]);

export function proxy(request: NextRequest) {
  const [section, year, sub, ...rest] = request.nextUrl.pathname.split("/").filter(Boolean);
  const valid =
    rest.length === 0 &&
    (year === undefined || YEARS.has(year)) &&
    (sub === undefined || (section === "calendar-ortodox" ? MONTHS.has(sub) : FASTS.has(sub)));
  if (valid) return NextResponse.next();
  // Any path with no page renders app/not-found.tsx with a 404 status.
  return NextResponse.rewrite(new URL("/pagina-inexistenta", request.url));
}

export const config = {
  matcher: ["/calendar-ortodox/:path+", "/posturi/:path+"],
};
