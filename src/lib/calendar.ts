/**
 * Assembles one day the way the app's DayRepository does: the feasts table on
 * top of the computed engine, with the published per-year values winning.
 */
import data from "../../data/seed-export.json";
import {
  addDays, daysInMonth, iso, monthDay, weekday, ymd, compare, type Ymd,
} from "./dates";
import {
  dayFor, MOVABLE, parseRank, pascha, RANK_WEIGHT,
  type FastLevel, type FeastRank, type PeriodKind,
} from "./liturgical";

type RawFeast = {
  monthDay: string | null;
  movableKey: string | null;
  name: string;
  rank: string;
  kind: string | null;
  note: string | null;
  dezlegare: string | null;
};

type RawOverride = {
  year: number;
  monthDay: string;
  fastLevel?: string;
  notes?: string;
  glas?: number;
  voscreasna?: number;
};

const FEASTS = (data.feasts as RawFeast[]).filter((f) => f.name.trim().length > 0);
const OVERRIDES = new Map<string, RawOverride>(
  (data.overrides as RawOverride[]).map((o) => [`${o.year}-${o.monthDay}`, o]),
);

/** Years whose calendar is published in full (names, ranks and dezlegări). */
export const PUBLISHED_YEARS: number[] = data.publishedYears;
export const SEED_VERSION: string = data.seedVersion ?? "";

export type Feast = {
  name: string;
  rank: FeastRank;
  kind: string | null;
  /** The commemorations, split the way a printed calendar lists them. */
  parts: { text: string; romanian: boolean }[];
};

export type DayEntry = {
  date: string; // ISO yyyy-mm-dd
  day: number;
  month: number;
  year: number;
  weekday: number; // 1 = luni … 7 = duminică
  feasts: Feast[];
  rank: FeastRank;
  fastLevel: FastLevel;
  periodKind: PeriodKind | null;
  /** Why this day differs from its period's base rule. */
  explanation: string | null;
  /** Liturgical notes: Tedeum, Pomenirea morților, Zi aliturgică… */
  notes: string[];
  noWeddings: boolean;
  glas: number | null;
  voscreasna: number | null;
};

const LEVELS: FastLevel[] = ["none", "dairy", "fish", "wineOil", "fast", "strict"];
const parseLevel = (s: string | null | undefined): FastLevel | null =>
  LEVELS.includes(s as FastLevel) ? (s as FastLevel) : s === "wine_oil" ? "wineOil" : null;

function feastDate(f: RawFeast, year: number): Ymd | null {
  if (f.movableKey) {
    const off = MOVABLE[f.movableKey];
    return off === undefined ? null : addDays(pascha(year), off);
  }
  if (!f.monthDay) return null;
  const [m, d] = f.monthDay.split("-").map(Number);
  return ymd(year, m, d);
}

const byYear = new Map<number, Map<string, RawFeast[]>>();
function feastIndex(year: number) {
  let idx = byYear.get(year);
  if (idx) return idx;
  idx = new Map();
  for (const f of FEASTS) {
    const d = feastDate(f, year);
    if (!d || d.y !== year) continue;
    const k = iso(d);
    if (!idx.has(k)) idx.set(k, []);
    idx.get(k)!.push(f);
  }
  for (const list of idx.values()) {
    list.sort((a, b) => RANK_WEIGHT[parseRank(b.rank)] - RANK_WEIGHT[parseRank(a.rank)]);
  }
  byYear.set(year, idx);
  return idx;
}

function splitParts(name: string, kind: string | null) {
  return name
    .split(/;\s+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const romanian = p.startsWith("†)");
      return { text: romanian ? p.replace(/^†\)\s*/, "") : p, romanian: romanian || kind === "romanesc" };
    });
}

// Notes that only restate the fasting level, which the page already shows.
const FAST_NOTE = /^(Post|Dezlegare|Harți|Zi de post|Zi de ajunare|Post negru)\b/;

function collectNotes(raw: (string | null | undefined)[]) {
  const out: string[] = [];
  let noWeddings = false;
  for (const r of raw) {
    if (!r) continue;
    // Split on ";" only: "." also ends abbreviations ("Sf. și Marii Vineri").
    for (let piece of r.split(/;\s*/)) {
      if (/Nu se fac nunți/.test(piece)) {
        noWeddings = true;
        piece = piece.replace(/\.?\s*Nu se fac nunți\.?/, "");
      }
      piece = piece.trim().replace(/\.$/, "");
      if (!piece || FAST_NOTE.test(piece)) continue;
      if (!out.includes(piece)) out.push(piece);
    }
  }
  return { notes: out, noWeddings };
}

export function getDay(date: Ymd): DayEntry {
  const raw = feastIndex(date.y).get(iso(date)) ?? [];
  const rank = raw.length ? parseRank(raw[0].rank) : "simplu";
  const dezlegare = raw.map((f) => parseLevel(f.dezlegare)).find((x) => x) ?? null;

  const computed = dayFor(date, rank, dezlegare);
  const override = OVERRIDES.get(`${date.y}-${monthDay(date)}`);
  const published = parseLevel(override?.fastLevel);
  const fastLevel = published ?? computed.fastLevel;

  // Notes on fixed-date feasts were scraped from one particular year ("Sâmbăta
  // a IV-a din Post") and would be wrong in another, so only the per-year
  // published notes and the notes of movable feasts are used.
  const { notes, noWeddings } = collectNotes([
    override?.notes,
    ...raw.filter((f) => f.movableKey).map((f) => f.note),
  ]);
  const isSunday = weekday(date) === 7;

  return {
    date: iso(date),
    day: date.d,
    month: date.m,
    year: date.y,
    weekday: weekday(date),
    feasts: raw.map((f) => ({
      name: f.name,
      rank: parseRank(f.rank),
      kind: f.kind,
      parts: splitParts(f.name, f.kind),
    })),
    rank,
    fastLevel,
    periodKind: computed.period?.kind ?? null,
    explanation: fastLevel === computed.fastLevel ? computed.note : null,
    notes,
    noWeddings,
    glas: isSunday ? (override?.glas ?? computed.glas) : null,
    voscreasna: isSunday ? (override?.voscreasna ?? computed.voscreasna) : null,
  };
}

export function getMonth(year: number, month: number): DayEntry[] {
  return Array.from({ length: daysInMonth(year, month) }, (_, i) => getDay(ymd(year, month, i + 1)));
}

export function getRange(from: Ymd, to: Ymd): DayEntry[] {
  const out: DayEntry[] = [];
  for (let d = from; compare(d, to) <= 0 && out.length < 400; d = addDays(d, 1)) out.push(getDay(d));
  return out;
}

/** The major feasts (praznice and cruce roșie) of a year, in order. */
export function majorFeasts(year: number): DayEntry[] {
  return getRange(ymd(year, 1, 1), ymd(year, 12, 31)).filter(
    (d) => d.rank === "praznic" || d.rank === "cruce_rosie",
  );
}

export function upcomingMajor(from: Ymd, limit = 5): DayEntry[] {
  return getRange(addDays(from, 1), addDays(from, 120))
    .filter((d) => d.rank === "praznic" || d.rank === "cruce_rosie")
    .slice(0, limit);
}

export const isPublishedYear = (y: number) => PUBLISHED_YEARS.includes(y);

/** Shortest readable title for a day: the first commemoration. */
export function shortTitle(d: DayEntry) {
  return d.feasts[0]?.parts[0]?.text ?? "Pomenirea zilei";
}
