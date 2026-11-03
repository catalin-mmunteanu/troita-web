/**
 * Calendar dates as plain { y, m, d } values.
 *
 * Deliberately not `Date`: a JS Date is an instant, and doing calendar
 * arithmetic on instants is how a day gets skipped or repeated across a DST
 * change. All arithmetic here goes through UTC midnight, which has no DST.
 */
export type Ymd = { y: number; m: number; d: number };

export const MONTHS = [
  "ianuarie", "februarie", "martie", "aprilie", "mai", "iunie",
  "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie",
] as const;

export const WEEKDAYS = [
  "luni", "marți", "miercuri", "joi", "vineri", "sâmbătă", "duminică",
] as const;

export const WEEKDAY_SHORT = ["L", "Ma", "Mi", "J", "V", "S", "D"] as const;

export type MonthSlug = (typeof MONTHS)[number];

const utc = (x: Ymd) => Date.UTC(x.y, x.m - 1, x.d);

export function ymd(y: number, m: number, d: number): Ymd {
  const t = new Date(Date.UTC(y, m - 1, d));
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() };
}

export const addDays = (x: Ymd, n: number): Ymd => ymd(x.y, x.m, x.d + n);

export const compare = (a: Ymd, b: Ymd) => utc(a) - utc(b);
export const same = (a: Ymd, b: Ymd) => compare(a, b) === 0;
export const between = (x: Ymd, from: Ymd, to: Ymd) =>
  compare(x, from) >= 0 && compare(x, to) <= 0;

export const daysBetween = (a: Ymd, b: Ymd) => Math.round((utc(b) - utc(a)) / 86_400_000);

/** ISO weekday: 1 = Monday … 7 = Sunday, matching Dart's DateTime.weekday. */
export function weekday(x: Ymd): number {
  const w = new Date(utc(x)).getUTCDay();
  return w === 0 ? 7 : w;
}

export const daysInMonth = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();

export const monthDay = (x: Ymd) =>
  `${String(x.m).padStart(2, "0")}-${String(x.d).padStart(2, "0")}`;

export const iso = (x: Ymd) => `${x.y}-${monthDay(x)}`;

export function fromIso(s: string): Ymd {
  const [y, m, d] = s.split("-").map(Number);
  return { y, m, d };
}

/** "24 octombrie 2026" */
export const formatLong = (x: Ymd, withYear = true) =>
  `${x.d} ${MONTHS[x.m - 1]}${withYear ? ` ${x.y}` : ""}`;

/** "sâmbătă, 24 octombrie" */
export const formatWithWeekday = (x: Ymd, withYear = false) =>
  `${WEEKDAYS[weekday(x) - 1]}, ${formatLong(x, withYear)}`;

export const monthSlug = (m: number) => MONTHS[m - 1];
export const monthFromSlug = (s: string) => {
  const i = (MONTHS as readonly string[]).indexOf(s);
  return i < 0 ? null : i + 1;
};

/**
 * Romanian count agreement: "1 zi", "14 zile", "40 de zile", "101 zile".
 * Numbers whose last two digits are 0 or 20–99 take "de".
 */
export function count(n: number, one: string, many: string) {
  if (n === 1) return `1 ${one}`;
  const r = n % 100;
  return `${n} ${r === 0 || r >= 20 ? "de " : ""}${many}`;
}

export const capitalize =(s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Today in Romania. The site is for Romania, and a visitor at 00:30 in
 * Bucharest is already on the next day while the server (UTC) is not.
 */
export function todayInRomania(now: Date = new Date()): Ymd {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Bucharest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  return fromIso(parts);
}

/** "15 noiembrie – 24 decembrie", or just "28 iunie" for a one-day range. */
export const formatRange = (a: Ymd, b: Ymd, withYear = false) =>
  a.y === b.y && a.m === b.m && a.d === b.d
    ? formatLong(a, withYear)
    : `${formatLong(a, withYear)} – ${formatLong(b, withYear)}`;
