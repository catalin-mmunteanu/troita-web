/**
 * Port of the app's liturgical engine (lib/core/liturgical/ in the troita repo).
 *
 * Pure functions of a date. Keep this file in step with the Dart source:
 * if a rule changes in the app, change it here too.
 */
import { addDays, between, daysBetween, same, weekday, ymd, type Ymd } from "./dates";

export type FastLevel = "none" | "dairy" | "fish" | "wineOil" | "fast" | "strict";
export const FAST_ORDER: FastLevel[] = ["none", "dairy", "fish", "wineOil", "fast", "strict"];

export const FAST_LABEL: Record<FastLevel, string> = {
  none: "Zi fără post",
  dairy: "Dezlegare la lactate",
  fish: "Dezlegare la pește",
  wineOil: "Dezlegare la untdelemn și vin",
  fast: "Post",
  strict: "Post aspru (ajunare)",
};

export const FAST_SHORT: Record<FastLevel, string> = {
  none: "Fără post",
  dairy: "Lactate",
  fish: "Pește",
  wineOil: "Ulei și vin",
  fast: "Post",
  strict: "Ajunare",
};

export const isFasting = (l: FastLevel) => l !== "none";
const looser = (a: FastLevel, b: FastLevel) =>
  FAST_ORDER.indexOf(a) <= FAST_ORDER.indexOf(b) ? a : b;
const stricter = (a: FastLevel, b: FastLevel) =>
  FAST_ORDER.indexOf(a) >= FAST_ORDER.indexOf(b) ? a : b;

export type FeastRank = "praznic" | "cruce_rosie" | "cruce_albastra" | "simplu";
export const RANK_LABEL: Record<FeastRank, string> = {
  praznic: "Praznic Împărătesc",
  cruce_rosie: "Cruce Roșie",
  cruce_albastra: "Cruce Albastră",
  simplu: "Pomenire",
};
export const RANK_WEIGHT: Record<FeastRank, number> = {
  praznic: 3,
  cruce_rosie: 2,
  cruce_albastra: 1,
  simplu: 0,
};
export const parseRank = (r: string | null | undefined): FeastRank =>
  r === "praznic" || r === "cruce_rosie" || r === "cruce_albastra"
    ? r
    : r === "cruce_neagra"
      ? "cruce_albastra"
      : "simplu";

export type PeriodKind =
  | "postulMare"
  | "postulApostolilor"
  | "postulAdormirii"
  | "postulCraciunului"
  | "harti"
  | "saptamanaBranzei";

export const PERIOD_LABEL: Record<PeriodKind, string> = {
  postulMare: "Postul Mare",
  postulApostolilor: "Postul Sfinților Apostoli Petru și Pavel",
  postulAdormirii: "Postul Adormirii Maicii Domnului",
  postulCraciunului: "Postul Nașterii Domnului",
  harti: "Harți",
  saptamanaBranzei: "Săptămâna Brânzei",
};

export type Period = { kind: PeriodKind; start: Ymd; end: Ymd; note?: string };

export const periodDays = (p: Period) => daysBetween(p.start, p.end) + 1;

// ------------------------------------------------------------------- Pascha

/** Orthodox Pascha in the Gregorian calendar (Meeus, Julian + 13 days). */
export function pascha(year: number): Ymd {
  const a = year % 4;
  const b = year % 7;
  const c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const month = Math.floor((d + e + 114) / 31);
  const day = ((d + e + 114) % 31) + 1;
  return ymd(year, month, day + (year < 2100 ? 13 : 14));
}

export const MOVABLE: Record<string, number> = {
  lazarus_saturday: -8,
  palm_sunday: -7,
  theodore_saturday: -43,
  pascha: 0,
  bright_friday: 5,
  ascension: 39,
  pentecost: 49,
  pentecost_monday: 50,
  all_saints: 56,
  orthodoxy_sunday: -42,
  thomas_sunday: 7,
  myrrhbearers: 14,
  romanian_saints: 63,
};

// ------------------------------------------------------------------ periods

export function postulMare(year: number): Period {
  const p = pascha(year);
  return { kind: "postulMare", start: addDays(p, -48), end: addDays(p, -1), note: "Cel mai aspru post din an." };
}

export function postulApostolilor(year: number): Period | null {
  const start = addDays(pascha(year), 57);
  const end = ymd(year, 6, 28);
  if (daysBetween(start, end) < 0) return null;
  return { kind: "postulApostolilor", start, end, note: "Durata variază în funcție de data Paștelui." };
}

export const postulAdormirii = (year: number): Period => ({
  kind: "postulAdormirii",
  start: ymd(year, 8, 1),
  end: ymd(year, 8, 14),
  note: "Post aspru de două săptămâni.",
});

export const postulCraciunului = (year: number): Period => ({
  kind: "postulCraciunului",
  start: ymd(year, 11, 15),
  end: ymd(year, 12, 24),
  note: "Dezlegare la pește în zilele rânduite, până în 20 decembrie.",
});

export function greatFasts(year: number): Period[] {
  const ap = postulApostolilor(year);
  return [postulMare(year), ...(ap ? [ap] : []), postulAdormirii(year), postulCraciunului(year)];
}

export function harti(year: number): Period[] {
  const p = pascha(year);
  return [
    { kind: "harti", start: ymd(year, 12, 25), end: ymd(year + 1, 1, 4), note: "De la Nașterea Domnului până la Bobotează." },
    { kind: "harti", start: addDays(p, -69), end: addDays(p, -64), note: "Săptămâna de după Duminica Vameșului și a Fariseului." },
    { kind: "harti", start: p, end: addDays(p, 6), note: "Săptămâna Luminată." },
    { kind: "harti", start: addDays(p, 50), end: addDays(p, 56), note: "Săptămâna de după Rusalii." },
  ];
}

