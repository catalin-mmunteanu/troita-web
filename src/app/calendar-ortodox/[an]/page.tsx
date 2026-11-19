import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { AdSlot } from "@/components/ads";
import { notFound } from "next/navigation";
import { AppNote, Breadcrumbs, PageHeader } from "@/components/chrome";
import { ComputedYearNote, DayCard } from "@/components/calendar-bits";
import { Section } from "@/components/section";
import { CALENDAR_YEARS, isCalendarYear, isComputedYear, majorFeasts } from "@/lib/calendar";
import { capitalize, count, formatLong, formatRange, MONTHS } from "@/lib/dates";
import { pascha, periodDays } from "@/lib/liturgical";
import { FAST_INFO, FAST_ORDERED } from "@/lib/fasts";

export function generateStaticParams() {
  return CALENDAR_YEARS.map((y) => ({ an: String(y) }));
}

export async function generateMetadata({ params }: PageProps<"/calendar-ortodox/[an]">): Promise<Metadata> {
  const { an } = await params;
  return pageMeta({
    title: `Calendar ortodox ${an}: sărbători și posturi`,
    description: `Calendarul ortodox românesc pe ${an}: data Paștelui, sărbătorile cu cruce roșie, cele patru posturi mari și toate lunile anului.`,
    path: `/calendar-ortodox/${an}`,
  });
}

export default async function YearPage({ params }: PageProps<"/calendar-ortodox/[an]">) {
  const { an } = await params;
  const year = Number(an);
  if (!isCalendarYear(year)) notFound();

  const major = majorFeasts(year);
  const byMonth = MONTHS.map((_, i) => major.filter((d) => d.month === i + 1));

  return (
    <>
      <Breadcrumbs
        items={[{ href: "/", label: "Acasă" }, { href: "/calendar-ortodox", label: "Calendar ortodox" }, { label: an }]}
      />
      <PageHeader eyebrow="Calendar creștin ortodox" title={`Calendar ortodox ${year}`}>
        Paștele cade în {formatLong(pascha(year))}. Mai jos găsiți lunile anului, sărbătorile mari și posturile.
        {isComputedYear(year) && <ComputedYearNote year={year} className="mt-4" />}
      </PageHeader>

      <Section id="luni" eyebrow={`Anul ${year}`} title="Lunile anului" rope={false}>
        <ul className="grid grid-cols-3 border-t border-l border-oak sm:grid-cols-4 md:grid-cols-6">
          {MONTHS.map((m) => (
            <li key={m}>
              <Link
                href={`/calendar-ortodox/${year}/${m}`}
                className="block border-r border-b border-oak px-3 py-3 font-display text-[17px] font-semibold text-ink hover:bg-surface hover:text-red"
              >
                {capitalize(m)}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="posturi" eyebrow="Calendar de post" title={`Posturile din ${year}`}>
        <ul className="divide-y divide-oak border-y border-oak">
          {FAST_ORDERED.map((slug) => {
            const p = FAST_INFO[slug].get(year);
            if (!p) return null;
            return (
              <li key={slug}>
                <Link href={`/posturi/${year}/${slug}`} className="relative grid gap-1 py-3 pl-4 hover:bg-surface sm:grid-cols-[1fr_auto] sm:gap-6">
                  <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-purple" />
                  <span className="font-display text-[18px] font-semibold text-ink">{FAST_INFO[slug].title}</span>
                  <span className="rubric self-center text-umber">
                    {formatRange(p.start, p.end)} · {count(periodDays(p), "zi", "zile")}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <AdSlot />
      </Section>

      <Section id="sarbatori" eyebrow="Cruce roșie" title={`Sărbătorile mari din ${year}`}>
        <p className="max-w-[62ch] text-[16px] text-umber">Praznicele împărătești și sfinții cu cruce roșie, lună cu lună.</p>
        <div className="mt-6 space-y-8">
          {byMonth.map((days, i) =>
            days.length === 0 ? null : (
              <div key={i}>
                <h3 className="rubric text-red">
                  <Link href={`/calendar-ortodox/${year}/${MONTHS[i]}`} className="hover:underline">{MONTHS[i]}</Link>
                </h3>
                <ol className="mt-2 space-y-2">
                  {days.map((d) => (
                    <DayCard key={d.date} day={d} showMonth />
                  ))}
                </ol>
              </div>
            ),
          )}
        </div>
      </Section>
      <AppNote />
    </>
  );
}
