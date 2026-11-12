import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { AdSlot } from "@/components/ads";
import { notFound } from "next/navigation";
import { AppNote, Breadcrumbs } from "@/components/chrome";
import { DayCard, FastBadge } from "@/components/calendar-bits";
import { TodayMarker } from "@/components/today-marker";
import { isPublishedYear, PUBLISHED_YEARS } from "@/lib/calendar";
import { count, formatRange, MONTHS } from "@/lib/dates";
import { periodDays, type FastLevel } from "@/lib/liturgical";
import { countLevels, FAST_INFO, FAST_ORDERED, FAST_SLUGS, fastDays, type FastSlug } from "@/lib/fasts";

export function generateStaticParams() {
  return PUBLISHED_YEARS.flatMap((y) =>
    FAST_ORDERED.filter((s) => FAST_INFO[s].get(y)).map((s) => ({ an: String(y), post: s })),
  );
}

const isSlug = (s: string): s is FastSlug => s in FAST_SLUGS;

export async function generateMetadata({ params }: PageProps<"/posturi/[an]/[post]">): Promise<Metadata> {
  const { an, post } = await params;
  if (!isSlug(post)) return {};
  const info = FAST_INFO[post];
  const p = info.get(Number(an));
  return pageMeta({
    title: `${info.short} ${an}: date și dezlegări`,
    description: p
      ? `${info.title} în ${an}: ${formatRange(p.start, p.end)}, ${count(periodDays(p), "zi", "zile")}. Toate zilele, cu dezlegările la pește, untdelemn și vin și ajunările.`
      : `${info.title} în ${an}.`,
    path: `/posturi/${an}/${post}`,
  });
}

const SUMMARY: FastLevel[] = ["fish", "wineOil", "fast", "strict"];

export default async function FastPage({ params }: PageProps<"/posturi/[an]/[post]">) {
  const { an, post } = await params;
  const year = Number(an);
  if (!isPublishedYear(year) || !isSlug(post)) notFound();
  const f = fastDays(post, year);
  if (!f) notFound();
  const info = FAST_INFO[post];
  const c = countLevels(f.days);
  const fishDays = f.days.filter((d) => d.fastLevel === "fish");
  const otherYears = PUBLISHED_YEARS.filter((y) => y !== year && info.get(y));

  return (
    <>
      <Breadcrumbs
        items={[
          { href: "/", label: "Acasă" },
          { href: "/posturi", label: "Posturi" },
          { href: `/posturi/${year}`, label: an },
          { label: info.title },
        ]}
      />
      <article className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:gap-12">
          <div>
            <div className="md:sticky md:top-24">
              <p className="rubric text-red">{info.alsoKnown}</p>
              <h1 className="mt-2 text-[34px] font-bold leading-[1.15] text-ink sm:text-[40px]">
                {info.title} {year}
              </h1>
              <p className="rubric mt-3 text-umber">
                {formatRange(f.period.start, f.period.end, true)} · {count(periodDays(f.period), "zi", "zile")}
              </p>
              <p className="mt-4 text-[16px] leading-relaxed text-ink">{info.intro}</p>
              <dl className="mt-6 divide-y divide-oak border-y border-oak">
                {SUMMARY.filter((l) => c[l]).map((l) => (
                  <div key={l} className="flex items-center justify-between gap-3 py-2">
                    <dt><FastBadge level={l} /></dt>
                    <dd className="font-display text-[20px] font-bold">{c[l]}</dd>
                  </div>
                ))}
              </dl>
              {fishDays.length > 0 && (
                <p className="mt-5 text-[15.5px] leading-relaxed">
                  <span className="rubric block text-umber">Dezlegare la pește în {year}</span>
                  {fishDays.map((d) => `${d.day} ${MONTHS[d.month - 1]}`).join(", ")}.
                </p>
              )}
            </div>
          </div>
          <div className="min-w-0">
            <h2 className="rubric mb-3 text-red">Zi cu zi</h2>
            <ol className="space-y-2">
              {f.days.map((d) => (
                <DayCard key={d.date} day={d} showMonth />
              ))}
            </ol>
            <TodayMarker />
            <p className="mt-6 text-[15px] text-umber">
              Rânduiala poate diferi de la o parohie la alta; pentru postul vostru, întrebați preotul duhovnic.
              {otherYears.map((y) => (
                <span key={y}>
                  {" "}Vedeți și{" "}
                  <Link href={`/posturi/${y}/${post}`} className="font-medium text-red underline underline-offset-4">
                    {info.title} {y}
                  </Link>
                  .
                </span>
              ))}
            </p>
            <AdSlot />
          </div>
        </div>
      </article>
      <AppNote />
    </>
  );
}
