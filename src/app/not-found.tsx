import { ButtonLink } from "@/components/chrome";
import { TroitaEmblem } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="max-w-xl">
        <TroitaEmblem width={44} height={44} className="text-red" />
        <p className="rubric mt-6 text-red">Eroare 404</p>
        <h1 className="mt-2 text-[36px] font-bold leading-[1.15] text-ink">Pagina nu există</h1>
        <p className="mt-3 text-[17px] text-umber">Poate a fost mutată, sau adresa are o greșeală.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/">Pagina principală</ButtonLink>
          <ButtonLink href="/azi" variant="secondary">Sfântul zilei</ButtonLink>
        </div>
      </div>
    </div>
  );
}
