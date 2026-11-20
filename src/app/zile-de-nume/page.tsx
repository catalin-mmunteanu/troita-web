import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { AppNote, Breadcrumbs, PageHeader } from "@/components/chrome";
import { Section } from "@/components/section";
import { CALENDAR_YEARS } from "@/lib/calendar";
import { capitalize, compare, daysBetween, formatLong, formatWithWeekday, fromIso, MONTHS, todayInRomania } from "@/lib/dates";
import { NAMES, nameFeastsIn, nameSlug, type NameFeast } from "@/lib/name-days";

export const metadata: Metadata = pageMeta({
  title: "Zile de nume: calendarul onomasticelor",
  description:
    "Ce nume se sărbătoresc la fiecare sfânt din calendarul ortodox: Ion, Maria, Gheorghe, Elena, Andrei, Nicolae și încă peste 300 de prenume, cu toate zilele lor.",
  path: "/zile-de-nume",
});

function Names({ feast }: { feast: NameFeast }) {
  const all = [...feast.m, ...feast.f];
  return (
    <>
      {all.map((n, i) => (
        <span key={n}>
          {i > 0 && ", "}
          <Link href={`/zile-de-nume/${nameSlug(n)}`} className="underline-offset-4 hover:text-red hover:underline">
            {n}
          </Link>
        </span>
      ))}
    </>
  );
}

async function Upcoming() {
  "use cache";
  cacheLife("today");
  const today = todayInRomania();
  const next = [today.y, today.y + 1]
    .filter((y) => CALENDAR_YEARS.includes(y))
    .flatMap((y) => nameFeastsIn(y))
    .filter((x) => compare(x.date, today) >= 0)
    .slice(0, 4);
  if (next.length === 0) return null;
  return (
    <ul className="space-y-2">
      {next.map(({ feast, date }) => {
        const inDays = daysBetween(today, date);
        return (
          <li key={`${feast.id}-${date.y}`} className="relative overflow-hidden rounded-sm border border-oak bg-parchment py-4 pr-4 pl-5 shadow-micro">
            <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-red" />
            <p className="rubric text-umber">
              {inDays === 0 ? "Astăzi" : inDays === 1 ? "Mâine" : capitalize(formatWithWeekday(date))}
              {inDays <= 1 && <> · {formatLong(date, false)}</>}
            </p>
            <h3 className="mt-1 text-[20px] font-semibold leading-snug text-ink">{feast.saint}</h3>
            <p className="mt-1.5 text-[16px] leading-relaxed"><Names feast={feast} /></p>
          </li>
        );
      })}
    </ul>
  );
}

export default function ZileDeNumePage() {
  // Fixed feasts in calendar order; Florii and Duminica Tomii depend on Pascha,
  // so their date is shown per year on their name's page.
  const year = CALENDAR_YEARS[0];
  // The plain date, not the year's: Sf. Gheorghe can move out of Holy Week.
  const feasts = nameFeastsIn(year).map((x) => (x.feast.date ? { ...x, date: fromIso(`${year}-${x.feast.date}`) } : x));
  const byMonth = MONTHS.map((_, i) => feasts.filter((x) => !x.feast.movable && x.date.m === i + 1));
  const movable = feasts.filter((x) => x.feast.movable);
  const letters = [...new Set(NAMES.map((n) => n.forms[0][0].toUpperCase()))];

  return (
    <>
      <Breadcrumbs items={[{ href: "/", label: "Acasă" }, { label: "Zile de nume" }]} />
      <PageHeader eyebrow="Onomastice" title="Zile de nume">
        Ce prenume se sărbătoresc la fiecare sfânt. Unele nume au mai multe zile (Maria, Ioan, Ana): le găsiți pe
        toate pe pagina numelui, cu ziua pe care o țin cei mai mulți.
      </PageHeader>

      <Section id="urmeaza" eyebrow="În curând" title="Următoarele zile de nume" rope={false}>
        <Upcoming />
      </Section>

      <Section id="pe-luni" eyebrow="Peste an" title="Zilele de nume, lună cu lună">
        <div className="space-y-8">
          {byMonth.map((list, i) =>
            list.length === 0 ? null : (
              <div key={MONTHS[i]}>
                <h3 className="rubric text-red">{capitalize(MONTHS[i])}</h3>
                <dl className="mt-2 divide-y divide-oak border-y border-oak">
                  {list.map(({ feast, date }) => (
                    <div key={feast.id} className="grid gap-1 py-3 sm:grid-cols-[13rem_1fr] sm:gap-6">
                      <dt>
                        <span className="block font-display text-[17px] font-semibold text-ink">{formatLong(date, false)}</span>
                        <span className="block text-[14px] text-umber">{feast.saint}</span>
                      </dt>
                      <dd className="text-[16px] leading-relaxed"><Names feast={feast} /></dd>
                    </div>
                  ))}
                </dl>
              </div>
            ),
          )}
          <div>
            <h3 className="rubric text-red">Cu dată schimbătoare, după Paști</h3>
            <dl className="mt-2 divide-y divide-oak border-y border-oak">
              {movable.map(({ feast }) => (
                <div key={feast.id} className="grid gap-1 py-3 sm:grid-cols-[13rem_1fr] sm:gap-6">
                  <dt className="font-display text-[17px] font-semibold text-ink">{feast.saint}</dt>
                  <dd className="text-[16px] leading-relaxed"><Names feast={feast} /></dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <Section id="a-z" eyebrow="De la A la Z" title="Toate numele">
        <div className="space-y-5">
          {letters.map((l) => (
            <div key={l}>
              <h3 className="font-display text-[22px] font-bold text-red">{l}</h3>
              <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1.5 text-[16px]">
                {NAMES.filter((n) => n.forms[0][0].toUpperCase() === l).map((n) => (
                  <li key={n.slug}>
                    <Link href={`/zile-de-nume/${n.slug}`} className="underline-offset-4 hover:text-red hover:underline">
                      {n.forms.join(" / ")}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-[62ch] text-[15px] leading-relaxed text-umber">
          Sursa listelor: Direcția Generală pentru Evidența Persoanelor (Ministerul Afacerilor Interne), care
          publică la fiecare sărbătoare mare prenumele care o țin, și calendarul ortodox, pentru sfinții al căror
          nume este chiar prenumele sărbătorit.
        </p>
      </Section>
      <AppNote>
        În aplicația Troița, fiecare zi din calendar arată și numele sărbătorite, iar căutarea găsește ziua oricărui
        nume. Aplicația pentru Android vine în curând pe Google Play.
      </AppNote>
    </>
  );
}
