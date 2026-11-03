import { FAST_ICON, OrthodoxCross } from "./icons";
import type { FastLevel, FeastRank } from "@/lib/liturgical";
import type { DayEntry } from "@/lib/calendar";
import { MONTHS, WEEKDAY_SHORT, WEEKDAYS } from "@/lib/dates";
import { LITURGICAL_VAR, liturgicalColour } from "@/lib/liturgical-colour";

// ------------------------------------------------------------ fasting badge

/** DESIGN.MD §6: 24px high, 2px radius, always icon and text. */
const BADGE: Record<FastLevel, { label: string; short: string; key: string }> = {
  fast: { label: "Zi de post", short: "Post", key: "post" },
  fish: { label: "Dezlegare la pește", short: "Pește", key: "fish" },
  wineOil: { label: "Dezlegare la ulei și vin", short: "Ulei și vin", key: "oil" },
  dairy: { label: "Dezlegare la lactate", short: "Lactate", key: "dairy" },
  strict: { label: "Ajunare", short: "Ajunare", key: "strict" },
  none: { label: "Fără post", short: "Fără post", key: "none" },
};

export function FastBadge({
  level,
  harti = false,
  compact = false,
}: {
  level: FastLevel;
  harti?: boolean;
  compact?: boolean;
}) {
  const b = BADGE[level];
  const Icon = FAST_ICON[level];
  const label = level === "none" && harti ? "Harți" : compact ? b.short : b.label;
  return (
    <span
      className="inline-flex h-6 items-center gap-1.5 rounded-xs px-2 font-ui text-[14px] font-medium leading-none"
      style={{ background: `var(--b-${b.key}-bg)`, color: `var(--b-${b.key}-fg)` }}
    >
      <Icon width={14} height={14} strokeWidth={1.8} />
      {label}
    </span>
  );
}

export function FastLegend() {
  const levels: FastLevel[] = ["fast", "fish", "wineOil", "dairy", "strict"];
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Legenda zilelor de post">
      {levels.map((l) => (
        <li key={l}>
          <FastBadge level={l} />
        </li>
      ))}
    </ul>
  );
}

// -------------------------------------------------------------- feast ranks

const RANK_TEXT: Record<FeastRank, string> = {
  praznic: "Praznic împărătesc",
  cruce_rosie: "Cruce roșie",
  cruce_albastra: "Cruce albastră",
  simplu: "",
};

const isRed = (r: FeastRank) => r === "praznic" || r === "cruce_rosie";

/** Card colours per DESIGN.MD §6: cruce roșie, cruce albastră, or plain. */
function cardStyle(rank: FeastRank): React.CSSProperties {
  if (isRed(rank)) return { background: "var(--rosie-bg)", borderColor: "var(--rosie-border)" };
  if (rank === "cruce_albastra") return { background: "var(--albastra-bg)", borderColor: "var(--albastra-border)" };
  return {};
}

const titleColour = (rank: FeastRank) =>
  isRed(rank) ? "var(--rosie-title)" : rank === "cruce_albastra" ? "var(--albastra-title)" : "var(--ink)";

/**
 * The commemorations of a day. The first name of a feast with a cross is set
 * as a Literata title in the rank's colour; everything else is the body face.
 */
