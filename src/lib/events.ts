/**
 * Weddings and baptisms through the year, for /nunti and /botez.
 *
 * Weddings follow the engine's cununie() rule (the same as the app). For
 * baptisms the Church has no forbidden days: a child can be baptised on any
 * day, Holy Week and Bright Week included. What changes on a fast day is the
 * party: the meal is a fasting meal. So /botez shows which weekends fall in a
 * fast, not which ones are "allowed".
 */
import { getDay } from "./calendar";
import { addDays, between, daysInMonth, same, weekday, ymd, type Ymd } from "./dates";
import { cununie, greatFasts, pascha, type FastLevel, type WeddingBar } from "./liturgical";

export type EventDay = { date: Ymd; weekday: number; bar: WeddingBar | null; fast: FastLevel };

export function yearDays(year: number): EventDay[] {
  const out: EventDay[] = [];
  for (let m = 1; m <= 12; m++) {
    for (let d = 1; d <= daysInMonth(year, m); d++) {
      const date = ymd(year, m, d);
      out.push({ date, weekday: weekday(date), bar: cununie(date), fast: getDay(date).fastLevel });
    }
  }
  return out;
}

export type BarRun = { start: Ymd; end: Ymd; bar: WeddingBar };

/**
 * The stretches without weddings, as consecutive runs of one reason. Single
 * Wednesdays and Fridays are left out: they are a rule, not a stretch.
 */
export function barRuns(days: EventDay[]): BarRun[] {
  const runs: BarRun[] = [];
  for (const x of days) {
    if (!x.bar || x.bar === "miercuriVineri") continue;
    const last = runs[runs.length - 1];
    if (last && last.bar === x.bar && same(addDays(last.end, 1), x.date)) {
      last.end = x.date;
    } else {
      runs.push({ start: x.date, end: x.date, bar: x.bar });
    }
  }
  return runs;
}

export const isWeekend = (x: EventDay) => x.weekday === 6 || x.weekday === 7;

/** Holy Week and Bright Week: a baptism is possible, but ask the parish first. */
export function pastoralNote(d: Ymd): string | null {
  const p = pascha(d.y);
  if (between(d, addDays(p, -6), addDays(p, -1))) return "Săptămâna Mare";
  if (between(d, p, addDays(p, 6))) return "Săptămâna Luminată";
  return null;
}

/** Whether a date is inside one of the four great fasts. */
export const inGreatFast = (d: Ymd) => greatFasts(d.y).some((f) => between(d, f.start, f.end));
