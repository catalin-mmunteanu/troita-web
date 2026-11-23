import type { Metadata } from "next";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { pageMeta } from "@/lib/seo";
import { AppNote, Breadcrumbs, PageHeader } from "@/components/chrome";
import { Readings } from "@/components/lecturi";
import { Section } from "@/components/section";
import { addDays, capitalize, formatWithWeekday, iso, todayInRomania } from "@/lib/dates";
import { lecturaOn } from "@/lib/lecturi";

export const metadata: Metadata = pageMeta({
  title: "Evanghelia zilei și Apostolul de azi",
  description:
    "Evanghelia și Apostolul care se citesc azi la Sfânta Liturghie, după calendarul Bisericii Ortodoxe Române, cu textul integral din Biblia ediția Sfântului Sinod.",
  path: "/evanghelia-zilei",
});

async function Today() {
  "use cache";
  cacheLife("today");
  const today = todayInRomania();
  const lectura = lecturaOn(today);
  const next = Array.from({ length: 7 }, (_, i) => addDays(today, i + 1))
    .map((d) => ({ d, l: lecturaOn(d) }))
    .filter((x) => x.l);
  return (
    <>
      <Section id="azi" eyebrow={capitalize(formatWithWeekday(today, true))} title={lectura?.title ?? "Lecturile de azi"} rope={false}>
        {lectura ? <Readings lectura={lectura} gospelFirst /> : <p>Pentru această zi nu avem încă lecturile.</p>}
      </Section>
      <Section id="urmeaza" eyebrow="În zilele următoare" title="Evanghelia zilelor următoare">
        <ul className="divide-y divide-oak border-y border-oak">
          {next.map(({ d, l }) => (
            <li key={iso(d)}>
              <Link href={`/evanghelia-zilei/${iso(d)}`} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3.5 hover:text-red">
                <span className="font-display text-[18px] font-semibold">{capitalize(formatWithWeekday(d))}</span>
                <span className="text-[16px] text-umber">{l!.none ? "fără Liturghie" : `Ev. ${l!.evanghelieCite}`}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

export default function EvangheliaZilei() {
  return (
    <>
      <Breadcrumbs items={[{ href: "/", label: "Acasă" }, { label: "Evanghelia zilei" }]} />
      <PageHeader eyebrow="Sfânta Liturghie" title="Evanghelia zilei">
        Evanghelia și Apostolul care se citesc azi la Liturghie, după rânduiala Bisericii Ortodoxe Române. În zilele
        de rând din Postul Mare nu se săvârșește Liturghia, deci nu se citește Evanghelia.
      </PageHeader>
      <Today />
      <AppNote>
        În aplicația Troița puteți primi Evanghelia zilei în fiecare dimineață, la ora pe care o alegeți. Aplicația
        pentru Android vine în curând pe Google Play.
      </AppNote>
    </>
  );
}
