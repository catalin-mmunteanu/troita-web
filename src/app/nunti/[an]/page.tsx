import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppNote, Breadcrumbs, PageHeader } from "@/components/chrome";
import { ComputedYearNote } from "@/components/calendar-bits";
import { DateLinks, Faq } from "@/components/faq";
import { Section } from "@/components/section";
import { CALENDAR_YEARS, isCalendarYear, isComputedYear } from "@/lib/calendar";
import { capitalize, count, formatLong, formatRange, MONTHS } from "@/lib/dates";
import { WEDDING_BAR_LABEL } from "@/lib/liturgical";
import { barRuns, yearDays } from "@/lib/events";

export function generateStaticParams() {
  return CALENDAR_YEARS.map((y) => ({ an: String(y) }));
}

export async function generateMetadata({ params }: PageProps<"/nunti/[an]">): Promise<Metadata> {
  const { an } = await params;
  return pageMeta({
    title: `Când se fac nunți în ${an} și când nu`,
    description: `Zilele din ${an} în care nu se fac nunți (posturi, praznice, Crăciun–Bobotează, Săptămâna Luminată) și sâmbetele și duminicile libere, lună cu lună.`,
    path: `/nunti/${an}`,
  });
}

export default async function NuntiYear({ params }: PageProps<"/nunti/[an]">) {
  const { an } = await params;
  const year = Number(an);
  if (!isCalendarYear(year)) notFound();

  const days = yearDays(year);
  const runs = barRuns(days);
  const free = days.filter((x) => !x.bar);
  const sat = free.filter((x) => x.weekday === 6);
  const sun = free.filter((x) => x.weekday === 7);
  const runText = runs.map((r) => `${formatRange(r.start, r.end)} (${WEDDING_BAR_LABEL[r.bar]})`).join("; ");

  return (
    <>
      <Breadcrumbs items={[{ href: "/", label: "Acasă" }, { href: "/nunti", label: "Nunți" }, { label: an }]} />
      <PageHeader eyebrow="Cununia religioasă" title={`Nunți ${year}: când se fac și când nu`}>
        În {year} se pot face nunți în {count(free.length, "zi", "zile")}, dintre care {count(sat.length, "sâmbătă", "sâmbete")} și{" "}
        {count(sun.length, "duminică", "duminici")}. Mai jos sunt perioadele fără nunți și zilele libere, lună cu lună.
        {isComputedYear(year) && <ComputedYearNote year={year} className="mt-4" />}
      </PageHeader>

      <Section id="nu" eyebrow={`Anul ${year}`} title="Când nu se fac nunți" rope={false}>
        <ul className="divide-y divide-oak border-y border-oak">
          {runs.map((r) => (
            <li key={`${r.start.m}-${r.start.d}`} className="grid gap-1 py-3 sm:grid-cols-[15rem_1fr] sm:gap-6">
              <span className="font-display text-[17px] font-semibold text-ink">{formatRange(r.start, r.end)}</span>
              <span className="text-[16px]">{capitalize(WEDDING_BAR_LABEL[r.bar])}</span>
            </li>
          ))}
          <li className="grid gap-1 py-3 sm:grid-cols-[15rem_1fr] sm:gap-6">
            <span className="font-display text-[17px] font-semibold text-ink">Miercurea și vinerea</span>
            <span className="text-[16px]">Zile de post peste tot anul, în afară de săptămânile fără post (harți).</span>
          </li>
        </ul>
      </Section>

      <Section id="da" eyebrow="Lună cu lună" title="Sâmbete și duminici cu nunți">
        <div className="overflow-x-auto border-y border-oak">
          <table className="w-full min-w-[520px] border-collapse text-left">
            <thead>
              <tr className="rubric text-umber">
                <th className="py-3 pr-4 font-medium">Luna</th>
                <th className="px-4 py-3 font-medium">Sâmbete</th>
                <th className="px-4 py-3 font-medium">Duminici</th>
              </tr>
            </thead>
            <tbody>
              {MONTHS.map((m, i) => (
                <tr key={m} className="border-t border-oak align-top">
                  <th scope="row" className="py-3 pr-4 font-normal">
                    <Link href={`/calendar-ortodox/${year}/${m}`} className="font-display text-[17px] font-semibold hover:text-red">
                      {capitalize(m)}
                    </Link>
                  </th>
                  <td className="px-4 py-3 text-[16px]">
                    <DateLinks dates={sat.filter((x) => x.date.m === i + 1).map((x) => x.date)} />
                  </td>
                  <td className="px-4 py-3 text-[16px]">
                    <DateLinks dates={sun.filter((x) => x.date.m === i + 1).map((x) => x.date)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-umber">
          Data cununiei se stabilește cu preotul parohiei. Rânduiala poate diferi de la o eparhie la alta, mai ales
          pentru zilele din jurul unui praznic.
        </p>
      </Section>

      <Section id="intrebari" eyebrow="Pe scurt" title="Întrebări frecvente">
        <Faq
          items={[
            {
              q: `Când nu se fac nunți în ${year}?`,
              a: `În ${year} nu se fac nunți în aceste perioade: ${runText}. Nu se fac nunți nici miercurea și vinerea, în afară de săptămânile fără post.`,
            },
            {
              q: `Când se fac nunți în ${year}?`,
              a: `În ${year} se pot face nunți în ${count(free.length, "zi", "zile")}, dintre care ${count(sat.length, "sâmbătă", "sâmbete")} și ${count(sun.length, "duminică", "duminici")}. Sunt zilele din afara posturilor, a praznicelor împărătești și a ajunurilor lor, a perioadei dintre Crăciun și Bobotează și a Săptămânii Luminate, fără miercurile și vinerile de post. Prima sâmbătă cu nunți din ${year} este ${sat[0] ? formatLong(sat[0].date, false) : "–"}.`,
            },
          ]}
        />
        <p className="mt-6 text-[16px]">
          Pentru botez, vedeți <Link href={`/botez/${year}`} className="text-red underline underline-offset-4">botezul în {year}</Link>.
        </p>
      </Section>
      <AppNote>
        În aplicația Troița, fiecare zi din calendar vă spune dacă se fac nunți și de ce nu. Aplicația pentru
        Android vine în curând pe Google Play.
      </AppNote>
    </>
  );
}