export function saptamanaBranzei(year: number): Period {
  const p = pascha(year);
  return {
    kind: "saptamanaBranzei",
    start: addDays(p, -55),
    end: addDays(p, -49),
    note: "Se dezleagă la lactate și ouă în toate zilele.",
  };
}

// ---------------------------------------------------------------------- day

export type LiturgicalDay = {
  fastLevel: FastLevel;
  period: Period | null;
  glas: number | null;
  voscreasna: number | null;
  note: string | null;
};

const contains = (p: Period, d: Ymd) => between(d, p.start, p.end);

function findHarti(d: Ymd) {
  for (const y of [d.y - 1, d.y]) for (const p of harti(y)) if (contains(p, d)) return p;
  return null;
}

function levelInGreatFast(d: Ymd, period: Period, rank: FeastRank): [FastLevel, string | null] {
  const p = pascha(d.y);
  const wd = weekday(d);
  const weekend = wd === 6 || wd === 7;

  switch (period.kind) {
    case "postulMare":
      if (same(d, addDays(p, -48))) return ["strict", "Prima zi a Postului Mare."];
      if (same(d, addDays(p, -2))) return ["strict", "Vinerea Mare."];
      if (d.m === 3 && d.d === 25) return ["fish", "Buna Vestire."];
      if (same(d, addDays(p, -7))) return ["fish", "Duminica Floriilor."];
      if (same(d, addDays(p, -8))) return ["wineOil", "Sâmbăta lui Lazăr — dezlegare la icre."];
      if (same(d, addDays(p, -3))) return ["wineOil", "Joia Mare."];
      if (d.m === 3 && (d.d === 24 || d.d === 26) && !weekend) return ["wineOil", null];
      return weekend ? ["wineOil", null] : ["fast", null];

    case "postulAdormirii":
      if (d.m === 8 && d.d === 6) return ["fish", "Schimbarea la Față."];
      return weekend ? ["wineOil", null] : ["fast", null];

    case "postulApostolilor":
      if (wd === 3 || wd === 5) {
        if (rank === "praznic") return ["fish", null];
        if (rank === "cruce_rosie") return ["wineOil", null];
        return ["fast", null];
      }
      if (wd === 2 || wd === 4) return ["wineOil", null];
      return ["fish", null];

    case "postulCraciunului": {
      if (d.m === 12 && d.d === 24) return ["strict", "Ajunul Nașterii Domnului."];
      if (d.m === 11 && d.d === 21) return ["fish", "Intrarea în Biserică a Maicii Domnului."];
      if (d.m === 11 && d.d === 30) return ["fish", "Sfântul Apostol Andrei."];
      if (d.m === 12 && d.d === 6) return ["fish", "Sfântul Ierarh Nicolae."];
      const beforeIntrarea = d.m === 11 && d.d < 21;
      const lastDays = d.m === 12 && d.d > 20;
      if (beforeIntrarea || lastDays) return weekend ? ["wineOil", null] : ["fast", null];
      if (weekend) return ["fish", null];
      if (wd === 2 || wd === 4) return ["wineOil", null];
      return ["fast", null];
    }
    default:
      return ["fast", null];
  }
}

function levelOutsideFasts(d: Ymd, rank: FeastRank): FastLevel {
  const wd = weekday(d);
  if (wd !== 3 && wd !== 5) return "none";
  const p = pascha(d.y);
  if (between(d, addDays(p, 8), addDays(p, 48))) return "fish";
  if (rank === "praznic") return "fish";
  if (rank === "cruce_rosie") return "wineOil";
  return "fast";
}

function fixedDay(d: Ymd): [FastLevel, string] | null {
  if (d.m === 1 && d.d === 5) return ["strict", "Ajunul Bobotezei."];
  if (d.m === 8 && d.d === 29) return ["wineOil", "Tăierea Capului Sfântului Ioan Botezătorul."];
  if (d.m === 9 && d.d === 14) return ["wineOil", "Înălțarea Sfintei Cruci."];
  return null;
}

function weeksSinceThomas(d: Ymd): number | null {
  let anchor = addDays(pascha(d.y), 7);
  if (daysBetween(anchor, d) < 0) anchor = addDays(pascha(d.y - 1), 7);
  const weeks = Math.floor(daysBetween(anchor, d) / 7);
  return weeks < 0 ? null : weeks;
}

export const glasFor = (d: Ymd) => {
  const w = weeksSinceThomas(d);
  return w === null ? null : (w % 8) + 1;
};

export const voscreasnaFor = (d: Ymd) => {
  const w = weeksSinceThomas(d);
  return w === null ? null : ((w + 4) % 11) + 1;
};

export function dayFor(d: Ymd, rank: FeastRank = "simplu", dezlegare: FastLevel | null = null): LiturgicalDay {
  const harta = findHarti(d);
  const branza = saptamanaBranzei(d.y);
  const great = greatFasts(d.y).find((p) => contains(p, d)) ?? null;

  let level: FastLevel;
  let note: string | null = null;
  let period: Period | null = null;

  if (harta) {
    period = harta;
    level = "none";
    note = harta.note ?? null;
  } else if (contains(branza, d)) {
    period = branza;
    level = "dairy";
    note = branza.note ?? null;
  } else if (great) {
    period = great;
    [level, note] = levelInGreatFast(d, great, rank);
  } else {
    level = levelOutsideFasts(d, rank);
  }

  if (dezlegare && isFasting(level)) level = looser(level, dezlegare);

  const fixed = fixedDay(d);
  if (fixed) {
    level = fixed[0] === "strict" ? stricter(level, "strict") : fixed[0];
    note = fixed[1];
  }

  return { fastLevel: level, period, glas: glasFor(d), voscreasna: voscreasnaFor(d), note };
}
