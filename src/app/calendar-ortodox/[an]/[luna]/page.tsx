import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { AdSlot } from "@/components/ads";
import { notFound } from "next/navigation";
import { AppNote, Breadcrumbs } from "@/components/chrome";
import { DayCard, FastLegend } from "@/components/calendar-bits";
import type { DayEntry } from "@/lib/calendar";
import { ChevronLeft, ChevronRight } from "@/components/icons";
import { TodayMarker } from "@/components/today-marker";
import { getMonth, isPublishedYear, PUBLISHED_YEARS } from "@/lib/calendar";
import { capitalize, count, monthFromSlug, MONTHS } from "@/lib/dates";

export function generateStaticParams() {
  return PUBLISHED_YEARS.flatMap((y) => MONTHS.map((m) => ({ an: String(y), luna: m })));
}

export async function generateMetadata({ params }: PageProps<"/calendar-ortodox/[an]/[luna]">): Promise<Metadata> {
  const { an, luna } = await params;
  return pageMeta({
    title: `Calendar ortodox ${luna} ${an}`,
    description: `Calendarul ortodox pe ${luna} ${an}, zi cu zi: sfinții pomeniți, sărbătorile cu cruce roșie, zilele de post și dezlegările la pește.`,
    path: `/calendar-ortodox/${an}/${luna}`,
  });
}

export default async function MonthPage({ params }: PageProps<"/calendar-ortodox/[an]/[luna]">) {
  const { an, luna } = await params;
  const year = Number(an);
  const month = monthFromSlug(luna);
  if (!isPublishedYear(year) || !month) notFound();

  const days = getMonth(year, month);
  const red = days.filter((d) => d.rank === "praznic" || d.rank === "cruce_rosie");
  const fasting = days.filter((d) => d.fastLevel !== "none").length;
  const fish = days.filter((d) => d.fastLevel === "fish").length;

  const prev = month === 1 ? { y: year - 1, m: 12 } : { y: year, m: month - 1 };
  const next = month === 12 ? { y: year + 1, m: 1 } : { y: year, m: month + 1 };
  const link = (x: { y: number; m: number }) =>
    isPublishedYear(x.y) ? `/calendar-ortodox/${x.y}/${MONTHS[x.m - 1]}` : null;
  const prevHref = link(prev);
  const nextHref = link(next);

  return (
    <>
      <Breadcrumbs
        items={[
          { href: "/", label: "Acasă" },
          { href: "/calendar-ortodox", label: "Calendar ortodox" },
          { href: `/calendar-ortodox/${year}`, label: an },
          { label: capitalize(luna) },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:gap-12">
          <div>
            <div className="md:sticky md:top-24">
              <p className="rubric text-red">Calendar ortodox {year}</p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <h1 className="text-[36px] font-bold leading-[1.15] text-ink sm:text-[40px]">
                  {capitalize(luna)} {year}
                </h1>
                <div className="flex gap-1.5">
                  {[
                    { href: prevHref, label: `${MONTHS[prev.m - 1]} ${prev.y}`, Icon: ChevronLeft },
                    { href: nextHref, label: `${MONTHS[next.m - 1]} ${next.y}`, Icon: ChevronRight },
                  ].map(({ href, label, Icon }) =>
                    href ? (
                      <Link key={label} href={href} aria-label={capitalize(label)} className="grid h-10 w-10 place-items-center rounded-sm border border-oak bg-surface text-ink hover:border-umber">
                        <Icon />
                      </Link>
                    ) : (
                      <span key={label} aria-hidden className="grid h-10 w-10 place-items-center rounded-sm border border-oak text-oak">
                        <Icon />
                      </span>
                    ),
                  )}
                </div>
              </div>
              <p className="mt-4 text-[16px] leading-relaxed text-umber">
                În {luna} {year} {red.length === 1 ? "este" : "sunt"}{" "}
                {red.length === 0 ? "nicio sărbătoare cu cruce roșie" : count(red.length, "sărbătoare cu cruce roșie", "sărbători cu cruce roșie")}
                {red.length > 0 && (
                  <>
                    {" "}({red.slice(0, 3).map((d) => `${d.day} ${luna}`).join(", ")}
                    {red.length > 3 ? " și altele" : ""})
                  </>
                )}{" "}
                și {count(fasting, "zi", "zile")} de post
                {fish > 0 ? `, dintre care ${fish} cu dezlegare la pește` : ""}.
              </p>
              <MonthGrid days={days} />
              <div className="mt-6">
                <FastLegend />
              </div>
            </div>
          </div>
          <div className="min-w-0">
            <ol className="space-y-2">
              {days.map((d) => (
                <DayCard key={d.date} day={d} />
              ))}
            </ol>
            <TodayMarker />
            <div className="mt-6 flex justify-between font-ui text-[17px] font-medium text-red">
              {prevHref ? <Link href={prevHref} className="hover:underline">← {capitalize(MONTHS[prev.m - 1])} {prev.y}</Link> : <span />}
              {nextHref ? <Link href={nextHref} className="hover:underline">{capitalize(MONTHS[next.m - 1])} {next.y} →</Link> : <span />}
            </div>
            <AdSlot />
          </div>
        </div>
      </div>
      <AppNote />
    </>
  );
}

/** A small month grid in the margin, like the index of a wall calendar. */
function MonthGrid({ days }: { days: DayEntry[] }) {
  const lead = days[0].weekday - 1;
  return (
    <div className="mt-6" aria-label="Zilele lunii">
      <div className="grid grid-cols-7 border-t border-l border-oak text-center">
        {["L", "Ma", "Mi", "J", "V", "S", "D"].map((w, i) => (
          <div key={w} className={`rubric border-r border-b border-oak py-1 text-[11px] ${i === 6 ? "text-red" : "text-umber"}`}>
            {w}
          </div>
        ))}
        {Array.from({ length: lead }, (_, i) => (
          <div key={`e${i}`} className="border-r border-b border-oak" />
        ))}
        {days.map((d) => {
          const red = d.rank === "praznic" || d.rank === "cruce_rosie" || d.weekday === 7;
          return (
            <a
              key={d.date}
              href={`#ziua-${d.day}`}
              data-date={d.date}
              className="border-r border-b border-oak py-1.5 font-display text-[15px] font-semibold hover:bg-surface"
              style={{ color: red ? "var(--rosie-title)" : "var(--ink)" }}
            >
              {d.day}
            </a>
          );
        })}
      </div>
    </div>
  );
}
