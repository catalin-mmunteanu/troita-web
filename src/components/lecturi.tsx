import Link from "next/link";
import { capitalize, formatWithWeekday, iso, type Ymd } from "@/lib/dates";
import { textOf, type Lectura } from "@/lib/lecturi";

/** One reading in full: "Evanghelia · Luca 8, 41-56", then the text with verse numbers. */
function Reading({ label, cite, pericope }: { label: string; cite: string; pericope: Lectura["evanghelie"] }) {
  const verses = textOf(pericope);
  return (
    <section className="mt-6 first:mt-0">
      <h3 className="rubric text-red">
        {label} · {cite}
      </h3>
      <p className="mt-2 max-w-[66ch] font-display text-[19px] leading-[1.7] text-ink">
        {verses.map((v, i) => (
          <span key={`${v.chapter}-${v.number}`}>
            {i > 0 && " "}
            <sup className="mr-0.5 font-sans text-[12px] text-umber">
              {verses[i - 1]?.chapter !== v.chapter && i > 0 ? `${v.chapter}:${v.number}` : v.number}
            </sup>
            {v.text}
          </span>
        ))}
      </p>
    </section>
  );
}

/** The Apostol and the Gospel of a day, or why there are none. */
export function Readings({ lectura, gospelFirst = false }: { lectura: Lectura; gospelFirst?: boolean }) {
  if (lectura.none) {
    return <p className="max-w-[62ch] text-[17px] leading-relaxed">{lectura.none}. În aceste zile nu se citește Evanghelia la Liturghie.</p>;
  }
  const ev = lectura.evanghelieCite && <Reading key="ev" label="Evanghelia" cite={lectura.evanghelieCite} pericope={lectura.evanghelie} />;
  const ap = lectura.apostolCite && <Reading key="ap" label="Apostolul" cite={lectura.apostolCite} pericope={lectura.apostol} />;
  return (
    <div>
      {gospelFirst ? [ev, ap] : [ap, ev]}
    </div>
  );
}

/** A short line for calendar cards: "Ap. Romani 2, 10-16 · Ev. Matei 4, 18-23". */
export function ReadingsLine({ date, lectura }: { date: Ymd; lectura: Lectura | null }) {
  if (!lectura || lectura.none || !lectura.evanghelieCite) return null;
  return (
    <p className="mt-2 text-[15px] leading-relaxed text-umber">
      <Link href={`/evanghelia-zilei/${iso(date)}`} className="underline-offset-4 hover:text-red hover:underline">
        {lectura.apostolCite && <>Ap. {lectura.apostolCite} · </>}Ev. {lectura.evanghelieCite}
      </Link>
    </p>
  );
}

export const dayTitle = (date: Ymd) => capitalize(formatWithWeekday(date, true));
