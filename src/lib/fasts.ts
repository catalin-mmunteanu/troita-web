import { getRange, type DayEntry } from "./calendar";
import { type Ymd } from "./dates";
import {
  postulAdormirii, postulApostolilor, postulCraciunului, postulMare,
  type FastLevel, type Period, type PeriodKind,
} from "./liturgical";

/** URL slugs use the names people search for. */
export const FAST_SLUGS = {
  "postul-mare": "postulMare",
  "postul-sfintilor-petru-si-pavel": "postulApostolilor",
  "postul-sfintei-marii": "postulAdormirii",
  "postul-craciunului": "postulCraciunului",
} as const satisfies Record<string, PeriodKind>;

export type FastSlug = keyof typeof FAST_SLUGS;

export const FAST_INFO: Record<
  FastSlug,
  { title: string; alsoKnown: string; get: (y: number) => Period | null; intro: string }
> = {
  "postul-mare": {
    title: "Postul Mare",
    alsoKnown: "Postul Sfintelor Paști, Păresimile",
    get: postulMare,
    intro:
      "Cel mai lung și cel mai aspru post al anului. Începe în Lunea Curată, la 48 de zile înainte de Paști, și ține până în Sâmbăta Mare. Data lui se schimbă în fiecare an, odată cu Paștele.",
  },
  "postul-sfintilor-petru-si-pavel": {
    title: "Postul Sfinților Apostoli Petru și Pavel",
    alsoKnown: "Postul Sânpetrului",
    get: postulApostolilor,
    intro:
      "Începe în lunea de după Duminica Tuturor Sfinților și ține până la 28 iunie, în ajunul praznicului. Pentru că începutul depinde de Paști, durata lui variază de la an la an; în anii cu Paștele târziu, ajunge la o singură zi.",
  },
  "postul-sfintei-marii": {
    title: "Postul Adormirii Maicii Domnului",
    alsoKnown: "Postul Sfintei Marii",
    get: postulAdormirii,
    intro:
      "Post de două săptămâni, între 1 și 14 august, înaintea praznicului Adormirii Maicii Domnului. Este un post aspru, cu dezlegare la pește doar la Schimbarea la Față (6 august).",
  },
  "postul-craciunului": {
    title: "Postul Nașterii Domnului",
    alsoKnown: "Postul Crăciunului",
    get: postulCraciunului,
    intro:
      "Post de 40 de zile, între 15 noiembrie și 24 decembrie. Are cele mai multe dezlegări la pește dintre posturile mari: la sărbătorile rânduite și în zilele de sâmbătă și duminică, până în 20 decembrie.",
  },
};

export const FAST_ORDERED: FastSlug[] = [
  "postul-mare",
  "postul-sfintilor-petru-si-pavel",
  "postul-sfintei-marii",
  "postul-craciunului",
];

export function fastDays(slug: FastSlug, year: number): { period: Period; days: DayEntry[] } | null {
  const period = FAST_INFO[slug].get(year);
  if (!period) return null;
  return { period, days: getRange(period.start, period.end) };
}

export function countLevels(days: DayEntry[]) {
  const counts: Partial<Record<FastLevel, number>> = {};
  for (const d of days) counts[d.fastLevel] = (counts[d.fastLevel] ?? 0) + 1;
  return counts;
}

/** The great fast running on [date], or the next one to start. */
export function currentOrNextFast(date: Ymd) {
  for (const y of [date.y, date.y + 1]) {
    for (const slug of FAST_ORDERED) {
      const p = FAST_INFO[slug].get(y);
      if (!p) continue;
      const endCmp = Date.UTC(p.end.y, p.end.m - 1, p.end.d) - Date.UTC(date.y, date.m - 1, date.d);
      if (endCmp >= 0) return { slug, period: p, year: y };
    }
  }
  return null;
}
