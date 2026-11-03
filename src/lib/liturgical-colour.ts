/**
 * The liturgical colour of a day, drawn as the 3px bar on its card (DESIGN.MD
 * §4 and §5). Rules in priority order, as recorded in DESIGN.MD:
 *
 *   1. Trinity, Pentecost, Palm Sunday            → green
 *   2. Holy Cross feasts and Pascha               → red
 *   3. Feasts of the Lord                         → gold
 *   4. Mother of God, Archangels                  → blue
 *   5. Every other Sunday                         → gold
 *   6. A martyr as the day's main commemoration,
 *      with a cross (roșie or albastră)           → red
 *   7. Any other day of Great Lent                → purple
 *   8. Otherwise                                  → none
 *
 * Gold is too light to carry meaning on its own (2:1 on parchment), so every
 * colour comes with a label that is written next to the bar.
 */
import type { DayEntry } from "./calendar";
import { addDays, same, type Ymd } from "./dates";
import { pascha } from "./liturgical";

export type LiturgicalColour = "gold" | "red" | "blue" | "green" | "purple";

export type Liturgical = { colour: LiturgicalColour; label: string } | null;

const md = (d: Ymd) => d.m * 100 + d.d;

export function liturgicalColour(day: DayEntry): Liturgical {
  const d: Ymd = { y: day.year, m: day.month, d: day.day };
  const p = pascha(d.y);
  const first = day.feasts[0]?.parts[0]?.text ?? "";

  // 1. Green
  if (same(d, addDays(p, -7))) return { colour: "green", label: "Floriile" };
  if (same(d, addDays(p, 49))) return { colour: "green", label: "Rusaliile" };
  if (same(d, addDays(p, 50))) return { colour: "green", label: "Sfânta Treime" };

  // 2. Red: the Cross and Pascha
  if (same(d, p)) return { colour: "red", label: "Sfintele Paști" };
  if (md(d) === 914 || md(d) === 801 || same(d, addDays(p, -28)) || /Sfintei Cruci|Sf\. Cruci/.test(first)) {
    return { colour: "red", label: "Sfânta Cruce" };
  }

  // 3. Gold: feasts of the Lord
  const lord = day.feasts.some((f) => f.kind === "domnesc" && f.rank === "praznic");
  if (lord) return { colour: "gold", label: "Praznic împărătesc" };

  // 4. Blue: the Mother of God and the Archangels
  if (
    day.feasts.some((f) => f.kind === "maica_domnului") ||
    /Maicii Domnului|Născătoare(i)? de Dumnezeu/.test(first)
  ) {
    return { colour: "blue", label: "Maica Domnului" };
  }
  if (/Arh\.|Arhangh/.test(first)) return { colour: "blue", label: "Sfinții Arhangheli" };

  // 5. Gold: every other Sunday
  if (day.weekday === 7) return { colour: "gold", label: "Duminică" };

  // 6. Red: a martyr leads the day and carries a cross. Most days remember
  // some martyr, so the bar is kept for the ones a calendar marks.
  if (day.rank !== "simplu" && /\bMc\.|Mucenic/.test(first)) {
    return { colour: "red", label: "Sfinți mucenici" };
  }

  // 7. Purple: Great Lent
  if (day.periodKind === "postulMare") return { colour: "purple", label: "Postul Mare" };

  return null;
}

/** CSS colour for a liturgical colour token. */
export const LITURGICAL_VAR: Record<LiturgicalColour, string> = {
  gold: "var(--gold)",
  red: "var(--red)",
  blue: "var(--blue)",
  green: "var(--green)",
  purple: "var(--purple)",
};
