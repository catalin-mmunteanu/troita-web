import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Breadcrumbs, PageHeader } from "@/components/chrome";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Confidențialitate",
  description:
    "Ce date folosesc aplicația Troița și site-ul troita.ro: fără conturi, fără locație, totul pe telefon. Despre reclame și cum vă retrageți acordul.",
  path: "/confidentialitate",
});

const UPDATED = "27 noiembrie 2026";

/**
 * Short on purpose: what we keep, what others receive, what you can do.
 * The ads paragraph is written for the day ads arrive (site: AdSense,
 * app: AdMob) and is true before it: they "may" appear, always with consent
 * for personalised ones. Update UPDATED with any change.
 */
export default function Confidentialitate() {
  return (
    <>
      <Breadcrumbs items={[{ href: "/", label: "Acasă" }, { label: "Confidențialitate" }]} />
      <PageHeader eyebrow={`Actualizată la ${UPDATED}`} title="Confidențialitate" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <article className="prose-troita text-[17px]">
          <p>
            Troița nu are conturi și nu vă cere locația. Ce notați în aplicație se păstrează doar pe telefon.
          </p>

          <h2>În aplicație</h2>
          <p>
            Setările, numele salvate pentru zilele de nume, biserica voastră, favoritele și zilele de post notate
            sunt păstrate doar pe telefon. Nu le primim și nu le trimitem nimănui; dacă dezinstalați aplicația, se
            șterg odată cu ea. Nu citim agenda telefonului.
          </p>
          <p>
            Notificările sunt programate tot pe telefon, fără un server care să vi le trimită. Harta își descarcă
            imaginile de la OpenFreeMap, care vede, ca orice site, adresa IP și zona de hartă afișată.
          </p>

          <h2>Pe site</h2>
          <p>
            Site-ul nu are formulare. Numărăm vizitele cu Vercel Web Analytics, fără cookie-uri și fără să vă
            identificăm. Găzduirea (Vercel) păstrează pentru scurt timp jurnale tehnice, cu adresa IP, pentru
            funcționare și securitate.
          </p>

          <h2>Reclame</h2>
          <p>
            Site-ul și aplicația pot afișa reclame prin Google (AdSense pe site, AdMob în aplicație). Reclamele
            personalizate apar doar dacă vă dați acordul, cerut la prima vizită sau la prima pornire, iar alegerea
            se poate schimba oricând: pe site din „Preferințe cookie”, în subsol, și în aplicație din setări. Fără
            acord, reclamele sunt nepersonalizate. Cum folosește Google aceste date explică{" "}
            <a href="https://policies.google.com/technologies/partner-sites" rel="noopener">
              pagina Google despre site-urile și aplicațiile partenere
            </a>
            .
          </p>

          <h2>Drepturile voastre</h2>
          <p>
            Pentru orice întrebare sau cerere privind datele voastre (acces, ștergere, retragerea acordului),
            scrieți-ne la <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Puteți depune și o plângere la
            Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal
            (dataprotection.ro).
          </p>
          <p>
            Dacă ceva se schimbă, publicăm aici versiunea nouă și actualizăm data de sus.
          </p>
        </article>
      </div>
    </>
  );
}
