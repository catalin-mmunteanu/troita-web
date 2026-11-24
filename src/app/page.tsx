import Link from "next/link";
import { cacheLife } from "next/cache";
import { AppNote, ButtonLink, StoreStatus } from "@/components/chrome";
import { DayCard, DayLeaf, FastBadge } from "@/components/calendar-bits";
import { ArrowIcon, OrthodoxCross } from "@/components/icons";
import { AppScreen } from "@/components/phone";
import { Section } from "@/components/section";
import { getDay, getRange } from "@/lib/calendar";
import { addDays, capitalize, formatWithWeekday, todayInRomania, type Ymd } from "@/lib/dates";
import type { FastLevel } from "@/lib/liturgical";

export default async function Home() {
  "use cache";
  cacheLife("today");
  const today = todayInRomania();

  return (
    <>
      <Hero today={today} />
      <Week today={today} />
      <Tabs today={today} />
      <Colours />
      <Privacy />
      <Faq />
      <AppNote>
        Troița vine în curând pe Google Play, pentru Android. Până atunci, găsiți aici{" "}
        <Link href="/azi" className="text-red underline underline-offset-4">sfântul zilei</Link>, calendarul și{" "}
        <Link href="/posturi" className="text-red underline underline-offset-4">posturile anului</Link>.
      </AppNote>
    </>
  );
}

function Hero({ today }: { today: Ymd }) {
  const day = getDay(today);
  return (
    <section className="mx-auto max-w-6xl px-4 pt-10 pb-14 sm:px-6 md:pt-16 md:pb-20">
      <div className="grid items-start gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-14">
        <div className="md:pt-4">
          <p className="rubric text-red">Calendar ortodox românesc</p>
          <h1 className="mt-3 text-[38px] font-bold leading-[1.15] text-ink sm:text-[40px]">
            Calendarul ortodox, zi de zi
          </h1>
          <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-umber">
            Sfântul zilei, posturile, Evanghelia și mai multe.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href="/azi">
              Sfântul zilei <ArrowIcon width={16} height={16} />
            </ButtonLink>
            <ButtonLink href={`/calendar-ortodox/${today.y}`} variant="secondary">
              Calendar {today.y}
            </ButtonLink>
          </div>
          <div className="mt-8">
            <StoreStatus />
          </div>
        </div>
        <DayLeaf
          day={day}
          heading={
            <p className="text-[32px] font-bold leading-[1.15] text-ink sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
              {capitalize(formatWithWeekday(today))}
            </p>
          }
        />
      </div>
    </section>
  );
}

function Week({ today }: { today: Ymd }) {
  const days = getRange(addDays(today, 1), addDays(today, 6));
  return (
    <Section id="saptamana" eyebrow="Zilele care urmează" title="Săptămâna aceasta">
      <ol className="space-y-2">
        {days.map((d) => (
          <DayCard key={d.date} day={d} showMonth />
        ))}
      </ol>
      <Link href="/azi" className="mt-4 inline-flex items-center gap-1.5 font-ui text-[17px] font-medium text-red hover:underline">
        Toată ziua de azi <ArrowIcon width={15} height={15} />
      </Link>
    </Section>
  );
}

const TABS = [
  {
    screen: "calendar" as const,
    alt: "Calendarul lunii în aplicația Troița, cu sfinții și dezlegările fiecărei zile",
    text: "Fiecare zi a anului, cu toți sfinții pomeniți, crucea zilei și dezlegarea, scrise în întregime. Căutați un sfânt după nume și trimiteți ziua cuiva drag.",
  },
  {
    screen: "posturi" as const,
    alt: "Ghidul de post din aplicația Troița, cu posturile care urmează",
    text: "Cele patru posturi mari, cu ziua în care vă aflați și toate dezlegările. Dacă doriți, notați zilele în care ați ținut postul.",
  },
  {
    screen: "lecturi" as const,
    alt: "Fila Lecturi din aplicația Troița, cu Evanghelia zilei",
    text: "Sinaxarul și Evanghelia fiecărei zile, din Biblia Sinodală, cu litera cât de mare vă trebuie.",
  },
  {
    screen: "profil" as const,
    alt: "Setările de notificări din aplicația Troița",
    text: "Harta celor peste 13.000 de biserici, mănăstiri și troițe din țară. Un anunț pe zi, la ora aleasă de voi, și, dacă doriți, Evanghelia dimineața.",
  },
];

