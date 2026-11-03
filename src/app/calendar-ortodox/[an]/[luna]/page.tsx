import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ads";
import { notFound } from "next/navigation";
import { AppNote, Breadcrumbs } from "@/components/chrome";
import { DayRow, FastLegend } from "@/components/calendar-bits";
import { ChevronLeft, ChevronRight } from "@/components/icons";
import { TodayMarker } from "@/components/today-marker";
import { getMonth, isPublishedYear, PUBLISHED_YEARS } from "@/lib/calendar";
import { capitalize, count, monthFromSlug, MONTHS } from "@/lib/dates";

export function generateStaticParams() {
  return PUBLISHED_YEARS.flatMap((y) => MONTHS.map((m) => ({ an: String(y), luna: m })));
}

export async function generateMetadata({ params }: PageProps<"/calendar-ortodox/[an]/[luna]">): Promise<Metadata> {
  const { an, luna } = await params;
  const L = capitalize(luna);
  return {
    title: `Calendar ortodox ${luna} ${an}`,
    description: `Calendarul ortodox pe ${luna} ${an}, zi cu zi: sfinții pomeniți, sărbătorile cu cruce roșie, zilele de post și dezlegările la pește, untdelemn și vin. ${L} ${an} în calendarul creștin ortodox.`,
    alternates: { canonical: `/calendar-ortodox/${an}/${luna}` },
  };
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
      <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
        <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-gold">Calendar ortodox {year}</p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <h1 className="font-display text-[38px] font-bold leading-tight text-burgundy sm:text-[48px]">
            {capitalize(luna)} {year}
          </h1>
          <div className="flex gap-1.5">
            {[
              { href: prevHref, label: `${MONTHS[prev.m - 1]} ${prev.y}`, Icon: ChevronLeft },
              { href: nextHref, label: `${MONTHS[next.m - 1]} ${next.y}`, Icon: ChevronRight },
            ].map(({ href, label, Icon }) =>
              href ? (
                <Link key={label} href={href} aria-label={capitalize(label)} className="grid h-11 w-11 place-items-center rounded-full border border-border bg-surface text-burgundy hover:border-gold">
                  <Icon />
                </Link>
              ) : (
                <span key={label} aria-hidden className="grid h-11 w-11 place-items-center rounded-full border border-border text-border">
                  <Icon />
                </span>
              ),
            )}
          </div>
        </div>
        <p className="mt-4 text-[16.5px] leading-relaxed text-ink/85">
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
        <div className="mt-5">
          <FastLegend />
        </div>
        <ol className="mt-8 overflow-hidden rounded-[20px] border border-border bg-paper">
          {days.map((d) => (
            <DayRow key={d.date} day={d} />
          ))}
        </ol>
        <TodayMarker />
        <div className="mt-6 flex justify-between text-[15px] font-semibold text-burgundy">
          {prevHref ? <Link href={prevHref} className="hover:underline">← {capitalize(MONTHS[prev.m - 1])} {prev.y}</Link> : <span />}
          {nextHref ? <Link href={nextHref} className="hover:underline">{capitalize(MONTHS[next.m - 1])} {next.y} →</Link> : <span />}
        </div>
      </div>
<AdSlot />
      <AppNote />
    </>
  );
}
