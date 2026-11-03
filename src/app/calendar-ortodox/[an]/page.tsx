import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ads";
import { notFound } from "next/navigation";
import { AppNote, Breadcrumbs, PageHeader } from "@/components/chrome";
import { FastPill, RankLabel } from "@/components/calendar-bits";
import { isPublishedYear, majorFeasts, PUBLISHED_YEARS } from "@/lib/calendar";
import { capitalize, count, formatLong, formatRange, MONTHS, WEEKDAYS } from "@/lib/dates";
import { pascha, periodDays } from "@/lib/liturgical";
import { FAST_INFO, FAST_ORDERED } from "@/lib/fasts";

export function generateStaticParams() {
  return PUBLISHED_YEARS.map((y) => ({ an: String(y) }));
}

export async function generateMetadata({ params }: PageProps<"/calendar-ortodox/[an]">): Promise<Metadata> {
  const { an } = await params;
  return {
    title: `Calendar ortodox ${an}: sărbători, posturi și dezlegări`,
    description: `Calendarul ortodox românesc pe ${an}: data Paștelui, toate sărbătorile cu cruce roșie, cele patru posturi mari și calendarul lună cu lună.`,
    alternates: { canonical: `/calendar-ortodox/${an}` },
  };
}

export default async function YearPage({ params }: PageProps<"/calendar-ortodox/[an]">) {
  const { an } = await params;
  const year = Number(an);
  if (!isPublishedYear(year)) notFound();

  const major = majorFeasts(year);
  const byMonth = MONTHS.map((_, i) => major.filter((d) => d.month === i + 1));

  return (
    <>
      <Breadcrumbs
        items={[{ href: "/", label: "Acasă" }, { href: "/calendar-ortodox", label: "Calendar ortodox" }, { label: an }]}
      />
      <PageHeader eyebrow="Calendar creștin ortodox" title={`Calendar ortodox ${year}`}>
        Paștele cade în {formatLong(pascha(year))}. Mai jos găsiți lunile anului, sărbătorile mari și posturile.
      </PageHeader>

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {MONTHS.map((m) => (
            <li key={m}>
              <Link
                href={`/calendar-ortodox/${year}/${m}`}
                className="block rounded-[12px] border border-border bg-surface px-3 py-2.5 text-center font-display text-[16px] font-semibold transition hover:border-gold hover:bg-accent-surface hover:text-burgundy"
              >
                {capitalize(m)}
              </Link>
            </li>
          ))}
        </ul>

        <section aria-labelledby="posturi" className="mt-14">
          <h2 id="posturi" className="font-display text-[28px] font-bold text-burgundy">Posturile din {year}</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {FAST_ORDERED.map((slug) => {
              const p = FAST_INFO[slug].get(year);
              if (!p) return null;
              const n = periodDays(p);
              return (
                <li key={slug}>
                  <Link
                    href={`/posturi/${year}/${slug}`}
                    className="block h-full rounded-[16px] border border-border bg-surface p-5 transition hover:border-gold"
                  >
                    <div className="font-display text-[19px] font-semibold text-ink">{FAST_INFO[slug].title}</div>
                    <div className="mt-1 text-[15px] text-muted">
                      {formatRange(p.start, p.end)} · {count(n, "zi", "zile")}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

<AdSlot />
        <section aria-labelledby="sarbatori" className="mt-14">
          <h2 id="sarbatori" className="font-display text-[28px] font-bold text-burgundy">Sărbătorile mari din {year}</h2>
          <p className="mt-2 text-[16px] text-muted">Praznicele împărătești și sfinții cu cruce roșie, lună cu lună.</p>
          <div className="mt-6 space-y-8">
            {byMonth.map((days, i) =>
              days.length === 0 ? null : (
                <div key={i}>
                  <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-gold">
                    <Link href={`/calendar-ortodox/${year}/${MONTHS[i]}`} className="hover:underline">{MONTHS[i]}</Link>
                  </h3>
                  <ul className="mt-2 divide-y divide-border border-y border-border">
                    {days.map((d) => (
                      <li key={d.date} className="flex gap-4 py-3">
                        <Link
                          href={`/calendar-ortodox/${year}/${MONTHS[i]}#ziua-${d.day}`}
                          className="w-12 shrink-0 text-center text-feast-red"
                        >
                          <span className="block font-display text-[24px] font-bold leading-none">{d.day}</span>
                          <span className="text-[12px] font-semibold">{WEEKDAYS[d.weekday - 1].slice(0, 3)}</span>
                        </Link>
                        <div className="min-w-0">
                          <RankLabel rank={d.rank} />
                          <div className="font-display text-[17px] leading-snug">{d.feasts[0]?.parts[0]?.text}</div>
                          {d.fastLevel !== "none" && (
                            <div className="mt-1.5">
                              <FastPill level={d.fastLevel} compact />
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>
        </section>
      </div>
      <AppNote />
    </>
  );
}
