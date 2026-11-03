import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ads";
import { notFound } from "next/navigation";
import { AppNote, Breadcrumbs } from "@/components/chrome";
import { DayRow, FastPill } from "@/components/calendar-bits";
import { TodayMarker } from "@/components/today-marker";
import { isPublishedYear, PUBLISHED_YEARS } from "@/lib/calendar";
import { count, formatLong, formatRange, MONTHS } from "@/lib/dates";
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
  return {
    title: `${info.title} ${an}: când începe și zilele cu dezlegare`,
    description: p
      ? `${info.title} (${info.alsoKnown}) în ${an}: de la ${formatLong(p.start, false)} la ${formatLong(p.end, false)}. Toate zilele, cu dezlegările la pește, la untdelemn și vin și zilele de ajunare.`
      : undefined,
    alternates: { canonical: `/posturi/${an}/${post}` },
  };
}

const SUMMARY: FastLevel[] = ["fish", "wineOil", "dairy", "fast", "strict"];

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
      <article className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
        <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-gold">{info.alsoKnown}</p>
        <h1 className="font-display mt-2 text-[36px] font-bold leading-tight text-burgundy sm:text-[46px]">
          {info.title} {year}
        </h1>
        <p className="mt-3 text-[19px] font-medium">
          {formatRange(f.period.start, f.period.end, true)} · {count(periodDays(f.period), "zi", "zile")}
        </p>
        <p className="mt-4 text-[17px] leading-relaxed text-ink/85">{info.intro}</p>

        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SUMMARY.filter((l) => c[l]).map((l) => (
            <div key={l} className="rounded-[14px] border border-border bg-surface p-3">
              <div className="font-display text-[26px] font-bold leading-none">{c[l]}</div>
              <div className="mt-2"><FastPill level={l} compact /></div>
            </div>
          ))}
        </div>

        {fishDays.length > 0 && (
          <p className="mt-6 text-[16.5px] leading-relaxed">
            <strong className="font-semibold">Dezlegare la pește</strong> în {year}:{" "}
            {fishDays.map((d) => `${d.day} ${MONTHS[d.month - 1]}`).join(", ")}.
          </p>
        )}

<AdSlot />
        <h2 className="font-display mt-12 text-[26px] font-bold text-burgundy">Zi cu zi</h2>
        <ol className="mt-4 overflow-hidden rounded-[20px] border border-border bg-paper">
          {f.days.map((d) => (
            <DayRow key={d.date} day={d} showMonth />
          ))}
        </ol>
        <TodayMarker />

        <p className="mt-6 text-[15px] text-muted">
          Rânduiala poate diferi de la o parohie la alta; pentru postul vostru, întrebați preotul duhovnic.
          {otherYears.map((y) => (
            <span key={y}>
              {" "}Vedeți și{" "}
              <Link href={`/posturi/${y}/${post}`} className="font-semibold text-burgundy hover:underline">
                {info.title} {y}
              </Link>
              .
            </span>
          ))}
        </p>
      </article>
      <AppNote />
    </>
  );
}
