import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppNote, Breadcrumbs, PageHeader } from "@/components/chrome";
import { Faq } from "@/components/faq";
import { Section } from "@/components/section";
import { CALENDAR_YEARS } from "@/lib/calendar";
import { formatLong, formatWithWeekday, monthSlug, type Ymd } from "@/lib/dates";
import { feastDateIn, getName, NAME_DAYS_SOURCES, NAMES, nameSlug, type NameFeast } from "@/lib/name-days";

export function generateStaticParams() {
  return NAMES.map((n) => ({ nume: n.slug }));
}

/** "15 august", or for Florii "Duminica Floriilor" (it moves with Pascha). */
function whenText(f: NameFeast) {
  if (!f.date) return f.saint;
  const [m, d] = f.date.split("-").map(Number);
  return formatLong({ y: 2026, m, d }, false);
}

export async function generateMetadata({ params }: PageProps<"/zile-de-nume/[nume]">): Promise<Metadata> {
  const { nume } = await params;
  const e = getName(nume);
  if (!e) return {};
  const name = e.forms[0];
  const main = e.primary ?? e.feasts[0];
  return pageMeta({
    title: `Ziua numelui ${name}: când este onomastica`,
    description: `${e.forms.join(", ")} își serbează onomastica ${main.date ? `pe ${whenText(main)}, ` : ""}de ${main.saint}${e.feasts.length > 1 ? `, și în încă ${e.feasts.length - 1} ${e.feasts.length === 2 ? "zi" : "zile"}` : ""}. Datele pe ${CALENDAR_YEARS[0]}–${CALENDAR_YEARS[CALENDAR_YEARS.length - 1]}.`,
    path: `/zile-de-nume/${e.slug}`,
  });
}

const dayHref = (d: Ymd) => `/calendar-ortodox/${d.y}/${monthSlug(d.m)}#ziua-${d.d}`;

export default async function NamePage({ params }: PageProps<"/zile-de-nume/[nume]">) {
  const { nume } = await params;
  const e = getName(nume);
  if (!e) notFound();
  const name = e.forms[0];
  const main = e.primary ?? e.feasts[0];
  const others = (f: NameFeast) => [...f.m, ...f.f].filter((n) => nameSlug(n) !== e.slug);
  const thisYear = CALENDAR_YEARS[0];

  const answer =
    `${name} își serbează ziua numelui ${main.date ? `pe ${whenText(main)}, ` : ""}de ${main.saint}` +
    (main.movable ? ` (în ${thisYear}: ${formatLong(feastDateIn(main, thisYear))})` : "") +
    "." +
    (e.feasts.length > 1
      ? ` Se mai sărbătorește ${e.feasts
          .filter((f) => f !== main)
          .map((f) => (f.date ? `pe ${whenText(f)} (${f.saint})` : `de ${f.saint}`))
          .join(" și ")}.`
      : "");

  return (
    <>
      <Breadcrumbs items={[{ href: "/", label: "Acasă" }, { href: "/zile-de-nume", label: "Zile de nume" }, { label: name }]} />
      <PageHeader eyebrow="Zile de nume" title={`Ziua numelui ${e.forms.join(" / ")}`}>
        {answer}
        {e.note && <span className="mt-3 block">{e.note}</span>}
      </PageHeader>

      <Section id="ani" eyebrow="Pe ani" title="Când cade, an de an" rope={false}>
        <div className="space-y-8">
          {e.feasts.map((f) => (
            <div key={f.id}>
              <h3 className="font-display text-[20px] font-semibold leading-snug text-ink">
                {f.saint}
                {f === e.primary && e.feasts.length > 1 && <span className="rubric ml-2 align-middle text-red">ziua principală</span>}
              </h3>
              <ul className="mt-2 divide-y divide-oak border-y border-oak">
                {CALENDAR_YEARS.map((y) => {
                  const d = feastDateIn(f, y);
                  return (
                    <li key={y} className="flex flex-wrap items-baseline justify-between gap-x-6 py-2.5">
                      <span className="rubric text-umber">{y}</span>
                      <Link href={dayHref(d)} className="text-[16px] text-red underline-offset-4 hover:underline">
                        {formatWithWeekday(d)}
                        {f.date && d.m * 100 + d.d !== Number(f.date.replace("-", "")) && " (mutată după Paști)"}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              {others(f).length > 0 && (
                <p className="mt-3 text-[15px] leading-relaxed text-umber">
                  <span className="font-medium text-ink">În aceeași zi:</span>{" "}
                  {others(f).map((n, i) => (
                    <span key={n}>
                      {i > 0 && ", "}
                      <Link href={`/zile-de-nume/${nameSlug(n)}`} className="underline-offset-4 hover:text-red hover:underline">{n}</Link>
                    </span>
                  ))}
                </p>
              )}
              <p className="mt-2 text-[14px] text-umber">
                Sursa:{" "}
                {f.sourceUrl ? (
                  <a href={f.sourceUrl} className="underline underline-offset-4 hover:text-red" rel="noopener">
                    {NAME_DAYS_SOURCES[f.source]}
                  </a>
                ) : (
                  NAME_DAYS_SOURCES[f.source]
                )}
                .
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="intrebari" eyebrow="Pe scurt" title="Întrebări frecvente">
        <Faq
          items={[
            { q: `Când este ziua numelui ${name}?`, a: answer },
            {
              q: `De ce sfânt își serbează ${name} onomastica?`,
              a: `${e.feasts.map((f) => f.saint).join(", ")}.`,
            },
          ]}
        />
        <p className="mt-6 text-[16px]">
          <Link href="/zile-de-nume" className="text-red underline underline-offset-4">Toate zilele de nume</Link>
        </p>
      </Section>
      <AppNote />
    </>
  );
}
