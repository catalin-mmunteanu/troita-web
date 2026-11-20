/**
 * Zile de nume: which first names are celebrated on which feast.
 *
 * data/name-days.json is a copy of the app's assets/data/name_days.json (the
 * daily sync brings it over with the rest of the app's data), so the site and
 * the app show the same names on the same days. Sources: the DGEP lists that
 * the Ministry of Internal Affairs publishes for each great feast, and saints
 * whose own name is the celebrated name. See the "about" field of the file.
 */
import data from "../../data/name-days.json";
import { transferred } from "./calendar";
import { addDays, compare, iso, ymd, type Ymd } from "./dates";
import { MOVABLE, pascha } from "./liturgical";

type RawFeast = {
  id: string;
  saint: string;
  source: "dgep" | "calendar";
  date?: string;
  movable?: string;
  sourceUrl?: string;
  m: string[];
  f: string[];
};

export type NameFeast = RawFeast & { slug: string };

export type NameEntry = {
  slug: string;
  /** Every spelling that shares this slug: "Vasilică" and "Vasilica". */
  forms: string[];
  feasts: NameFeast[];
  /** The feast most people with this name keep, when there are several. */
  primary: NameFeast | null;
  note: string | null;
};

/** "Ștefan" → "stefan", "Ana-Maria" → "ana-maria". */
export function nameSlug(name: string) {
  return name
    .normalize("NFD")
    .replace(/\p{Mn}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const FEASTS: NameFeast[] = (data.feasts as RawFeast[]).map((f) => ({ ...f, slug: nameSlug(f.saint) }));
const PRIMARY = data.primary as Record<string, string>;
const NOTES = data.notes as Record<string, string>;

export const NAME_DAYS_ABOUT: string = data.about;
export const NAME_DAYS_SOURCES = data.sources as Record<"dgep" | "calendar", string>;

/** The date of a feast in a given year (Sf. Gheorghe moves out of Holy Week). */
export function feastDateIn(f: Pick<RawFeast, "date" | "movable">, year: number): Ymd {
  if (f.movable) return addDays(pascha(year), MOVABLE[f.movable]);
  const [m, d] = f.date!.split("-").map(Number);
  return transferred(ymd(year, m, d));
}

const entries = new Map<string, NameEntry>();
for (const f of FEASTS) {
  for (const n of [...f.m, ...f.f]) {
    const slug = nameSlug(n);
    let e = entries.get(slug);
    if (!e) {
      e = { slug, forms: [], feasts: [], primary: null, note: null };
      entries.set(slug, e);
    }
    if (!e.forms.includes(n)) e.forms.push(n);
    if (!e.feasts.includes(f)) e.feasts.push(f);
  }
}
for (const e of entries.values()) {
  const p = e.forms.map((n) => PRIMARY[n]).find(Boolean);
  e.primary = e.feasts.find((f) => f.id === p) ?? (e.feasts.length === 1 ? e.feasts[0] : null);
  e.note = e.forms.map((n) => NOTES[n]).find(Boolean) ?? null;
  // Primary first, then by date in an ordinary year.
  e.feasts.sort((a, b) =>
    a === e.primary ? -1 : b === e.primary ? 1 : compare(feastDateIn(a, 2026), feastDateIn(b, 2026)),
  );
}

const collator = new Intl.Collator("ro");

/** All names, A to Z in Romanian order. */
export const NAMES: NameEntry[] = [...entries.values()].sort((a, b) => collator.compare(a.forms[0], b.forms[0]));

export const getName = (slug: string) => entries.get(slug) ?? null;

/** The feasts with name days, in the order of the year. */
export function nameFeastsIn(year: number): { feast: NameFeast; date: Ymd }[] {
  return FEASTS.map((feast) => ({ feast, date: feastDateIn(feast, year) })).sort((a, b) => compare(a.date, b.date));
}

const byDay = new Map<number, Map<string, NameFeast[]>>();
/** The name-day feasts that fall on a date. */
export function nameFeastsOn(date: Ymd): NameFeast[] {
  let idx = byDay.get(date.y);
  if (!idx) {
    idx = new Map();
    for (const { feast, date: d } of nameFeastsIn(date.y)) {
      const k = iso(d);
      idx.set(k, [...(idx.get(k) ?? []), feast]);
    }
    byDay.set(date.y, idx);
  }
  return idx.get(iso(date)) ?? [];
}

/** The first few names of a day, for a calendar card: "Andrei, Andreea, Andra". */
export function namesOn(date: Ymd, limit = 6): { names: string[]; more: number } {
  const all = nameFeastsOn(date).flatMap((f) => [...f.m, ...f.f]);
  const unique = all.filter((n, i) => all.indexOf(n) === i);
  return { names: unique.slice(0, limit), more: Math.max(0, unique.length - limit) };
}