function Tabs({ today }: { today: Ymd }) {
  return (
    <Section id="aplicatia" eyebrow="Aplicația" title="Patru file, ca într-un calendar de perete">
      <ul className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
        {TABS.map((t) => (
          <li key={t.screen}>
            <AppScreen screen={t.screen} today={today} alt={t.alt} />
            <p className="mt-2 text-[15px] leading-relaxed text-ink">{t.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

const LITURGICAL = [
  { c: "var(--gold)", t: "Aur", d: "Praznicele împărătești și duminicile." },
  { c: "var(--red)", t: "Roșu", d: "Sfânta Cruce, Paștile și sfinții mucenici cu cruce în calendar." },
  { c: "var(--blue)", t: "Albastru", d: "Sărbătorile Maicii Domnului și ale Sfinților Arhangheli." },
  { c: "var(--green)", t: "Verde", d: "Floriile, Rusaliile și Sfânta Treime." },
  { c: "var(--purple)", t: "Violet", d: "Zilele Postului Mare." },
];

function Colours() {
  const fasts: FastLevel[] = ["fast", "fish", "wineOil", "strict"];
  return (
    <Section id="culori" eyebrow="Cum se citește" title="Culorile calendarului">
      <p className="max-w-[62ch] text-[17px] leading-relaxed text-ink">
        Calendarul bisericesc are o limbă a crucilor și a culorilor pe care o citiți de o viață. Troița o
        păstrează: crucea arată rangul sărbătorii, iar linia de pe marginea zilei arată culoarea ei
        liturgică.
      </p>

      <h3 className="mt-8 font-ui text-[19px] font-bold">Crucile</h3>
      <dl className="mt-3 divide-y divide-oak border-y border-oak">
        {[
          { c: "var(--rosie-title)", t: "Cruce roșie", d: "Praznicele împărătești și sfinții mari. Zile de sărbătoare." },
          { c: "var(--albastra-title)", t: "Cruce albastră", d: "Sfinți cu cinstire deosebită. Unele calendare o tipăresc neagră." },
          { c: "var(--ink)", t: "Fără cruce", d: "Pomenirile zilnice ale sfinților." },
        ].map((r) => (
          <div key={r.t} className="grid gap-1 py-3 sm:grid-cols-[12rem_1fr] sm:gap-6">
            <dt className="flex items-center gap-2 font-display text-[18px] font-semibold" style={{ color: r.c }}>
              <OrthodoxCross width={15} height={15} style={{ opacity: r.t === "Fără cruce" ? 0 : 1 }} />
              {r.t}
            </dt>
            <dd className="text-[15.5px] leading-relaxed text-umber">{r.d}</dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-8 font-ui text-[19px] font-bold">Culorile liturgice</h3>
      <dl className="mt-3 divide-y divide-oak border-y border-oak">
        {LITURGICAL.map((r) => (
          <div key={r.t} className="grid gap-1 py-3 sm:grid-cols-[12rem_1fr] sm:gap-6">
            <dt className="flex items-center gap-3 font-display text-[18px] font-semibold">
              <span aria-hidden className="h-6 w-[3px]" style={{ background: r.c }} />
              {r.t}
            </dt>
            <dd className="text-[15.5px] leading-relaxed text-umber">{r.d}</dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-8 font-ui text-[19px] font-bold">Postul și dezlegările</h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {fasts.map((l) => (
          <li key={l}>
            <FastBadge level={l} />
          </li>
        ))}
        <li>
          <FastBadge level="none" harti />
        </li>
      </ul>
    </Section>
  );
}

function Privacy() {
  const rows = [
    { t: "Fără cont", d: "Nu vă cerem nume, e-mail sau parolă. Deschideți aplicația și o folosiți." },
    { t: "Notificări de pe telefon", d: "Sunt programate pe telefonul vostru; niciun server nu vă trimite mesaje." },
    { t: "Fără acces la locație", d: "Aplicația nici nu cere permisiunea. Favoritele și vizitele rămân pe telefon." },
  ];
  return (
    <Section id="intimitate" eyebrow="Confidențialitate" title="Ce faceți în aplicație rămâne la voi">
      <dl className="divide-y divide-oak border-y border-oak">
        {rows.map((r) => (
          <div key={r.t} className="grid gap-1 py-4 sm:grid-cols-[14rem_1fr] sm:gap-6">
            <dt className="font-display text-[18px] font-semibold text-ink">{r.t}</dt>
            <dd className="text-[16px] leading-relaxed text-umber">{r.d}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-[15px] text-umber">
        Detaliile, inclusiv despre reclame și cookie-uri, sunt în{" "}
        <Link href="/confidentialitate" className="text-red underline underline-offset-4">
          politica de confidențialitate
        </Link>
        .
      </p>
    </Section>
  );
}

const FAQ = [
  {
    q: "Când apare aplicația?",
    a: "Troița este în pregătire și va apărea în curând pe Google Play, pentru telefoanele cu Android. Până atunci, calendarul și posturile sunt aici, pe site.",
  },
  { q: "Este și pentru iPhone?", a: "Deocamdată nu. Prima versiune este pentru Android." },
  {
    q: "De unde vin datele din calendar?",
    a: "Pomenirile, rangurile și dezlegările urmează calendarul ortodox românesc publicat pentru fiecare an. Perioadele de post se calculează din data Paștelui. Pentru rânduiala din parohia voastră, întrebați preotul duhovnic.",
  },
  {
    q: "Trebuie să îmi fac cont?",
    a: "Nu. Aplicația nu are conturi. Setările, favoritele și zilele de post notate rămân pe telefonul vostru.",
  },
];

function Faq() {
  return (
    <Section id="intrebari" eyebrow="Întrebări" title="Întrebări frecvente">
      <div className="divide-y divide-oak border-y border-oak">
        {FAQ.map((f) => (
          <details key={f.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-baseline justify-between gap-4 font-display text-[18px] font-semibold text-ink">
              {f.q}
              <span aria-hidden className="font-mono text-[18px] text-red group-open:hidden">+</span>
              <span aria-hidden className="hidden font-mono text-[18px] text-red group-open:inline">−</span>
            </summary>
            <p className="mt-2 max-w-[62ch] text-[16px] leading-relaxed text-umber">{f.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
