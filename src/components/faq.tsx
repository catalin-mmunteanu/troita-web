import Link from "next/link";
import { MONTHS } from "@/lib/dates";

/**
 * Questions and answers shown on the page and given to search engines as
 * FAQPage structured data. The /nunti and /botez pages answer both ways a
 * question is asked ("când se fac nunți" and "când nu se fac nunți"), so both
 * are here, with the same facts.
 */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <dl className="divide-y divide-oak border-y border-oak">
        {items.map(({ q, a }) => (
          <div key={q} className="py-4">
            <dt className="font-display text-[19px] font-semibold leading-snug text-ink">{q}</dt>
            <dd className="mt-1.5 max-w-[62ch] text-[16px] leading-relaxed">{a}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}

/** A small list of dates as links to their day in the month calendar. */
export function DateLinks({ dates, empty = "niciuna" }: { dates: { y: number; m: number; d: number }[]; empty?: string }) {
  if (dates.length === 0) return <span className="text-umber">{empty}</span>;
  return (
    <>
      {dates.map((x, i) => (
        <span key={`${x.m}-${x.d}`}>
          {i > 0 && ", "}
          <Link
            href={`/calendar-ortodox/${x.y}/${MONTHS[x.m - 1]}#ziua-${x.d}`}
            className="text-red underline-offset-4 hover:underline"
          >
            {x.d}
          </Link>
        </span>
      ))}
    </>
  );
}

