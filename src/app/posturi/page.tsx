import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ads";
import { cacheLife } from "next/cache";
import { AppNote, Breadcrumbs, PageHeader } from "@/components/chrome";
import { FastPill } from "@/components/calendar-bits";
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
  { level: "fish", text: "Se dezleagă la pește, untdelemn și vin. Fără carne, lactate și ouă." },
  { level: "wineOil", text: "Se dezleagă la untdelemn și vin. Fără pește." },
  { level: "dairy", text: "Doar în Săptămâna Brânzei: lactate și ouă, fără carne." },
  { level: "fast", text: "Mâncare de post, fără untdelemn și vin." },
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
      className="block rounded-[20px] border border-gold bg-accent-surface p-6 transition hover:shadow-md sm:p-8"
    >
      <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-gold">
        {active ? "În desfășurare" : until === 1 ? "Începe mâine" : `Începe în ${count(until, "zi", "zile")}`}
      </p>
      <h2 className="font-display mt-1 text-[28px] font-bold text-burgundy">{info.title}</h2>
      <p className="mt-1 text-[16px] text-muted">
        {formatRange(f.period.start, f.period.end, true)} · {count(total, "zi", "zile")}
      </p>
      {active && (
        <>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-border">
            <div className="h-full rounded-full bg-burgundy" style={{ width: `${Math.round((dayN / total) * 100)}%` }} />
          </div>
          <p className="mt-2 text-[15px] font-medium">Ziua {dayN} din {total}</p>
        </>
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
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <CurrentFast />

        <section aria-labelledby="mari" className="mt-14">
          <h2 id="mari" className="font-display text-[28px] font-bold text-burgundy">Cele patru posturi mari</h2>
          <div className="mt-5 overflow-x-auto rounded-[16px] border border-border">
            <table className="w-full min-w-[520px] border-collapse text-left text-[15px]">
              <thead className="bg-surface text-[13px] uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3 font-bold">Postul</th>
                  {PUBLISHED_YEARS.map((y) => (
                    <th key={y} className="px-4 py-3 font-bold">{y}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FAST_ORDERED.map((slug) => (
                  <tr key={slug} className="border-t border-border align-top">
                    <th scope="row" className="px-4 py-3.5 font-display text-[16.5px] font-semibold">
                      {FAST_INFO[slug].title}
                      <span className="block font-sans text-[13px] font-normal text-muted">{FAST_INFO[slug].alsoKnown}</span>
                    </th>
                    {PUBLISHED_YEARS.map((y) => {
                      const p = FAST_INFO[slug].get(y);
                      return (
                        <td key={y} className="px-4 py-3.5">
                          {p ? (
                            <Link href={`/posturi/${y}/${slug}`} className="text-burgundy underline-offset-4 hover:underline">
                              {formatRange(p.start, p.end)}
                              <span className="block text-[13px] text-muted">{count(periodDays(p), "zi", "zile")}</span>
                            </Link>
                          ) : (
                            <span className="text-muted">nu are loc</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[15px] text-muted">
            Tot calendarul de post pe un an:{" "}
            {PUBLISHED_YEARS.map((y, i) => (
              <span key={y}>
                {i > 0 && " · "}
                <Link href={`/posturi/${y}`} className="font-semibold text-burgundy hover:underline">Posturi {y}</Link>
              </span>
            ))}
          </p>
        </section>

<AdSlot />
        <section aria-labelledby="dezlegari" className="mt-14">
          <h2 id="dezlegari" className="font-display text-[28px] font-bold text-burgundy">Ce înseamnă fiecare dezlegare</h2>
          <ul className="mt-5 space-y-3">
            {LEVELS.map(({ level, text }) => (
              <li key={level} className="flex flex-col gap-2 rounded-[14px] border border-border bg-surface p-4 sm:flex-row sm:items-center sm:gap-4">
                <div className="sm:w-60 sm:shrink-0"><FastPill level={level} /></div>
                <p className="text-[15.5px] leading-relaxed">{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="reguli" className="prose-troita mt-14">
          <h2 id="reguli">Miercurea, vinerea și săptămânile fără post</h2>
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
          <p className="text-[15px] text-muted">
            Rânduiala poate diferi de la o mănăstire la alta și de la o parohie la alta. Pentru postul vostru,
            sfatul preotului duhovnic este cel care contează.
          </p>
        </section>
      </div>
      <AppNote>
        <strong className="font-semibold">Un anunț cu o zi înainte de fiecare post.</strong> Aplicația Troița vă
        spune când începe postul și care zile au dezlegare.
      </AppNote>
    </>
  );
}
