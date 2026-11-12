import type { Metadata } from "next";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { AdSlot } from "@/components/ads";
import { AppNote, Breadcrumbs, PageHeader } from "@/components/chrome";
import { FastBadge } from "@/components/calendar-bits";
import { Section } from "@/components/section";
import { PUBLISHED_YEARS } from "@/lib/calendar";
import { count, daysBetween, formatRange, todayInRomania } from "@/lib/dates";
import { periodDays, type FastLevel } from "@/lib/liturgical";
import { currentOrNextFast, FAST_INFO, FAST_ORDERED } from "@/lib/fasts";

export const metadata: Metadata = {
  title: "Posturile ortodoxe: când începe postul, dezlegări și reguli",
  description:
    "Cele patru posturi mari din calendarul ortodox, cu datele pentru 2026 și 2027, zilele cu dezlegare la pește, la untdelemn și vin, ajunările și săptămânile fără post (harți).",
  alternates: { canonical: "/posturi" },
};

const LEVELS: { level: FastLevel; text: string }[] = [
  { level: "fast", text: "Mâncare de post, fără untdelemn și vin." },
  { level: "fish", text: "Se dezleagă la pește, untdelemn și vin. Fără carne, lactate și ouă." },
  { level: "wineOil", text: "Se dezleagă la untdelemn și vin. Fără pește." },
  { level: "strict", text: "Ajunare: post negru sau, după putere, numai seara pâine și apă." },
];

async function CurrentFast() {
  "use cache";
  cacheLife("today");
  const today = todayInRomania();
  const f = currentOrNextFast(today);
  if (!f) return null;
  const info = FAST_INFO[f.slug];
  const active = daysBetween(f.period.start, today) >= 0;
  const total = periodDays(f.period);
  const dayN = daysBetween(f.period.start, today) + 1;
  const until = daysBetween(today, f.period.start);
  return (
    <Link
      href={`/posturi/${f.year}/${f.slug}`}
      className="relative block overflow-hidden rounded-sm border border-oak bg-parchment py-5 pr-5 pl-6 shadow-micro hover:border-umber sm:py-6 sm:pr-6 sm:pl-7"
    >
      <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-purple" />
      <p className="rubric text-red">
        {active ? `Ziua ${dayN} din ${total}` : until === 1 ? "Începe mâine" : `Începe în ${count(until, "zi", "zile")}`}
      </p>
      <h2 className="mt-1 text-[26px] font-semibold leading-tight text-ink">{info.title}</h2>
      <p className="rubric mt-2 text-umber">
        {formatRange(f.period.start, f.period.end, true)} · {count(total, "zi", "zile")}
      </p>
      {active && (
        <div className="mt-4 h-[3px] bg-oak" aria-hidden>
          <div className="h-full bg-purple" style={{ width: `${Math.round((dayN / total) * 100)}%` }} />
        </div>
      )}
    </Link>
  );
}

export default function PosturiPage() {
  return (
    <>
      <Breadcrumbs items={[{ href: "/", label: "Acasă" }, { label: "Posturi" }]} />
      <PageHeader eyebrow="Ghid de post" title="Posturile de peste an">
        Biserica Ortodoxă are patru posturi mari, la care se adaugă miercurea și vinerea și câteva zile de
        ajunare. Aici le găsiți pe toate, cu dezlegările lor.
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <div className="max-w-3xl">
          <CurrentFast />
        </div>
      </div>

      <Section id="mari" eyebrow="Pe ani" title="Cele patru posturi mari">
        <div className="overflow-x-auto border-y border-oak">
          <table className="w-full min-w-[520px] border-collapse text-left">
            <thead>
              <tr className="rubric text-umber">
                <th className="py-3 pr-4 font-medium">Postul</th>
                {PUBLISHED_YEARS.map((y) => (
                  <th key={y} className="px-4 py-3 font-medium">
                    <Link href={`/posturi/${y}`} className="hover:text-red">{y}</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FAST_ORDERED.map((slug) => (
                <tr key={slug} className="border-t border-oak align-top">
                  <th scope="row" className="py-3.5 pr-4 font-normal">
                    <span className="block font-display text-[17px] font-semibold">{FAST_INFO[slug].title}</span>
                    <span className="block text-[14px] text-umber">{FAST_INFO[slug].alsoKnown}</span>
                  </th>
                  {PUBLISHED_YEARS.map((y) => {
                    const p = FAST_INFO[slug].get(y);
                    return (
                      <td key={y} className="px-4 py-3.5 text-[15.5px]">
                        {p ? (
                          <Link href={`/posturi/${y}/${slug}`} className="text-red underline-offset-4 hover:underline">
                            {formatRange(p.start, p.end)}
                            <span className="rubric block text-umber">{count(periodDays(p), "zi", "zile")}</span>
                          </Link>
                        ) : (
                          <span className="text-umber">nu are loc</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AdSlot />
      </Section>

      <Section id="dezlegari" eyebrow="Rânduiala mesei" title="Ce înseamnă fiecare dezlegare">
        <dl className="divide-y divide-oak border-y border-oak">
          {LEVELS.map(({ level, text }) => (
            <div key={level} className="grid gap-2 py-3.5 sm:grid-cols-[15rem_1fr] sm:items-center sm:gap-6">
              <dt><FastBadge level={level} /></dt>
              <dd className="text-[16px] leading-relaxed">{text}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="reguli" eyebrow="Peste an" title="Miercurea, vinerea și săptămânile fără post">
        <div className="prose-troita text-[16.5px]">
          <p>
            În afara posturilor mari se postește miercurea și vinerea. Când în aceste zile cade un praznic
            împărătesc se dezleagă la pește, iar la un sfânt cu cruce roșie, la untdelemn și vin. Între Duminica
            Tomii și Rusalii, miercurea și vinerea au dezlegare la pește.
          </p>
          <p>Nu se postește deloc în cele patru săptămâni numite <em>harți</em>:</p>
          <ul>
            <li>de la Nașterea Domnului până la Bobotează (25 decembrie – 4 ianuarie);</li>
            <li>săptămâna de după Duminica Vameșului și a Fariseului;</li>
            <li>Săptămâna Luminată, de după Paști;</li>
            <li>săptămâna de după Rusalii.</li>
          </ul>
          <p>
            Zile de ajunare în afara posturilor: Ajunul Bobotezei (5 ianuarie). La Tăierea Capului Sfântului Ioan
            Botezătorul (29 august) și la Înălțarea Sfintei Cruci (14 septembrie) se ține post, cu dezlegare la
            untdelemn și vin.
          </p>
          <p className="text-umber">
            Rânduiala poate diferi de la o mănăstire la alta și de la o parohie la alta. Pentru postul vostru,
            sfatul preotului duhovnic este cel care contează.
          </p>
        </div>
      </Section>

      <AppNote>
        Un anunț cu o zi înainte de fiecare post: aplicația Troița vă spune când începe postul și care zile au
        dezlegare. Vine în curând pe Google Play.
      </AppNote>
    </>
  );
}
