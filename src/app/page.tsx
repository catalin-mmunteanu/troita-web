import Link from "next/link";
import { cacheLife } from "next/cache";
import { AppNote, StoreButton } from "@/components/chrome";
import { Commemorations, FastPill } from "@/components/calendar-bits";
import { ArrowIcon, BellIcon, LockIcon, MapPinIcon, PhoneIcon } from "@/components/icons";
import { Phone } from "@/components/phone";
import { getDay, upcomingMajor } from "@/lib/calendar";
import { formatLong, formatWithWeekday, todayInRomania, capitalize, type Ymd } from "@/lib/dates";
import { FAST_LABEL, PERIOD_LABEL } from "@/lib/liturgical";

export default async function Home() {
  "use cache";
  cacheLife("today");
  const today = todayInRomania();

  return (
    <>
      <Hero today={today} />
      <TodayStrip today={today} />
      <Features today={today} />
      <Colours />
      <Privacy />
      <Faq />
      <FinalCta />
    </>
  );
}

function Hero({ today }: { today: Ymd }) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_at_top,var(--color-accent-surface),transparent_65%)]"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-12 pb-16 sm:px-6 md:grid-cols-[1.1fr_1fr] md:pt-20 md:pb-24">
        <div>
          <StoreButton />
          <h1 className="font-display mt-6 text-[44px] font-bold leading-[1.02] tracking-tight text-burgundy sm:text-[60px] lg:text-[68px]">
            Calendarul ortodox, zi de zi.
          </h1>
          <p className="mt-6 max-w-xl text-[18px] leading-relaxed text-ink/85 sm:text-[19px]">
            Sfântul zilei, posturile și dezlegările, bisericile, mănăstirile și troițele de pe hartă.
            Toate într-o aplicație simplă, cu litere mari și culorile calendarului pe care îl știți.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/azi"
              className="inline-flex items-center gap-2 rounded-full bg-burgundy px-5 py-3 text-[15.5px] font-semibold text-paper transition hover:bg-burgundy-deep"
            >
              Sfântul zilei <ArrowIcon width={16} height={16} />
            </Link>
            <Link
              href={`/calendar-ortodox/${today.y}`}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-paper px-5 py-3 text-[15.5px] font-semibold text-burgundy transition hover:border-gold"
            >
              Calendar ortodox {today.y}
            </Link>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[14.5px] text-muted">
            <li className="flex items-center gap-1.5"><LockIcon width={16} height={16} /> Fără cont</li>
            <li className="flex items-center gap-1.5"><BellIcon width={16} height={16} /> Notificări programate pe telefon</li>
            <li className="flex items-center gap-1.5"><PhoneIcon width={16} height={16} /> Android</li>
          </ul>
        </div>
        <Phone screen="calendar" today={today} alt="Ecranul Calendar din aplicația Troița" priority />
      </div>
    </section>
  );
}

