import { FAST_ICON } from "./icons";
import { FAST_LABEL, FAST_SHORT, RANK_LABEL, type FastLevel, type FeastRank } from "@/lib/liturgical";
import type { DayEntry } from "@/lib/calendar";
import { MONTHS, WEEKDAY_SHORT, WEEKDAYS } from "@/lib/dates";

/** Semantic colour per fast level: a scale from relief to severity. */
export const FAST_COLOR: Record<FastLevel, string> = {
  none: "var(--color-muted)",
  dairy: "var(--color-dairy-gold)",
  fish: "var(--color-fish-blue)",
  wineOil: "var(--color-gold)",
  fast: "var(--color-burgundy)",
  strict: "var(--color-burgundy-deep)",
};

export const RANK_COLOR: Record<FeastRank, string> = {
  praznic: "var(--color-feast-red)",
  cruce_rosie: "var(--color-feast-red)",
  cruce_albastra: "var(--color-feast-blue)",
  simplu: "var(--color-muted)",
};

/** Icon plus written label. Never the icon alone. */
export function FastPill({ level, compact = false }: { level: FastLevel; compact?: boolean }) {
  const Icon = FAST_ICON[level];
  const c = FAST_COLOR[level];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border font-semibold ${
        compact ? "px-2 py-0.5 text-[13px]" : "px-2.5 py-1 text-[14.5px]"
      }`}
      style={{
        color: c,
        borderColor: `color-mix(in srgb, ${c} 35%, transparent)`,
        background: `color-mix(in srgb, ${c} 10%, transparent)`,
      }}
    >
      <Icon width={compact ? 14 : 16} height={compact ? 14 : 16} />
      {compact ? FAST_SHORT[level] : FAST_LABEL[level]}
    </span>
  );
}

export function RankLabel({ rank }: { rank: FeastRank }) {
  if (rank === "simplu") return null;
  return (
    <span
      className="inline-flex items-center gap-1 text-[11.5px] font-bold uppercase tracking-[0.06em]"
      style={{ color: RANK_COLOR[rank] }}
    >
      <span aria-hidden className="text-[14px] leading-none">✛</span>
      {RANK_LABEL[rank]}
    </span>
  );
}

/** The commemorations of a day, each in serif, Romanian saints set apart. */
export function Commemorations({ day, size = "md" }: { day: DayEntry; size?: "md" | "lg" }) {
  if (day.feasts.length === 0) {
    return <p className="font-display text-[17px]">Pomenirea zilei</p>;
  }
  const text = size === "lg" ? "text-[19px] sm:text-[21px]" : "text-[16.5px]";
  return (
    <div className="space-y-2">
      {day.feasts.map((f, i) => (
        <div key={i}>
          {f.rank !== "simplu" && (
            <div className="mb-0.5">
              <RankLabel rank={f.rank} />
            </div>
          )}
          <ul className="space-y-0.5">
            {f.parts.map((p, j) => (
              <li
                key={j}
                className={`font-display leading-snug ${text} ${
                  f.rank !== "simplu" && j === 0 ? "font-semibold" : "font-normal"
                }`}
                style={{ color: p.romanian ? "var(--color-romanian-saint)" : "var(--color-calendar-ink)" }}
              >
                {p.text}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** One day, set like a line in a printed calendar. */
export function DayRow({ day, showMonth = false }: { day: DayEntry; showMonth?: boolean }) {
  const major = day.rank === "praznic" || day.rank === "cruce_rosie";
  const red = major || day.weekday === 7;
  const color = red ? "var(--color-feast-red)" : "var(--color-calendar-ink)";
  return (
    <li
      id={`ziua-${day.day}`}
      data-date={day.date}
      className={`scroll-mt-24 border-b border-border px-3 py-4 sm:px-4 ${major ? "bg-surface-subtle" : ""}`}
    >
      <div className="flex gap-3 sm:gap-4">
        <div className="w-12 shrink-0 text-center sm:w-14" style={{ color }}>
          <div className="font-display text-[30px] font-bold leading-none">{day.day}</div>
          <div className="mt-1 text-[13px] font-semibold opacity-80">
            {showMonth ? MONTHS[day.month - 1].slice(0, 3) : WEEKDAY_SHORT[day.weekday - 1]}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <span className="today-label mb-1 hidden text-[11px] font-bold tracking-[0.12em] text-burgundy">
            ASTĂZI
          </span>
          <span className="sr-only">{WEEKDAYS[day.weekday - 1]}, </span>
          <Commemorations day={day} />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {day.fastLevel !== "none" && <FastPill level={day.fastLevel} compact />}
            {day.noWeddings && (
              <span className="text-[13px] text-muted">Nu se fac nunți</span>
            )}
          </div>
          {(day.notes.length > 0 || day.glas) && (
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
              {[...day.notes, day.glas ? `Glasul ${day.glas}, voscreasna ${day.voscreasna}` : null]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </div>
      </div>
    </li>
  );
}

export function FastLegend() {
  const levels: FastLevel[] = ["fish", "wineOil", "dairy", "fast", "strict"];
  return (
    <div className="flex flex-wrap gap-2">
      {levels.map((l) => (
        <FastPill key={l} level={l} compact />
      ))}
    </div>
  );
}
