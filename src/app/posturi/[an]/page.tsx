import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppNote, Breadcrumbs, PageHeader } from "@/components/chrome";
import { FastBadge } from "@/components/calendar-bits";
import { Section } from "@/components/section";
import { isPublishedYear, PUBLISHED_YEARS } from "@/lib/calendar";
import { count, formatLong, formatRange } from "@/lib/dates";
import { harti, pascha, periodDays, type FastLevel } from "@/lib/liturgical";
import { countLevels, FAST_INFO, FAST_ORDERED, fastDays } from "@/lib/fasts";

export function generateStaticParams() {
  return PUBLISHED_YEARS.map((y) => ({ an: String(y) }));
}

export async function generateMetadata({ params }: PageProps<"/posturi/[an]">): Promise<Metadata> {
  const { an } = await params;
  return pageMeta({
    title: `Posturi ${an}: calendarul de post ortodox`,
    description: `Când încep posturile în ${an}: Postul Mare, al Sfinților Apostoli, al Sfintei Marii și al Crăciunului, cu dezlegările și săptămânile fără post.`,
    path: `/posturi/${an}`,
  });
}

const SHOWN: FastLevel[] = ["fish", "wineOil", "fast", "strict"];

export default async function PosturiYear({ params }: PageProps<"/posturi/[an]">) {
  const { an } = await params;
  const year = Number(an);
  if (!isPublishedYear(year)) notFound();

  return (
    <>
      <Breadcrumbs items={[{ href: "/", label: "Acasă" }, { href: "/posturi", label: "Posturi" }, { label: an }]} />
      <PageHeader eyebrow="Calendar de post" title={`Posturile din ${year}`}>
        Paștele este în {formatLong(pascha(year))}, iar de data lui depind Postul Mare și Postul Sfinților Apostoli.
      </PageHeader>
      <Section id="posturile" eyebrow={`Anul ${year}`} title="Cele patru posturi mari" rope={false}>
        <ul className="space-y-2">
          {FAST_ORDERED.map((slug) => {
            const f = fastDays(slug, year);
            if (!f) return null;
            const c = countLevels(f.days);
            return (
              <li key={slug}>
                <Link
                  href={`/posturi/${year}/${slug}`}
                  className="relative block overflow-hidden rounded-sm border border-oak bg-parchment py-4 pr-4 pl-5 shadow-micro hover:border-umber"
                >
                  <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-purple" />
                  <p className="rubric text-umber">
                    {formatRange(f.period.start, f.period.end)} · {count(periodDays(f.period), "zi", "zile")}
                  </p>
                  <h2 className="mt-1 text-[22px] font-semibold leading-tight text-ink">{FAST_INFO[slug].title}</h2>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                    {SHOWN.filter((l) => c[l]).map((l) => (
                      <span key={l} className="inline-flex items-center gap-2">
                        <FastBadge level={l} compact /> <span className="rubric text-umber">× {c[l]}</span>
                      </span>
                    ))}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section id="harti" eyebrow="Fără post" title={`Săptămânile fără post în ${year}`}>
        <div className="prose-troita text-[16.5px]">
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
        </div>
      </Section>
      <AppNote />
    </>
  );
}
