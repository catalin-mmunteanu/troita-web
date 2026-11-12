import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { AppNote, Breadcrumbs, PageHeader } from "@/components/chrome";
import { Section } from "@/components/section";
import { PUBLISHED_YEARS } from "@/lib/calendar";
import { capitalize, formatLong, MONTHS } from "@/lib/dates";
import { pascha } from "@/lib/liturgical";

export const metadata: Metadata = pageMeta({
  title: "Calendar ortodox 2026 și 2027",
  description:
    "Calendarul ortodox românesc pe 2026 și 2027, lună cu lună: sfinții zilei, sărbătorile cu cruce roșie, posturile și zilele cu dezlegare.",
  path: "/calendar-ortodox",
});

export default function CalendarIndex() {
  return (
    <>
      <Breadcrumbs items={[{ href: "/", label: "Acasă" }, { label: "Calendar ortodox" }]} />
      <PageHeader eyebrow="Calendar creștin ortodox" title="Calendar ortodox">
        Fiecare zi a anului, cu sfinții pomeniți, rangul sărbătorii și dezlegarea la post. Alegeți anul și luna.
      </PageHeader>
      {PUBLISHED_YEARS.map((y, i) => (
        <Section key={y} id={`an-${y}`} eyebrow={`Paștele: ${formatLong(pascha(y))}`} title={`Calendar ortodox ${y}`} rope={i > 0}>
          <ul className="grid grid-cols-2 border-t border-l border-oak sm:grid-cols-3 md:grid-cols-4">
            {MONTHS.map((m) => (
              <li key={m}>
                <Link
                  href={`/calendar-ortodox/${y}/${m}`}
                  className="block border-r border-b border-oak px-4 py-3.5 font-display text-[18px] font-semibold text-ink hover:bg-surface hover:text-red"
                >
                  {capitalize(m)}
                </Link>
              </li>
            ))}
          </ul>
          <Link href={`/calendar-ortodox/${y}`} className="mt-4 inline-block font-ui text-[17px] font-medium text-red hover:underline">
            Sărbătorile și posturile din {y} →
          </Link>
        </Section>
      ))}
      <AppNote />
    </>
  );
}
