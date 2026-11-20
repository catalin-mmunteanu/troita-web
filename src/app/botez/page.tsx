import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { AppNote, Breadcrumbs, PageHeader } from "@/components/chrome";
import { Faq } from "@/components/faq";
import { Section } from "@/components/section";
import { CALENDAR_YEARS } from "@/lib/calendar";
import { count } from "@/lib/dates";
import { isWeekend, yearDays } from "@/lib/events";

export const metadata: Metadata = pageMeta({
  title: "Când se face botezul și când nu",
  description: `Botezul ortodox se poate face în orice zi. Ce se schimbă în post, ce zile să discutați cu parohia și weekendurile fără post pe ${CALENDAR_YEARS[0]}–${CALENDAR_YEARS[CALENDAR_YEARS.length - 1]}.`,
  path: "/botez",
});

export default function BotezPage() {
  const stats = CALENDAR_YEARS.map((y) => ({
    y,
    free: yearDays(y).filter((x) => isWeekend(x) && x.fast === "none").length,
  }));
  return (
    <>
      <Breadcrumbs items={[{ href: "/", label: "Acasă" }, { label: "Botez" }]} />
      <PageHeader eyebrow="Taina Botezului" title="Când se face botezul și când nu">
        Spre deosebire de nuntă, botezul nu are zile oprite: Biserica botează în orice zi, chiar și în post și în
        Săptămâna Luminată. Ce contează în post este masa de după.
      </PageHeader>

      <Section id="ani" eyebrow="Pe ani" title="Alegeți anul" rope={false}>
        <ul className="divide-y divide-oak border-y border-oak">
          {stats.map(({ y, free }) => (
            <li key={y}>
              <Link href={`/botez/${y}`} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3.5 hover:text-red">
                <span className="font-display text-[20px] font-semibold">Botez {y}</span>
                <span className="rubric text-umber">{count(free, "zi", "zile")} de weekend fără post</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="randuiala" eyebrow="Rânduiala" title="Ce trebuie știut">
        <div className="prose-troita text-[16.5px]">
          <p>
            Botezul este prima Taină și nu se amână din cauza calendarului. Copilul se poate boteza în orice zi în
            care parohia vă poate primi.
          </p>
          <p>
            În cele patru posturi și miercurea și vinerea, petrecerea se face cu mâncare de post. Multe familii
            aleg de aceea un weekend din afara posturilor.
          </p>
          <p>
            În Săptămâna Mare și la marile praznice preotul are multe slujbe: programarea se discută din timp cu
            parohia.
          </p>
        </div>
      </Section>

      <Section id="intrebari" eyebrow="Pe scurt" title="Întrebări frecvente">
        <Faq
          items={[
            {
              q: "Când nu se face botez?",
              a: "Nu există zile în care Biserica Ortodoxă să nu boteze. În post botezul se face, dar petrecerea se ține cu mâncare de post. În Săptămâna Mare și la marile praznice, întrebați la parohie.",
            },
            {
              q: "Când se face botez?",
              a: "În orice zi a anului, după programarea parohiei. Pentru o petrecere fără post, alegeți un weekend din afara celor patru posturi.",
            },
            {
              q: "Se face botez în post?",
              a: "Da. Botezul se face și în post; doar masa de după se face cu mâncare de post.",
            },
          ]}
        />
        <p className="mt-6 text-[16px]">
          Pentru cununie, vedeți <Link href="/nunti" className="text-red underline underline-offset-4">când se fac nunți</Link>.
        </p>
      </Section>
      <AppNote />
    </>
  );
}
