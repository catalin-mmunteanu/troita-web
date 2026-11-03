import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ads";
import { cacheLife } from "next/cache";
import { AppNote, Breadcrumbs } from "@/components/chrome";
import { Commemorations, DayRow, FastPill } from "@/components/calendar-bits";
import { ArrowIcon } from "@/components/icons";
import { getDay, getRange, isPublishedYear, upcomingMajor } from "@/lib/calendar";
import { addDays, capitalize, formatWithWeekday, monthSlug, todayInRomania } from "@/lib/dates";
import { FAST_LABEL, PERIOD_LABEL } from "@/lib/liturgical";
import { currentOrNextFast, FAST_INFO } from "@/lib/fasts";

export const metadata: Metadata = {
  title: "Sfântul zilei: ce sfânt este azi în calendarul ortodox",
  description:
    "Sfântul zilei de azi în calendarul ortodox românesc: pomenirile, crucea roșie sau albastră, postul și dezlegarea zilei, plus sărbătorile care urmează.",
  alternates: { canonical: "/azi" },
};

export default async function AziPage() {
  "use cache";
  cacheLife("today");
  const today = todayInRomania();
  const day = getDay(today);
  const week = getRange(addDays(today, 1), addDays(today, 7));
  const next = upcomingMajor(today, 3);
  const fast = currentOrNextFast(today);
  const monthHref = isPublishedYear(today.y) ? `/calendar-ortodox/${today.y}/${monthSlug(today.m)}` : null;

  return (
    <>
      <Breadcrumbs items={[{ href: "/", label: "Acasă" }, { label: "Sfântul zilei" }]} />
      <article className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
        <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-gold">Sfântul zilei</p>
        <h1 className="font-display mt-2 text-[36px] font-bold leading-tight text-burgundy sm:text-[46px]">
          {capitalize(formatWithWeekday(today, true))}
        </h1>

        <div className="mt-8 rounded-[20px] border border-border bg-surface p-6 sm:p-8">
          <Commemorations day={day} size="lg" />
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-5">
            <FastPill level={day.fastLevel} />
            {day.noWeddings && <span className="text-[15px] text-muted">Nu se fac nunți</span>}
          </div>
          {(day.periodKind || day.explanation || day.notes.length > 0 || day.glas) && (
            <dl className="mt-5 grid gap-3 text-[15.5px] sm:grid-cols-[auto_1fr] sm:gap-x-6">
              {day.periodKind && (
                <>
                  <dt className="font-semibold text-muted">Perioada</dt>
                  <dd>{PERIOD_LABEL[day.periodKind]}</dd>
                </>
              )}
              {day.explanation && (
                <>
                  <dt className="font-semibold text-muted">De ce</dt>
                  <dd>{day.explanation}</dd>
                </>
              )}
              {day.notes.length > 0 && (
                <>
                  <dt className="font-semibold text-muted">Rânduială</dt>
                  <dd>{day.notes.join(" · ")}</dd>
                </>
              )}
              {day.glas && (
                <>
                  <dt className="font-semibold text-muted">Glasul</dt>
                  <dd>
                    Glasul {day.glas}, voscreasna {day.voscreasna}
                  </dd>
                </>
              )}
            </dl>
          )}
        </div>

        {fast && (
          <p className="mt-6 text-[16px] leading-relaxed text-ink/85">
            {day.periodKind === FAST_INFO[fast.slug].get(fast.year)?.kind ? "Suntem în " : "Următorul post: "}
            <Link href={`/posturi/${fast.year}/${fast.slug}`} className="font-semibold text-burgundy underline underline-offset-4">
              {FAST_INFO[fast.slug].title} {fast.year}
            </Link>
            .
          </p>
        )}

<AdSlot />
        <h2 className="font-display mt-14 text-[26px] font-bold text-burgundy">Zilele care urmează</h2>
        <ol className="mt-4 rounded-[20px] border border-border bg-paper">
          {week.map((d) => (
            <DayRow key={d.date} day={d} showMonth />
          ))}
        </ol>
        {monthHref && (
          <Link href={monthHref} className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold text-burgundy hover:underline">
            Toată luna în calendar <ArrowIcon width={15} height={15} />
          </Link>
        )}

        {next.length > 0 && (
          <>
            <h2 className="font-display mt-14 text-[26px] font-bold text-burgundy">Sărbătorile mari care vin</h2>
            <ul className="mt-4 space-y-2 text-[16.5px]">
              {next.map((d) => (
                <li key={d.date} className="flex flex-wrap gap-x-2">
                  <span className="font-semibold text-feast-red">{capitalize(formatWithWeekday({ y: d.year, m: d.month, d: d.day }))}:</span>
                  <span className="font-display">{d.feasts[0]?.parts[0]?.text}</span>
                  {d.fastLevel !== "none" && <span className="text-muted">({FAST_LABEL[d.fastLevel].toLowerCase()})</span>}
                </li>
              ))}
            </ul>
          </>
        )}
      </article>
      <AppNote />
    </>
  );
}