function TodayStrip({ today }: { today: Ymd }) {
  const day = getDay(today);
  const next = upcomingMajor(today, 4);
  return (
    <section aria-labelledby="azi-titlu" className="border-y border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[20px] border border-border bg-paper p-6 sm:p-8">
          <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-gold">Astăzi</p>
          <h2 id="azi-titlu" className="font-display mt-1 text-[26px] font-bold text-burgundy">
            {capitalize(formatWithWeekday(today))}
          </h2>
          <div className="mt-5">
            <Commemorations day={day} size="lg" />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <FastPill level={day.fastLevel} />
            {day.periodKind && day.periodKind !== "harti" && (
              <span className="text-[14px] text-muted">{PERIOD_LABEL[day.periodKind]}</span>
            )}
          </div>
          <Link href="/azi" className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold text-burgundy hover:underline">
            Toată ziua de azi <ArrowIcon width={15} height={15} />
          </Link>
        </div>
        <div>
          <h2 className="text-[13px] font-bold uppercase tracking-[0.14em] text-muted">Sărbători care urmează</h2>
          <ul className="mt-4 divide-y divide-border">
            {next.map((d) => (
              <li key={d.date} className="flex gap-4 py-3">
                <div className="w-12 shrink-0 text-center text-feast-red">
                  <div className="font-display text-[24px] font-bold leading-none">{d.day}</div>
                  <div className="text-[12px] font-semibold">{formatLong({ y: d.year, m: d.month, d: d.day }, false).split(" ")[1].slice(0, 3)}</div>
                </div>
                <div className="font-display text-[16px] leading-snug text-calendar-ink">
                  {d.feasts[0]?.parts[0]?.text}
                  {d.fastLevel !== "none" && (
                    <span className="mt-0.5 block font-sans text-[13px] text-muted">{FAST_LABEL[d.fastLevel]}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <Link href={`/calendar-ortodox/${today.y}`} className="mt-3 inline-flex items-center gap-1.5 text-[15px] font-semibold text-burgundy hover:underline">
            Toate sărbătorile din {today.y} <ArrowIcon width={15} height={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Feature({
  eyebrow,
  title,
  children,
  phone,
  flip,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  phone: React.ReactNode;
  flip?: boolean;
}) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      <div className={flip ? "md:order-2" : ""}>{phone}</div>
      <div className={flip ? "md:order-1" : ""}>
        <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-gold">{eyebrow}</p>
        <h3 className="font-display mt-2 text-[32px] font-bold leading-tight text-burgundy sm:text-[38px]">{title}</h3>
        <div className="mt-4 space-y-4 text-[17px] leading-relaxed text-ink/85">{children}</div>
      </div>
    </div>
  );
}

function Features({ today }: { today: Ymd }) {
  return (
    <section aria-labelledby="ce-face" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <h2 id="ce-face" className="font-display text-[34px] font-bold leading-tight text-burgundy sm:text-[42px]">
          Patru file, ca într-un calendar de perete
        </h2>
        <p className="mt-4 text-[17px] leading-relaxed text-muted">Calendar · Posturi · Hartă · Profil</p>
        <div className="rule-gold mx-auto mt-8 w-24" />
      </div>
      <div className="mt-16 space-y-24 md:space-y-32">
        <Feature
          eyebrow="Calendar"
          title="Sfântul zilei, cu tot ce se cuvine știut"
          phone={<Phone screen="calendar" today={today} alt="Lista zilelor din calendarul aplicației Troița" />}
        >
          <p>
            Fiecare zi a anului, cu toți sfinții pomeniți, crucea roșie sau albastră și dezlegarea zilei, scrise
            în întregime, nu prescurtate.
          </p>
          <p>
            Căutați un sfânt după nume, aflați în ce zi se prăznuiește și trimiteți ziua cuiva drag. Duminicile au
            glasul și voscreasna.
          </p>
        </Feature>
        <Feature
          flip
          eyebrow="Posturi"
          title="Știți dinainte când e post și când e dezlegare"
          phone={<Phone screen="posturi" today={today} alt="Ecranul Posturi din aplicația Troița" />}
        >
          <p>
            Cele patru posturi mari, cu ziua în care vă aflați și câte zile mai sunt. Pentru fiecare post, toate
            zilele, cu dezlegările la pește, la untdelemn și vin sau zilele de ajunare.
          </p>
          <p>
            Dacă doriți, puteți nota zilele în care ați ținut postul. Rămân doar pe telefonul vostru.
          </p>
        </Feature>
        <Feature
          eyebrow="Hartă"
          title="Bisericile, mănăstirile și troițele din toată țara"
          phone={<Phone screen="harta" today={today} alt="Harta bisericilor din aplicația Troița" />}
        >
          <p>
            Peste 13.000 de locașuri din toată România, fiecare tip cu culoarea lui: biserici, mănăstiri,
            catedrale, paraclise și troițe.
          </p>
          <p>
            Deschideți o biserică pentru hram și drum până acolo, adăugați-o la favorite sau însemnați-o ca
            vizitată.
          </p>
        </Feature>
        <Feature
          flip
          eyebrow="Profil"
          title="Notificări blânde, doar când vreți"
          phone={<Phone screen="profil" today={today} alt="Setările de notificări din aplicația Troița" />}
        >
          <p>
            Un singur anunț pe zi, la ora aleasă de voi, cu sfântul zilei. Sunet doar la sărbătorile mari și un
            anunț cu o zi înainte de fiecare post.
          </p>
          <p>Vă amintim și de hramul bisericilor favorite, cu o seară înainte.</p>
        </Feature>
      </div>
    </section>
  );
}

function Colours() {
  const ranks = [
    { c: "var(--color-feast-red)", t: "Cruce roșie", d: "Praznicele împărătești, sfinții mari și toate duminicile." },
    { c: "var(--color-feast-blue)", t: "Cruce albastră", d: "Sfinți cu cinstire deosebită. În unele calendare se tipărește neagră." },
    { c: "var(--color-romanian-saint)", t: "Sfinți români", d: "Puși deoparte, cum îi pun și calendarele tipărite." },
  ];
  return (
    <section aria-labelledby="culori" className="bg-burgundy text-paper">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-2">
        <div>
          <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-gold">Culorile pe care le știți</p>
          <h2 id="culori" className="font-display mt-2 text-[34px] font-bold leading-tight sm:text-[40px]">
            Roșul înseamnă sărbătoare. Atât.
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-paper/85">
            Calendarul bisericesc are o limbă a culorilor pe care o citiți de o viață. Troița o păstrează așa cum
            este: cifre și litere cu serife, roșu pentru zilele mari, negru pentru zilele obișnuite. Culoarea
            aplicației nu se amestecă niciodată cu roșul sărbătorii.
          </p>
        </div>
        <ul className="space-y-3">
          {ranks.map((r) => (
            <li key={r.t} className="flex gap-4 rounded-[16px] bg-paper p-5 text-ink">
              <span className="font-display text-[28px] leading-none" style={{ color: r.c }} aria-hidden>✛</span>
              <div>
                <div className="font-semibold" style={{ color: r.c }}>{r.t}</div>
                <p className="mt-0.5 text-[15px] leading-relaxed text-muted">{r.d}</p>
              </div>
            </li>
          ))}
          <li className="rounded-[16px] bg-paper p-5 text-ink">
            <div className="font-semibold">Dezlegările, fiecare cu semnul și numele ei</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["fish", "wineOil", "dairy", "fast", "strict"] as const).map((l) => (
                <FastPill key={l} level={l} compact />
              ))}
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}

function Privacy() {
  const items = [
    { Icon: LockIcon, t: "Fără cont", d: "Nu vă cerem nume, e-mail sau parolă. Deschideți aplicația și o folosiți." },
    { Icon: BellIcon, t: "Notificări de pe telefon", d: "Sunt programate pe telefonul vostru. Nu există server care să vă trimită ceva." },
    { Icon: MapPinIcon, t: "Fără acces la locație", d: "Aplicația nici nu cere permisiunea de localizare. Favoritele și vizitele rămân pe telefon." },
  ];
  return (
    <section aria-labelledby="intimitate" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 id="intimitate" className="font-display text-[34px] font-bold leading-tight text-burgundy sm:text-[40px]">
          Ce faceți în aplicație rămâne la voi
        </h2>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {items.map(({ Icon, t, d }) => (
          <div key={t} className="rounded-[20px] border border-border bg-surface p-6">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-accent-surface text-burgundy">
              <Icon width={22} height={22} />
            </span>
            <h3 className="mt-4 text-[18px] font-semibold">{t}</h3>
            <p className="mt-1.5 text-[15.5px] leading-relaxed text-muted">{d}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-[15px] text-muted">
        Detaliile sunt în{" "}
        <Link href="/confidentialitate" className="font-semibold text-burgundy underline underline-offset-4">
          politica de confidențialitate
        </Link>
        .
      </p>
    </section>
  );
}

const FAQ = [
  {
    q: "Când apare aplicația?",
    a: "Troița este în pregătire și va apărea în curând pe Google Play, pentru telefoanele cu Android. Până atunci, calendarul și posturile sunt aici, pe site.",
  },
  {
    q: "Este și pentru iPhone?",
    a: "Deocamdată nu. Prima versiune este pentru Android.",
  },
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
    <section aria-labelledby="intrebari" className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h2 id="intrebari" className="font-display text-center text-[32px] font-bold text-burgundy">
        Întrebări frecvente
      </h2>
      <div className="mt-8 divide-y divide-border rounded-[20px] border border-border bg-surface">
        {FAQ.map((f) => (
          <details key={f.q} className="group px-5 py-4 sm:px-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold">
              {f.q}
              <span className="text-gold transition group-open:rotate-45" aria-hidden>✛</span>
            </summary>
            <p className="mt-3 text-[16px] leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <AppNote>
      <strong className="font-semibold">Troița vine în curând pe Google Play.</strong> Până atunci, găsiți aici{" "}
      <Link href="/azi" className="text-burgundy underline underline-offset-4">sfântul zilei</Link> și{" "}
      <Link href="/posturi" className="text-burgundy underline underline-offset-4">posturile anului</Link>.
    </AppNote>
  );
}
