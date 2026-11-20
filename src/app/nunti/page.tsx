import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { AppNote, Breadcrumbs, PageHeader } from "@/components/chrome";
import { Faq } from "@/components/faq";
import { Section } from "@/components/section";
import { CALENDAR_YEARS } from "@/lib/calendar";
import { count } from "@/lib/dates";
import { yearDays } from "@/lib/events";

export const metadata: Metadata = pageMeta({
  title: "Când se fac nunți și când nu se fac",
  description: `Perioadele din an în care Biserica Ortodoxă nu oficiază cununii și zilele în care se pot face nunți, pe ${CALENDAR_YEARS[0]}–${CALENDAR_YEARS[CALENDAR_YEARS.length - 1]}.`,
  path: "/nunti",
});

const RULES: { when: string; why: string }[] = [
  { when: "Cele patru posturi", why: "Postul Mare, Postul Sfinților Apostoli, Postul Adormirii și Postul Crăciunului." },
  { when: "Săptămâna Brânzei", why: "Săptămâna dinaintea Postului Mare, care pregătește postul." },
  { when: "25 decembrie – 6 ianuarie", why: "De la Nașterea Domnului până la Bobotează." },
  { when: "Săptămâna Luminată", why: "Săptămâna de după Paști, ținută toată ca o singură zi de sărbătoare." },
  {
    when: "Praznicele împărătești și ajunurile lor",
    why: "Întâmpinarea Domnului, Buna Vestire, Înălțarea, Rusaliile, Adormirea, Nașterea Maicii Domnului, Înălțarea Sfintei Cruci, Intrarea în Biserică, precum și Tăierea capului Sf. Ioan Botezătorul.",
  },
  { when: "Miercurea și vinerea", why: "Zile de post peste tot anul, în afară de săptămânile fără post (harți)." },
];

export default function NuntiPage() {
  const stats = CALENDAR_YEARS.map((y) => {
    const free = yearDays(y).filter((x) => !x.bar);
    return { y, free: free.length, sat: free.filter((x) => x.weekday === 6).length };
  });
  return (
    <>
      <Breadcrumbs items={[{ href: "/", label: "Acasă" }, { label: "Nunți" }]} />
      <PageHeader eyebrow="Cununia religioasă" title="Când se fac nunți și când nu se fac">
        Biserica nu oficiază cununii în zilele de post și de mare sărbătoare. Aici sunt regulile și, pentru fiecare
        an, zilele în care se pot face nunți.
      </PageHeader>

      <Section id="ani" eyebrow="Pe ani" title="Alegeți anul" rope={false}>
        <ul className="divide-y divide-oak border-y border-oak">
          {stats.map(({ y, free, sat }) => (
            <li key={y}>
              <Link href={`/nunti/${y}`} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3.5 hover:text-red">
                <span className="font-display text-[20px] font-semibold">Nunți {y}</span>
                <span className="rubric text-umber">
                  {count(free, "zi", "zile")} cu nunți · {count(sat, "sâmbătă", "sâmbete")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="reguli" eyebrow="Rânduiala" title="Când nu se fac nunți">
        <dl className="divide-y divide-oak border-y border-oak">
          {RULES.map((r) => (
            <div key={r.when} className="grid gap-1 py-3.5 sm:grid-cols-[15rem_1fr] sm:gap-6">
              <dt className="font-display text-[17px] font-semibold text-ink">{r.when}</dt>
              <dd className="text-[16px] leading-relaxed">{r.why}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-umber">
          Am verificat aceste reguli pe calendarul publicat pentru 2027, zi cu zi. Data cununiei se stabilește
          întotdeauna cu preotul parohiei.
        </p>
      </Section>

      <Section id="intrebari" eyebrow="Pe scurt" title="Întrebări frecvente">
        <Faq
          items={[
            {
              q: "Când nu se fac nunți?",
              a: "Nu se fac nunți în cele patru posturi, în Săptămâna Brânzei, între Crăciun și Bobotează (25 decembrie – 6 ianuarie), în Săptămâna Luminată, la praznicele împărătești și în ajunul lor, și miercurea și vinerea, în afară de săptămânile fără post.",
            },
            {
              q: "Când se fac nunți?",
              a: "Se pot face nunți în toate celelalte zile ale anului. Perioadele lungi cu nunți sunt: de la Bobotează până la Săptămâna Brânzei, de la Duminica Tomii până la Rusalii (fără Înălțare), de la Sfinții Petru și Pavel (29 iunie) până la 31 iulie și de la 16 august până la 14 noiembrie.",
            },
            {
              q: "Se fac nunți duminica?",
              a: "Da, duminica se pot face nunți, cu excepția perioadelor de mai sus.",
            },
          ]}
        />
        <p className="mt-6 text-[16px]">
          Pentru botez, vedeți <Link href="/botez" className="text-red underline underline-offset-4">când se face botezul</Link>.
        </p>
      </Section>
      <AppNote />
    </>
  );
}