export function Commemorations({ day, size = "md" }: { day: DayEntry; size?: "md" | "lg" }) {
  const lg = size === "lg";
  if (day.feasts.length === 0) {
    return <p className="text-[17px] font-medium">Pomenirea zilei</p>;
  }
  return (
    <div className="space-y-2">
      {day.feasts.map((f, i) => (
        <div key={i}>
          <ul className={lg ? "space-y-1" : "space-y-0.5"}>
            {f.parts.map((p, j) => {
              const title = j === 0 && f.rank !== "simplu";
              return (
                <li key={j} className="flex items-start gap-2">
                  {title && (
                    <OrthodoxCross
                      className="mt-[0.3em] shrink-0"
                      width={lg ? 18 : 15}
                      height={lg ? 18 : 15}
                      style={{ color: titleColour(f.rank) }}
                    />
                  )}
                  <span
                    className={
                      title
                        ? `font-display font-semibold leading-snug ${lg ? "text-[24px]" : "text-[20px]"}`
                        : `font-medium leading-snug text-ink ${lg ? "text-[18px]" : "text-[16px]"}`
                    }
                    style={title ? { color: titleColour(f.rank) } : undefined}
                  >
                    {p.romanian && !title && (
                      <span className="mr-1 text-red" title="Sfânt român" aria-label="Sfânt român">
                        †
                      </span>
                    )}
                    {p.text}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** The rubric line above a day: what kind of day it is, in mono capitals. */
function DayRubric({ day }: { day: DayEntry }) {
  const lit = liturgicalColour(day);
  const parts = [lit?.label, RANK_TEXT[day.rank]].filter(Boolean) as string[];
  const unique = parts.filter((p, i) => parts.indexOf(p) === i);
  return (
    <p className="rubric flex flex-wrap items-center gap-x-2 text-umber">
      <span className="today-label hidden font-semibold text-red">
        Astăzi{unique.length > 0 && <span aria-hidden className="ml-2 font-normal text-umber">·</span>}
      </span>
      {unique.map((p, i) => (
        <span key={p}>
          {i > 0 && <span aria-hidden className="mr-2">·</span>}
          {p}
        </span>
      ))}
    </p>
  );
}

/** Fasting, weddings and the liturgical notes of a day. */
function DayFooter({ day }: { day: DayEntry }) {
  const notes = [...day.notes, day.noWeddings ? "Nu se fac nunți" : null, day.glas ? `Glasul ${day.glas} · voscreasna ${day.voscreasna}` : null].filter(Boolean);
  const showBadge = day.fastLevel !== "none" || day.periodKind === "harti";
  if (!showBadge && notes.length === 0) return null;
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
      {showBadge && <FastBadge level={day.fastLevel} harti={day.periodKind === "harti"} />}
      {notes.length > 0 && <p className="rubric text-umber">{notes.join(" · ")}</p>}
    </div>
  );
}

/**
 * One day as a card: 4px corners, 1px border, the 3px liturgical bar on the
 * left edge (DESIGN.MD §5), feast colours per §6.
 */
export function DayCard({ day, showMonth = false }: { day: DayEntry; showMonth?: boolean }) {
  const lit = liturgicalColour(day);
  const red = isRed(day.rank) || day.weekday === 7;
  return (
    <li
      id={`ziua-${day.day}`}
      data-date={day.date}
      className="relative scroll-mt-24 overflow-hidden rounded-sm border border-oak bg-parchment shadow-micro"
      style={cardStyle(day.rank)}
    >
      {lit && (
        <span aria-hidden className="absolute inset-y-0 left-0 w-[3px]" style={{ background: LITURGICAL_VAR[lit.colour] }} />
      )}
      <div className="grid grid-cols-[3.25rem_1fr] gap-3 py-4 pr-4 pl-4 sm:grid-cols-[4rem_1fr] sm:gap-4 sm:pl-5">
        <div className="text-center" style={{ color: red ? "var(--rosie-title)" : "var(--ink)" }}>
          <div className="font-display text-[32px] font-bold leading-none sm:text-[36px]">{day.day}</div>
          <div className="rubric mt-1.5 opacity-90">{WEEKDAY_SHORT[day.weekday - 1]}</div>
          {showMonth && <div className="rubric text-[11px] text-umber">{MONTHS[day.month - 1].slice(0, 3)}</div>}
        </div>
        <div className="min-w-0">
          <span className="sr-only">{WEEKDAYS[day.weekday - 1]}, </span>
          <DayRubric day={day} />
          <div className="mt-1.5">
            <Commemorations day={day} />
          </div>
          <DayFooter day={day} />
        </div>
      </div>
    </li>
  );
}

/** The large version of a day, for /azi and the landing page. */
export function DayLeaf({ day, heading }: { day: DayEntry; heading: React.ReactNode }) {
  const lit = liturgicalColour(day);
  return (
    <div className="relative overflow-hidden rounded-sm border border-oak bg-parchment shadow-micro" style={cardStyle(day.rank)}>
      {lit && (
        <span aria-hidden className="absolute inset-y-0 left-0 w-[3px]" style={{ background: LITURGICAL_VAR[lit.colour] }} />
      )}
      <div className="p-5 sm:p-8">
        {heading}
        <div className="mt-2">
          <DayRubric day={day} />
        </div>
        <div className="mt-4">
          <Commemorations day={day} size="lg" />
        </div>
        <DayFooter day={day} />
      </div>
    </div>
  );
}
