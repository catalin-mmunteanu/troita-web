import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppNote, Breadcrumbs, PageHeader } from "@/components/chrome";
import { DateLinks, Faq } from "@/components/faq";
import { Section } from "@/components/section";
import { CALENDAR_YEARS, isCalendarYear } from "@/lib/calendar";
import { addDays, capitalize, count, formatLong, formatRange, MONTHS } from "@/lib/dates";
import { greatFasts, pascha, PERIOD_LABEL } from "@/lib/liturgical";
import { isWeekend, yearDays } from "@/lib/events";

export function generateStaticParams() {
  return CALENDAR_YEARS.map((y) => ({ an: String(y) }));
}

export async function generateMetadata({ params }: PageProps<"/botez/[an]">): Promise<Metadata> {
  const { an } = await params;
  return pageMeta({
    title: `Botez ${an}: când se face și când nu`,
    description: `În ce zile se poate face botezul în ${an}, ce weekenduri cad în post (cu masă de post la petrecere) și ce să întrebați la parohie.`,
    path: `/botez/${an}`,
  });
}

export default async function BotezYear({ params }: PageProps<"/botez/[an]">) {
  const { an } = await params;
  const year = Number(an);
  if (!isCalendarYear(year)) notFound();

  const weekends = yearDays(year).filter(isWeekend);
  const free = weekends.filter((x) => x.fast === "none");
  const fasting = weekends.filter((x) => x.fast !== "none");
  const p = pascha(year);
  const fasts = greatFasts(year);
  const fastText = fasts.map((f) => `${PERIOD_LABEL[f.kind]} (${formatRange(f.start, f.end)})`).join(", ");

  return (
    <>
      <Breadcrumbs items={[{ href: "/", label: "Acasă" }, { href: "/botez", label: "Botez" }, { label: an }]} />
      <PageHeader eyebrow="Taina Botezului" title={`Botez ${year}: când se face`}>
        Botezul se poate face în orice zi a anului: Biserica nu are zile în care să nu boteze. Ce se schimbă în post
        este petrecerea, care se face cu mâncare de post.
      </PageHeader>

      <Section id="weekenduri" eyebrow={`Anul ${year}`} title="Weekendurile anului" rope={false}>
        <p className="mb-4 max-w-[62ch] text-[16px] leading-relaxed">
          În {year} sunt {count(free.length, "zi", "zile")} de sâmbătă și duminică în afara posturilor și{" "}
          {count(fasting.length, "zi", "zile")} în post.
        </p>
        <div className="overflow-x-auto border-y border-oak">
          <table className="w-full min-w-[520px] border-collapse text-left">
            <thead>
              <tr className="rubric text-umber">
                <th className="py-3 pr-4 font-medium">Luna</th>
                <th className="px-4 py-3 font-medium">Fără post</th>
                <th className="px-4 py-3 font-medium">În post (masă de post)</th>
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
                    <DateLinks dates={free.filter((x) => x.date.m === i + 1).map((x) => x.date)} />
                  </td>
                  <td className="px-4 py-3 text-[16px]">
                    <DateLinks dates={fasting.filter((x) => x.date.m === i + 1).map((x) => x.date)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="parohie" eyebrow="De vorbit cu preotul" title="Zilele de întrebat la parohie">
        <div className="prose-troita text-[16.5px]">
          <ul>
            <li>
              Săptămâna Mare ({formatRange(addDays(p, -6), addDays(p, -1))}): slujbele sunt multe, iar unele parohii
              nu programează botezuri.
            </li>
            <li>
              Săptămâna Luminată ({formatRange(p, addDays(p, 6))}): se botează, ca în vechime, dar e bine să vă
              programați din timp.
            </li>
            <li>Marile praznice: preotul are slujbă la biserică, așa că botezul se mută de obicei după.</li>
          </ul>
        </div>
      </Section>

      <Section id="intrebari" eyebrow="Pe scurt" title="Întrebări frecvente">
        <Faq
          items={[
            {
              q: `Când nu se face botez în ${year}?`,
              a: `Nu există zile în care Biserica să nu boteze. În posturi (${fastText}) botezul se face, dar petrecerea se ține cu mâncare de post. În Săptămâna Mare și la marile praznice, întrebați la parohie.`,
            },
            {
              q: `Când se face botez în ${year}?`,
              a: `În orice zi, după cum vă programează parohia. Pentru o petrecere fără post, ${year} are ${count(free.length, "zi", "zile")} de sâmbătă și duminică în afara posturilor; prima este ${free[0] ? formatLong(free[0].date, false) : "–"}.`,
            },
          ]}
        />
        <p className="mt-6 text-[16px]">
          Pentru cununie, vedeți <Link href={`/nunti/${year}`} className="text-red underline underline-offset-4">nunțile în {year}</Link>.
        </p>
      </Section>
      <AppNote />
    </>
  );
}
