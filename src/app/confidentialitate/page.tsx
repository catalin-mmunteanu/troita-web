import type { Metadata } from "next";
import { Breadcrumbs, PageHeader } from "@/components/chrome";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politica de confidențialitate și cookie-uri",
  description:
    "Ce date folosesc aplicația Troița și site-ul troita.ro, ce cookie-uri și reclame Google sunt afișate și cum vă puteți retrage acordul.",
  alternates: { canonical: "/confidentialitate" },
};

const UPDATED = "25 octombrie 2026";

export default function Confidentialitate() {
  return (
    <>
      <Breadcrumbs items={[{ href: "/", label: "Acasă" }, { label: "Confidențialitate" }]} />
      <PageHeader eyebrow={`Actualizată la ${UPDATED}`} title="Confidențialitate și cookie-uri" />
      <article className="prose-troita mx-auto max-w-2xl px-4 text-[16.5px] sm:px-6">
        <p>
          Această politică descrie ce date folosesc aplicația pentru Android <strong>Troița</strong> și site-ul{" "}
          <strong>troita.ro</strong>. Pe scurt: nu avem conturi și nu vă cerem locația. Atât site-ul, cât și
          aplicația afișează reclame prin Google, iar reclamele personalizate apar doar dacă vă dați acordul.
        </p>

        <h2>Cine răspunde de date</h2>
        <p>
          Operatorul este {SITE.operator}, persoană fizică, cu adresa de contact{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>

        <h2>Site-ul troita.ro</h2>

        <h3>Reclame și cookie-uri Google</h3>
        <p>
          Site-ul afișează reclame prin <strong>Google AdSense</strong>. Furnizori terți, inclusiv Google, folosesc
          cookie-uri pentru a afișa reclame pe baza vizitelor anterioare pe acest site sau pe alte site-uri.
          Cookie-urile de publicitate ale Google le permit lui Google și partenerilor săi să vă afișeze reclame
          în funcție de vizitele voastre pe acest site și pe alte site-uri de pe internet.
        </p>
        <p>
          La prima vizită, un mesaj Google vă întreabă dacă sunteți de acord cu aceste cookie-uri. Dacă refuzați,
          vedeți în continuare reclame, dar nepersonalizate. Acestea pot folosi totuși cookie-uri sau
          identificatori pentru a limita de câte ori vedeți aceeași reclamă și pentru a preveni frauda.
        </p>
        <p>
          <strong>Vă puteți schimba alegerea oricând</strong> din linkul „Preferințe cookie” din subsolul
          fiecărei pagini.
        </p>
        <p>Puteți dezactiva reclamele personalizate și astfel:</p>
        <ul>
          <li>
            din setările Google pentru reclame:{" "}
            <a href="https://www.google.com/settings/ads" rel="noopener">www.google.com/settings/ads</a>;
          </li>
          <li>
            pentru alți furnizori de publicitate:{" "}
            <a href="https://www.aboutads.info/choices/" rel="noopener">www.aboutads.info/choices</a> și{" "}
            <a href="https://www.youronlinechoices.eu/" rel="noopener">www.youronlinechoices.eu</a>.
          </li>
        </ul>
        <p>
          Lista furnizorilor terți care pot afișa reclame prin Google este publicată de Google, împreună cu felul
          în care Google folosește datele de pe site-urile partenerilor:{" "}
          <a href="https://policies.google.com/technologies/partner-sites" rel="noopener">
            policies.google.com/technologies/partner-sites
          </a>
          .
        </p>

        <h3>Statistici de vizitare</h3>
        <p>
          Pentru a ști ce pagini sunt citite folosim Vercel Web Analytics, care numără vizitele în mod agregat,
          fără cookie-uri și fără a vă identifica.
        </p>

        <h3>Găzduire</h3>
        <p>
          Site-ul este găzduit de Vercel Inc. Serverele păstrează, pentru scurt timp, jurnale tehnice cu adresa IP
          și paginile cerute, necesare funcționării și securității. Site-ul nu are formulare. Dacă ne scrieți pe
          e-mail, folosim adresa voastră doar pentru a vă răspunde.
        </p>

        <h2>Aplicația Troița</h2>

        <h3>Ce rămâne pe telefon</h3>
        <ul>
          <li>setările de notificări (ora anunțului zilnic, sunetul, anunțurile pentru posturi și hramuri);</li>
          <li>bisericile adăugate la favorite și cele însemnate ca vizitate;</li>
          <li>zilele de post notate, numai dacă activați această opțiune.</li>
        </ul>
        <p>
          Aceste date sunt salvate doar pe telefonul vostru. Nu le colectăm și nu le trimitem nimănui. Dacă
          dezinstalați aplicația, ele se șterg odată cu ea.
        </p>

        <h3>Reclame în aplicație</h3>
        <p>
          Aplicația afișează reclame prin <strong>Google AdMob</strong>. Pentru aceasta, AdMob primește de la
          telefon identificatorul de publicitate Android, adresa IP și informații tehnice despre dispozitiv și
          aplicație, pe care le folosește pentru a afișa reclame, pentru a le măsura și pentru a preveni frauda.
        </p>
        <p>
          La prima pornire, un formular Google vă întreabă dacă sunteți de acord cu reclamele personalizate.
          Alegerea se poate schimba oricând din setările aplicației. Identificatorul de publicitate poate fi
          resetat sau șters din setările telefonului (Setări → Confidențialitate → Reclame). Detalii despre cum
          folosește Google aceste date:{" "}
          <a href="https://policies.google.com/technologies/partner-sites" rel="noopener">
            policies.google.com/technologies/partner-sites
          </a>
          .
        </p>

        <h3>Notificări</h3>
        <p>
          Notificările sunt programate local, pe telefon. Nu folosim servicii de notificări push. Le puteți opri
          oricând din aplicație sau din setările telefonului.
        </p>

        <h3>Locația</h3>
        <p>Aplicația nu cere și nu folosește permisiunea de localizare.</p>

        <h3>Harta</h3>
        <p>
          Pentru a desena harta, aplicația descarcă imaginile hărții de la serviciul OpenFreeMap
          (openfreemap.org). Acesta primește adresa IP a telefonului și zona de hartă afișată. Datele despre
          biserici provin din OpenStreetMap și sunt incluse în aplicație. Când apăsați „Drum până acolo”,
          aplicația deschide aplicația de hărți aleasă de voi, care are propria politică de confidențialitate.
        </p>

        <h3>Ce nu facem</h3>
        <ul>
          <li>nu avem conturi de utilizator;</li>
          <li>nu vindem date personale;</li>
          <li>nu folosim reclame personalizate fără acordul vostru.</li>
        </ul>

        <h2>Drepturile voastre</h2>
        <p>
          Conform Regulamentului (UE) 2016/679 (GDPR), aveți dreptul de acces, rectificare, ștergere,
          restricționare și opoziție privind datele voastre, precum și dreptul de a vă retrage oricând acordul
          pentru cookie-uri și reclame personalizate. Pentru orice cerere, scrieți-ne la{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Aveți și dreptul de a depune o plângere la Autoritatea
          Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (www.dataprotection.ro).
        </p>

        <h2>Copii</h2>
        <p>
          Site-ul și aplicația nu se adresează în mod special copiilor sub 16 ani și nu colectăm cu bună știință
          date de la aceștia.
        </p>

        <h2>Modificări</h2>
        <p>
          Dacă această politică se schimbă, publicăm aici versiunea nouă și actualizăm data de sus. Schimbările
          importante sunt anunțate și în aplicație.
        </p>
      </article>
    </>
  );
}
