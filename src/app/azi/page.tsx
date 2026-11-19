import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { AdSlot } from "@/components/ads";
import { AppNote, Breadcrumbs } from "@/components/chrome";
import { DayCard, DayLeaf } from "@/components/calendar-bits";
import { ArrowIcon } from "@/components/icons";
import { Section } from "@/components/section";
import { getDay, getRange, isCalendarYear, upcomingMajor } from "@/lib/calendar";
import { addDays, capitalize, formatWithWeekday, monthSlug, todayInRomania } from "@/lib/dates";
import { PERIOD_LABEL } from "@/lib/liturgical";
import { currentOrNextFast, FAST_INFO } from "@/lib/fasts";

export const metadata: Metadata = pageMeta({
  title: "Sfântul zilei: ce sfânt este azi",
  description:
    "Ce sfânt pomenim azi în calendarul ortodox: sfinții zilei, crucea roșie sau albastră, postul și dezlegarea, plus sărbătorile care urmează.",
  path: "/azi",
});

export default async function AziPage() {
  "use cache";
  cacheLife("today");
  const today = todayInRomania();
  const day = getDay(today);
  const week = getRange(addDays(today, 1), addDays(today, 7));
  const next = upcomingMajor(today, 4);
  const fast = currentOrNextFast(today);
  const inFast = fast && day.periodKind === FAST_INFO[fast.slug].get(fast.year)?.kind;
  const monthHref = isCalendarYear(today.y) ? `/calendar-ortodox/${today.y}/${monthSlug(today.m)}` : null;

  const facts = [
    day.periodKind ? { t: "Perioada", d: PERIOD_LABEL[day.periodKind] } : null,
    day.explanation ? { t: "De ce", d: day.explanation } : null,
    day.notes.length ? { t: "Rânduială", d: day.notes.join(" · ") } : null,
  ].filter(Boolean) as { t: string; d: string }[];

  return (
    <>
      <Breadcrumbs items={[{ href: "/", label: "Acasă" }, { label: "Sfântul zilei" }]} />
      <article className="mx-auto max-w-6xl px-4 pt-8 pb-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] md:gap-12">
          <div>
            <DayLeaf
              day={day}
              heading={
                <>
                  <p className="rubric text-red">Sfântul zilei</p>
                  <h1 className="mt-2 text-[34px] font-bold leading-[1.15] text-ink sm:text-[40px]">
                    {capitalize(formatWithWeekday(today, true))}
                  </h1>
                </>
              }
            />
            {facts.length > 0 && (
              <dl className="mt-6 divide-y divide-oak border-y border-oak">
                {facts.map((f) => (
                  <div key={f.t} className="grid gap-1 py-3 sm:grid-cols-[9rem_1fr] sm:gap-6">
                    <dt className="rubric pt-0.5 text-umber">{f.t}</dt>
                    <dd className="text-[16px] leading-relaxed">{f.d}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <aside className="space-y-8">
            {fast && (
              <div>
                <p className="rubric text-red">{inFast ? "Suntem în post" : "Următorul post"}</p>
                <Link
                  href={`/posturi/${fast.year}/${fast.slug}`}
                  className="mt-1.5 block font-display text-[20px] font-semibold leading-snug text-ink hover:text-red"
                >
                  {FAST_INFO[fast.slug].title} {fast.year}
                </Link>
              </div>
            )}
            {next.length > 0 && (
              <div>
                <p className="rubric text-red">Sărbători mari care vin</p>
                <ul className="mt-2 divide-y divide-oak border-y border-oak">
                  {next.map((d) => (
                    <li key={d.date} className="py-2.5">
                      <p className="rubric text-umber">{formatWithWeekday({ y: d.year, m: d.month, d: d.day })}</p>
                      <p className="font-display text-[17px] font-semibold leading-snug" style={{ color: "var(--rosie-title)" }}>
                        {d.feasts[0]?.parts[0]?.text}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
        <AdSlot />
      </article>

      <Section id="zilele-urmatoare" eyebrow="Calendar" title="Zilele care urmează">
        <ol className="space-y-2">
          {week.map((d) => (
            <DayCard key={d.date} day={d} showMonth />
          ))}
        </ol>
        {monthHref && (
          <Link href={monthHref} className="mt-4 inline-flex items-center gap-1.5 font-ui text-[17px] font-medium text-red hover:underline">
            Toată luna în calendar <ArrowIcon width={15} height={15} />
          </Link>
        )}
      </Section>
      <AppNote />
    </>
  );
}
