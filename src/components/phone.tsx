import Image from "next/image";
import { screenshot, type ScreenName } from "@/lib/screenshots";
import { getRange, type DayEntry } from "@/lib/calendar";
import { addDays, capitalize, count, daysBetween, formatLong, MONTHS, WEEKDAY_SHORT, type Ymd } from "@/lib/dates";
import { FAST_INFO, FAST_ORDERED } from "@/lib/fasts";
import { FastPill, RANK_COLOR } from "./calendar-bits";
import { CalendarIcon, CrossIcon, MapPinIcon, UserIcon } from "./icons";

/**
 * A phone with the app's screen in it. Shows the real screenshot when one is
 * in public/screenshots/, otherwise draws the screen from the same data.
 */
export function Phone({
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
    <div className="relative mx-auto w-[280px] sm:w-[300px]">
      <div className="absolute -inset-6 -z-10 rounded-[60px] bg-gradient-to-b from-accent-surface to-transparent blur-2xl" />
      <div className="rounded-[44px] border border-ink/10 bg-ink p-[9px] shadow-[0_30px_60px_-20px_rgba(38,30,20,0.45)]">
        <div className="relative aspect-[9/19.5] overflow-hidden rounded-[36px] bg-paper">
          {src ? (
            <Image src={src} alt={alt} fill sizes="300px" className="object-cover object-top" priority={priority} />
          ) : (
            <div role="img" aria-label={alt} className="flex h-full flex-col">
              <StatusBar />
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
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-semibold text-ink">
      <span>9:41</span>
      <span className="h-[18px] w-[70px] rounded-full bg-ink" />
      <span className="tracking-widest">▮▮▮</span>
    </div>
  );
}

function TabBar({ active }: { active: ScreenName }) {
  const tabs: { id: ScreenName; label: string; Icon: typeof CalendarIcon }[] = [
    { id: "calendar", label: "Calendar", Icon: CalendarIcon },
    { id: "posturi", label: "Posturi", Icon: CrossIcon },
    { id: "harta", label: "Hartă", Icon: MapPinIcon },
    { id: "profil", label: "Profil", Icon: UserIcon },
  ];
  return (
    <div className="grid grid-cols-4 border-t border-border bg-surface px-2 pt-2 pb-4">
      {tabs.map(({ id, label, Icon }) => (
        <div key={id} className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${id === active ? "text-burgundy" : "text-muted"}`}>
          <span className={`rounded-full px-3 py-0.5 ${id === active ? "bg-accent-surface" : ""}`}>
            <Icon width={17} height={17} />
          </span>
          {label}
        </div>
      ))}
    </div>
  );
}

function MiniDay({ d, isToday }: { d: DayEntry; isToday: boolean }) {
  const red = d.rank === "praznic" || d.rank === "cruce_rosie" || d.weekday === 7;
  return (
    <div className={`flex gap-2.5 border-b border-border px-3 py-2.5 ${isToday ? "bg-accent-surface shadow-[inset_3px_0_0_var(--color-burgundy)]" : ""}`}>
      <div className="w-8 shrink-0 text-center" style={{ color: red ? "var(--color-feast-red)" : "var(--color-calendar-ink)" }}>
        <div className="font-display text-[20px] font-bold leading-none">{d.day}</div>
        <div className="text-[9.5px] font-semibold opacity-80">{WEEKDAY_SHORT[d.weekday - 1]}</div>
      </div>
      <div className="min-w-0">
        {isToday && <div className="text-[8.5px] font-bold tracking-[0.12em] text-burgundy">ASTĂZI</div>}
        {d.rank !== "simplu" && (
          <div className="text-[8.5px] font-bold uppercase tracking-wide" style={{ color: RANK_COLOR[d.rank] }}>
            ✛ {d.rank === "praznic" ? "Praznic" : d.rank === "cruce_rosie" ? "Cruce roșie" : "Cruce albastră"}
          </div>
        )}
        <div className="font-display line-clamp-2 text-[12px] leading-snug text-calendar-ink">
          {d.feasts[0]?.parts.map((p) => p.text).join("; ") ?? "Pomenirea zilei"}
        </div>
        {d.fastLevel !== "none" && (
          <div className="mt-1 origin-left scale-[0.78]">
            <FastPill level={d.fastLevel} compact />
          </div>
        )}
      </div>
    </div>
  );
}

function CalendarScreen({ today }: { today: Ymd }) {
  const days = getRange(addDays(today, -1), addDays(today, 6));
  return (
    <div>
      <div className="px-4 pt-2 pb-2">
        <div className="font-display text-[22px] font-bold text-burgundy">
          {capitalize(MONTHS[today.m - 1])} {today.y}
        </div>
      </div>
      {days.map((d) => (
        <MiniDay key={d.date} d={d} isToday={d.date === days[1].date} />
      ))}
    </div>
  );
}

function PosturiScreen({ today }: { today: Ymd }) {
  const rows = FAST_ORDERED.flatMap((slug) =>
    [today.y, today.y + 1].map((y) => ({ slug, y, p: FAST_INFO[slug].get(y) })),
  )
    .filter((r) => r.p && daysBetween(today, r.p.end) >= 0)
    .sort((a, b) => daysBetween(b.p!.start, a.p!.start))
    .slice(0, 4);
  return (
    <div className="px-4 pt-2">
      <div className="font-display text-[22px] font-bold text-burgundy">Ghid de Post</div>
      <p className="text-[11px] text-muted">Marile perioade liturgice de înfrânare și rugăciune.</p>
      <div className="mt-3 space-y-2">
        {rows.map(({ slug, p }, i) => {
          const active = daysBetween(p!.start, today) >= 0;
          const n = daysBetween(today, p!.start);
          return (
            <div key={slug + i} className={`rounded-[14px] border p-3 ${active ? "border-gold bg-accent-surface" : "border-border bg-surface"}`}>
              <div className="text-[9px] font-bold uppercase tracking-wider text-gold">
                {active ? "În desfășurare" : n === 1 ? "Începe mâine" : `Începe în ${count(n, "zi", "zile")}`}
              </div>
              <div className="font-display text-[14px] font-semibold leading-tight text-ink">{FAST_INFO[slug].title}</div>
              <div className="mt-0.5 text-[10.5px] text-muted">
                {formatLong(p!.start, false)} – {formatLong(p!.end, false)}
              </div>
              {active && (
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-burgundy"
                    style={{ width: `${Math.round(((daysBetween(p!.start, today) + 1) / (daysBetween(p!.start, p!.end) + 1)) * 100)}%` }}
                  />
                </div>
              )}
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
const PINS = Array.from({ length: 46 }, (_, i) => ({
  x: (i * 37 + 11) % 92 + 4,
  y: (i * 53 + 7) % 70 + 8,
  k: i % 9 === 0 ? 1 : i % 13 === 0 ? 2 : i % 7 === 0 ? 4 : i % 11 === 0 ? 3 : 0,
}));

function HartaScreen() {
  return (
    <div className="relative h-full bg-[#efe9da]">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        <path d="M-5 70 C 20 60, 35 78, 55 64 S 90 50, 105 58" stroke="#a8c7dc" strokeWidth="2.2" fill="none" />
        <path d="M10 -5 L 30 40 L 25 105" stroke="#fff" strokeWidth="1.2" fill="none" />
        <path d="M-5 30 L 50 35 L 105 22" stroke="#fff" strokeWidth="1.2" fill="none" />
        <path d="M60 -5 L 70 50 L 95 105" stroke="#fff" strokeWidth="0.9" fill="none" />
        <circle cx="72" cy="80" r="14" fill="#dfe8cf" />
        <circle cx="18" cy="18" r="10" fill="#dfe8cf" />
      </svg>
      {PINS.map((p, i) => (
        <span
          key={i}
          className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-white shadow"
          style={{ left: `${p.x}%`, top: `${p.y}%`, background: PLACES[p.k].color }}
        />
      ))}
      <div className="absolute inset-x-3 top-2 rounded-full border border-border bg-paper/95 px-3 py-2 text-[11px] text-muted shadow-sm">
        Caută o biserică sau o localitate
      </div>
      <div className="absolute inset-x-3 bottom-3 flex flex-wrap gap-1 rounded-[14px] border border-border bg-paper/95 p-2">
        {PLACES.map((pl) => (
          <span key={pl.label} className="inline-flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 text-[9.5px] font-semibold text-ink">
            <span className="h-2 w-2 rounded-full" style={{ background: pl.color }} />
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
    ["Întrebarea „Ați ținut postul?”", false],
  ] as const;
  return (
    <div className="px-4 pt-2">
      <div className="font-display text-[22px] font-bold text-burgundy">Profil</div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {["Favorite · 12", "Vizitate · 7"].map((t) => (
          <div key={t} className="rounded-[14px] border border-border bg-surface p-3 text-[11.5px] font-semibold text-ink">
            {t}
          </div>
        ))}
      </div>
      <div className="mt-4 text-[9.5px] font-bold uppercase tracking-wider text-muted">Notificări și date</div>
      <div className="mt-2 divide-y divide-border rounded-[14px] border border-border bg-surface">
        {rows.map(([label, on]) => (
          <div key={label} className="flex items-center justify-between gap-2 px-3 py-2.5 text-[11px] text-ink">
            <span>{label}</span>
            <span className={`relative h-4 w-7 shrink-0 rounded-full ${on ? "bg-burgundy" : "bg-border"}`}>
              <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white ${on ? "left-3.5" : "left-0.5"}`} />
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-muted">Ora notificării zilnice: 07:30</div>
    </div>
  );
}
