import type { Metadata } from "next";
import Link from "next/link";
import { AppNote, Breadcrumbs, PageHeader } from "@/components/chrome";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Despre aplicația Troița",
  description:
    "Troița este un calendar ortodox românesc pentru Android: sfântul zilei, posturile, dezlegările și harta bisericilor. De unde vin datele și cum ne puteți scrie.",
  alternates: { canonical: "/despre" },
};

export default function Despre() {
  return (
    <>
      <Breadcrumbs items={[{ href: "/", label: "Acasă" }, { label: "Despre" }]} />
      <PageHeader eyebrow="Despre" title="De ce Troița" />
      <article className="prose-troita mx-auto max-w-2xl px-4 text-[17px] sm:px-6">
        <p>
          Troițele de la margine de drum sunt un semn pe care îl recunoaște oricine în România: o cruce pusă acolo
          ca să ne aducă aminte. Aplicația vrea să fie același lucru pe telefon. Un semn mic, la îndemână, care vă
          spune ce sfânt pomenim azi, dacă este zi de post și ce biserici, mănăstiri și troițe sunt în locul pe care
          îl căutați pe hartă.
        </p>
        <p>
          Am făcut-o pentru cei care țin un calendar bisericesc pe perete sau în buzunar. De aceea are litere mari,
          serife ca un calendar tipărit și aceleași culori: roșu pentru sărbătorile mari, negru pentru zilele
          obișnuite.
        </p>

        <h2>De unde vin datele</h2>
        <ul>
          <li>
            <strong>Pomenirile, rangurile și dezlegările</strong> urmează calendarul ortodox românesc publicat
            pentru fiecare an. Pe site sunt publicați anii 2026 și 2027.
          </li>
          <li>
            <strong>Perioadele de post</strong>, glasul și voscreasna se calculează din data Paștelui, după
            rânduiala Bisericii Ortodoxe Române.
          </li>
          <li>
            <strong>Bisericile, mănăstirile și troițele</strong> de pe hartă provin din OpenStreetMap, © contributorii
            OpenStreetMap, sub licența ODbL.
          </li>
        </ul>
        <p>
          Troița este un proiect independent și nu este o publicație oficială a Bisericii Ortodoxe Române. Rânduiala
          postului poate diferi de la o parohie la alta; pentru îndrumare, întrebați preotul duhovnic.
        </p>

        <h2>Când apare</h2>
        <p>
          Aplicația este în pregătire și va apărea în curând pe Google Play, pentru Android. Până atunci, puteți
          folosi pe site <Link href="/azi">sfântul zilei</Link>, <Link href="/calendar-ortodox">calendarul</Link>{" "}
          și <Link href="/posturi">ghidul de post</Link>.
        </p>

        <h2>Ați găsit o greșeală?</h2>
        <p>
          Dacă o zi din calendar nu se potrivește cu ce știți, scrieți-ne la{" "}
          <a href={`mailto:${SITE.email}?subject=Troi%C8%9Ba%3A%20gre%C8%99eal%C4%83%20%C3%AEn%20calendar`}>{SITE.email}</a>.
          Corectăm repede.
        </p>
      </article>
      <AppNote />
    </>
  );
}
