import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppNote, Breadcrumbs, PageHeader } from "@/components/chrome";
import { FastPill } from "@/components/calendar-bits";
import { isPublishedYear, PUBLISHED_YEARS } from "@/lib/calendar";
import { count, formatLong, formatRange } from "@/lib/dates";
import { harti, pascha, periodDays, saptamanaBranzei, type FastLevel } from "@/lib/liturgical";
import { countLevels, FAST_INFO, FAST_ORDERED, fastDays } from "@/lib/fasts";

export function generateStaticParams() {
  return PUBLISHED_YEARS.map((y) => ({ an: String(y) }));
}

export async function generateMetadata({ params }: PageProps<"/posturi/[an]">): Promise<Metadata> {
  const { an } = await params;
  return {
    title: `Posturi ${an}: calendarul de post ortodox`,
    description: `Când încep posturile în ${an}: Postul Mare, Postul Sfinților Petru și Pavel, Postul Sfintei Marii și Postul Crăciunului, cu zilele de dezlegare și săptămânile fără post.`,
    alternates: { canonical: `/posturi/${an}` },
  };
}

const SHOWN: FastLevel[] = ["fish", "wineOil", "fast", "strict"];

export default async function PosturiYear({ params }: PageProps<"/posturi/[an]">) {
  const { an } = await params;
  const year = Number(an);
  if (!isPublishedYear(year)) notFound();
  const br = saptamanaBranzei(year);

  return (
    <>
      <Breadcrumbs items={[{ href: "/", label: "Acasă" }, { href: "/posturi", label: "Posturi" }, { label: an }]} />
      <PageHeader eyebrow="Calendar de post" title={`Posturile din ${year}`}>
        Paștele este în {formatLong(pascha(year))}, iar de data lui depind Postul Mare și Postul Sfinților Apostoli.
      </PageHeader>
      <div className="mx-auto max-w-3xl space-y-4 px-4 sm:px-6">
        {FAST_ORDERED.map((slug) => {
          const f = fastDays(slug, year);
          if (!f) return null;
          const c = countLevels(f.days);
          return (
            <Link
              key={slug}
              href={`/posturi/${year}/${slug}`}
              className="block rounded-[20px] border border-border bg-surface p-6 transition hover:border-gold"
            >
              <h2 className="font-display text-[24px] font-bold text-burgundy">{FAST_INFO[slug].title}</h2>
              <p className="mt-1 text-[16px] text-muted">
                {formatRange(f.period.start, f.period.end)} · {count(periodDays(f.period), "zi", "zile")}
              </p>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                {SHOWN.filter((l) => c[l]).map((l) => (
                  <span key={l} className="inline-flex items-center gap-2 text-[14.5px]">
                    <FastPill level={l} compact /> <span className="text-muted">× {c[l]}</span>
                  </span>
                ))}
              </div>
            </Link>
          );
        })}

        <section className="prose-troita pt-10">
          <h2>Săptămânile fără post în {year}</h2>
          <ul>
            {harti(year)
              .filter((h) => h.start.y === year)
              .sort((a, b) => a.start.m * 40 + a.start.d - (b.start.m * 40 + b.start.d))
              .map((h) => (
                <li key={`${h.start.m}-${h.start.d}`}>
                  {formatLong(h.start, false)} – {formatLong(h.end, h.end.y !== year)}: {h.note?.replace(/\.$/, "")}
                </li>
              ))}
          </ul>
          <p>
            Săptămâna Brânzei ({formatRange(br.start, br.end)}) are dezlegare la lactate
            și ouă în toate zilele, dar nu la carne.
          </p>
        </section>
      </div>
      <AppNote />
    </>
  );
}
