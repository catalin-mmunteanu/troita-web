import type { Metadata } from "next";
import Link from "next/link";
import { AppNote, Breadcrumbs, PageHeader } from "@/components/chrome";
import { PUBLISHED_YEARS } from "@/lib/calendar";
import { capitalize, formatLong, MONTHS } from "@/lib/dates";
import { pascha } from "@/lib/liturgical";

export const metadata: Metadata = {
  title: "Calendar ortodox 2026 și 2027",
  description:
    "Calendarul ortodox românesc pe 2026 și 2027, lună cu lună: sfinții zilei, sărbătorile cu cruce roșie, posturile și zilele cu dezlegare.",
  alternates: { canonical: "/calendar-ortodox" },
};

export default function CalendarIndex() {
  return (
    <>
      <Breadcrumbs items={[{ href: "/", label: "Acasă" }, { label: "Calendar ortodox" }]} />
      <PageHeader eyebrow="Calendar creștin ortodox" title="Calendar ortodox">
        Fiecare zi a anului, cu sfinții pomeniți, rangul sărbătorii și dezlegarea la post. Alegeți anul și luna.
      </PageHeader>
      <div className="mx-auto max-w-4xl space-y-14 px-4 sm:px-6">
        {PUBLISHED_YEARS.map((y) => (
          <section key={y} aria-labelledby={`an-${y}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id={`an-${y}`} className="font-display text-[30px] font-bold text-burgundy">
                <Link href={`/calendar-ortodox/${y}`} className="hover:underline">Calendar ortodox {y}</Link>
              </h2>
              <p className="text-[15px] text-muted">Paștele: {formatLong(pascha(y))}</p>
            </div>
            <ul className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
              {MONTHS.map((m) => (
                <li key={m}>
                  <Link
                    href={`/calendar-ortodox/${y}/${m}`}
                    className="block rounded-[14px] border border-border bg-surface px-4 py-3.5 font-display text-[18px] font-semibold text-ink transition hover:border-gold hover:bg-accent-surface hover:text-burgundy"
                  >
                    {capitalize(m)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <AppNote />
    </>
  );
}
