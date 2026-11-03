import Image from "next/image";
import { screenshot, type ScreenName } from "@/lib/screenshots";
import { getRange, type DayEntry } from "@/lib/calendar";
import { addDays, capitalize, count, daysBetween, formatRange, MONTHS, WEEKDAY_SHORT, type Ymd } from "@/lib/dates";
import { FAST_INFO, FAST_ORDERED } from "@/lib/fasts";
import { LITURGICAL_VAR, liturgicalColour } from "@/lib/liturgical-colour";
import { FastBadge } from "./calendar-bits";
import { CalendarIcon, MapPinIcon, OrthodoxCross, UserIcon } from "./icons";

const LABEL: Record<ScreenName, string> = {
  calendar: "Calendar",
  posturi: "Posturi",
  harta: "Hartă",
  profil: "Profil",
};

/**
 * One app screen, shown flat like a plate in a book: 8px corners, a 1px oak
 * border, the micro shadow and a caption. No device bezel, no glow.
 * Uses the real screenshot from public/screenshots/ when there is one;
 * otherwise draws the screen from the same calendar data.
 */
export function AppScreen({
  screen,
  today,
  alt,
  priority = false,
}: {
  screen: ScreenName;
  today: Ymd;
  alt: string;
  priority?: boolean;
}) {
  const src = screenshot(screen);
  return (
    <figure className="w-full">
      <div className="relative aspect-[9/17] overflow-hidden rounded-md border border-oak bg-parchment shadow-micro">
        {src ? (
          <Image src={src} alt={alt} fill sizes="(min-width: 768px) 25vw, 80vw" className="object-cover object-top" priority={priority} />
        ) : (
          <div role="img" aria-label={alt} className="flex h-full flex-col">
            <div className="min-h-0 flex-1 overflow-hidden">
              {screen === "calendar" && <CalendarScreen today={today} />}
              {screen === "posturi" && <PosturiScreen today={today} />}
              {screen === "harta" && <HartaScreen />}
              {screen === "profil" && <ProfilScreen />}
            </div>
            <TabBar active={screen} />
          </div>
        )}
      </div>
      <figcaption className="rubric mt-3 text-umber">Fila {LABEL[screen]}</figcaption>
    </figure>
  );
}

function TabBar({ active }: { active: ScreenName }) {
  const tabs: { id: ScreenName; Icon: (p: React.SVGProps<SVGSVGElement>) => React.ReactElement }[] = [
    { id: "calendar", Icon: CalendarIcon },
    { id: "posturi", Icon: OrthodoxCross },
    { id: "harta", Icon: MapPinIcon },
    { id: "profil", Icon: UserIcon },
  ];
  return (
    <div className="grid grid-cols-4 border-t border-oak bg-surface px-1 pt-2 pb-3">
      {tabs.map(({ id, Icon }) => (
        <div
          key={id}
          className={`flex flex-col items-center gap-0.5 font-ui text-[10.5px] font-medium ${id === active ? "text-ink" : "text-umber"}`}
        >
          <Icon width={15} height={15} style={id === active ? { color: "var(--gold)" } : undefined} />
          {LABEL[id]}
        </div>
      ))}
    </div>
  );
}

function MiniDay({ d, isToday }: { d: DayEntry; isToday: boolean }) {
  const lit = liturgicalColour(d);
  const red = d.rank === "praznic" || d.rank === "cruce_rosie" || d.weekday === 7;
  return (
    <div className={`relative flex gap-2 border-b border-oak py-2 pr-2 pl-3 ${isToday ? "bg-surface" : ""}`}>
      {lit && <span aria-hidden className="absolute inset-y-0 left-0 w-[3px]" style={{ background: LITURGICAL_VAR[lit.colour] }} />}
      <div className="w-6 shrink-0 text-center" style={{ color: red ? "var(--rosie-title)" : "var(--ink)" }}>
        <div className="font-display text-[17px] font-bold leading-none">{d.day}</div>
        <div className="font-mono text-[8px] uppercase">{WEEKDAY_SHORT[d.weekday - 1]}</div>
      </div>
      <div className="min-w-0">
        {isToday && <div className="font-mono text-[7.5px] font-semibold tracking-wider text-red uppercase">Astăzi</div>}
        <div className="line-clamp-2 text-[10.5px] font-medium leading-snug text-ink">
          {d.feasts[0]?.parts.map((p) => p.text).join("; ") ?? "Pomenirea zilei"}
        </div>
        {d.fastLevel !== "none" && (
          <div className="mt-1 origin-left scale-[0.72]">
            <FastBadge level={d.fastLevel} compact />
          </div>
        )}
      </div>
    </div>
  );
}

function ScreenTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="px-3 pt-3 pb-2">
      <div className="font-display text-[17px] font-bold leading-tight text-ink">{children}</div>
      {sub && <p className="mt-0.5 text-[9.5px] leading-snug text-umber">{sub}</p>}
    </div>
  );
}

