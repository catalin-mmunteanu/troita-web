import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p className="font-display text-[64px] font-bold leading-none text-gold">404</p>
      <h1 className="font-display mt-4 text-[32px] font-bold text-burgundy">Pagina nu există</h1>
      <p className="mt-3 text-[17px] text-muted">Poate a fost mutată, sau adresa are o greșeală.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-full bg-burgundy px-5 py-3 font-semibold text-paper hover:bg-burgundy-deep">
          Acasă
        </Link>
        <Link href="/azi" className="rounded-full border border-border px-5 py-3 font-semibold text-burgundy hover:border-gold">
          Sfântul zilei
        </Link>
      </div>
    </div>
  );
}
