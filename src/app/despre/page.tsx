import { BIBLE_SOURCE } from "@/lib/lecturi";
import { COMPUTED_YEARS, PUBLISHED_YEARS } from "@/lib/calendar";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { AppNote, Breadcrumbs, PageHeader } from "@/components/chrome";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Despre aplicația Troița",
  description:
    "Troița este un calendar ortodox românesc pentru Android: sfântul zilei, posturile, dezlegările și Evanghelia. De unde vin datele.",
  path: "/despre",
});

export default function Despre() {
  return (
    <>
      <Breadcrumbs items={[{ href: "/", label: "Acasă" }, { label: "Despre" }]} />
      <PageHeader eyebrow="Despre" title="De ce Troița" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <article className="prose-troita text-[17px]">
        <p>
          Troițele de la margine de drum sunt o cruce pusă acolo ca să ne aducă aminte. Aplicația vrea să fie la fel,
          pe telefon: un semn mic, la îndemână, care vă spune ce sfânt pomenim azi, dacă este zi de post și ce
          Evanghelie se citește.
        </p>
        <p>
          Am făcut-o pentru cei care țin un calendar bisericesc pe perete: litere mari, roșu pentru sărbătorile mari,
          negru pentru zilele obișnuite.
        </p>

        <h2>De unde vin datele</h2>
        <p>
          Pomenirile și dezlegările urmează calendarul ortodox românesc din {PUBLISHED_YEARS.join(" și ")}; anii{" "}
          {COMPUTED_YEARS.join(", ")} sunt calculați după aceleași reguli, până apare calendarul oficial. Posturile
          se socotesc din data Paștelui. Bisericile de pe hartă vin din OpenStreetMap (© contributorii
          OpenStreetMap, ODbL).
        </p>
        <p>
          Troița este un proiect independent, nu o publicație oficială a Bisericii Ortodoxe Române. Pentru rânduiala
          din parohia voastră, întrebați preotul duhovnic.
        </p>

        <h2>Ați găsit o greșeală?</h2>
        <p>
          Scrieți-ne la{" "}
          <a href={`mailto:${SITE.email}?subject=Troi%C8%9Ba%3A%20gre%C8%99eal%C4%83%20%C3%AEn%20calendar`}>{SITE.email}</a>{" "}
          și o corectăm.
        </p>

        <p className="text-[15px] text-umber">Textul Apostolului și al Evangheliei: {BIBLE_SOURCE}.</p>
      </article>
      </div>
      <AppNote />
    </>
  );
}