function CalendarScreen({ today }: { today: Ymd }) {
  const days = getRange(addDays(today, -1), addDays(today, 5));
  return (
    <div>
      <ScreenTitle>
        {capitalize(MONTHS[today.m - 1])} {today.y}
      </ScreenTitle>
      {days.map((d) => (
        <MiniDay key={d.date} d={d} isToday={d.date === days[1].date} />
      ))}
    </div>
  );
}

function PosturiScreen({ today }: { today: Ymd }) {
  const rows = FAST_ORDERED.flatMap((slug) => [today.y, today.y + 1].map((y) => ({ slug, p: FAST_INFO[slug].get(y) })))
    .filter((r) => r.p && daysBetween(today, r.p.end) >= 0)
    .sort((a, b) => daysBetween(b.p!.start, a.p!.start))
    .slice(0, 4);
  return (
    <div>
      <ScreenTitle sub="Marile perioade de înfrânare și rugăciune.">Ghid de post</ScreenTitle>
      <div className="space-y-1.5 px-3">
        {rows.map(({ slug, p }, i) => {
          const active = daysBetween(p!.start, today) >= 0;
          const n = daysBetween(today, p!.start);
          return (
            <div key={slug + i} className="relative overflow-hidden rounded-sm border border-oak bg-parchment py-2 pr-2 pl-3">
              <span aria-hidden className="absolute inset-y-0 left-0 w-[3px]" style={{ background: "var(--purple)" }} />
              <div className="font-mono text-[7.5px] uppercase tracking-wider text-umber">
                {active ? "În desfășurare" : n === 1 ? "Începe mâine" : `Începe în ${count(n, "zi", "zile")}`}
              </div>
              <div className="font-display text-[11.5px] font-semibold leading-tight text-ink">{FAST_INFO[slug].title}</div>
              <div className="text-[9px] text-umber">{formatRange(p!.start, p!.end)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const PLACES = [
  { label: "Biserici", color: "#C62828" },
  { label: "Mănăstiri", color: "#7B1FA2" },
  { label: "Catedrale", color: "#F9A825" },
  { label: "Paraclise", color: "#1565C0" },
  { label: "Troițe", color: "#37474F" },
];

// Fixed pseudo-random pins, so the drawing is identical on every build.
const PINS = Array.from({ length: 40 }, (_, i) => ({
  x: ((i * 37 + 11) % 90) + 5,
  y: ((i * 53 + 7) % 62) + 12,
  k: i % 9 === 0 ? 1 : i % 13 === 0 ? 2 : i % 7 === 0 ? 4 : i % 11 === 0 ? 3 : 0,
}));

function HartaScreen() {
  return (
    <div className="relative h-full bg-surface">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        <path d="M-5 70 C 20 60, 35 78, 55 64 S 90 50, 105 58" stroke="var(--b-fish-fg)" strokeOpacity="0.35" strokeWidth="2" fill="none" />
        <path d="M10 -5 L 30 40 L 25 105M-5 30 L 50 35 L 105 22M60 -5 L 70 50 L 95 105" stroke="var(--oak)" strokeWidth="1" fill="none" />
      </svg>
      {PINS.map((p, i) => (
        <span
          key={i}
          className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 border border-parchment"
          style={{ left: `${p.x}%`, top: `${p.y}%`, background: PLACES[p.k].color }}
        />
      ))}
      <div className="absolute inset-x-2 top-2 rounded-sm border border-oak bg-parchment px-2 py-1.5 text-[9.5px] text-umber">
        Caută o biserică sau o localitate
      </div>
      <div className="absolute inset-x-2 bottom-2 flex flex-wrap gap-1 rounded-sm border border-oak bg-parchment p-1.5">
        {PLACES.map((pl) => (
          <span key={pl.label} className="inline-flex items-center gap-1 text-[8.5px] font-medium text-ink">
            <span className="h-1.5 w-1.5" style={{ background: pl.color }} />
            {pl.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProfilScreen() {
  const rows = [
    ["Notificarea zilnică", true],
    ["Sunet la sărbătorile mari", true],
    ["Anunț cu o zi înainte", true],
    ["Hramul bisericilor favorite", true],
    ["„Ați ținut postul?”", false],
  ] as const;
  return (
    <div>
      <ScreenTitle>Profil</ScreenTitle>
      <div className="grid grid-cols-2 gap-1.5 px-3">
        {["Favorite · 12", "Vizitate · 7"].map((t) => (
          <div key={t} className="rounded-sm border border-oak bg-surface p-2 text-[10px] font-semibold text-ink">
            {t}
          </div>
        ))}
      </div>
      <div className="mt-3 px-3 font-mono text-[7.5px] uppercase tracking-wider text-umber">Notificări și date</div>
      <div className="mx-3 mt-1.5 divide-y divide-oak rounded-sm border border-oak bg-surface">
        {rows.map(([label, on]) => (
          <div key={label} className="flex items-center justify-between gap-2 px-2 py-2 text-[9.5px] text-ink">
            <span>{label}</span>
            <span className={`h-2.5 w-2.5 shrink-0 border ${on ? "border-red bg-red" : "border-umber"}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
