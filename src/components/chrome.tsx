import Link from "next/link";
import { ADS, NAV, SITE } from "@/lib/site";
import { CrossIcon, PhoneIcon } from "./icons";
import { CookieSettingsButton } from "./ads";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 text-burgundy ${className}`} aria-label="Troița, acasă">
      <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-burgundy text-paper">
        <CrossIcon width={20} height={20} strokeWidth={2} />
      </span>
      <span className="font-display text-[24px] font-bold leading-none tracking-tight">Troița</span>
    </Link>
  );
}

/** "În curând pe Google Play" until launch; a real download link after. */
export function StoreButton({ size = "md" }: { size?: "md" | "lg" }) {
  const big = size === "lg";
  if (SITE.playStoreUrl) {
    return (
      <a
        href={SITE.playStoreUrl}
        className={`inline-flex items-center gap-2.5 rounded-full bg-burgundy font-semibold text-paper transition hover:bg-burgundy-deep ${
          big ? "px-6 py-3.5 text-[16px]" : "px-4 py-2 text-[14px]"
        }`}
      >
        <PhoneIcon /> Descarcă din Google Play
      </a>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-2.5 rounded-full border border-gold/60 bg-accent-surface font-semibold text-burgundy ${
        big ? "px-5 py-3 text-[15.5px]" : "px-3.5 py-1.5 text-[13.5px]"
      }`}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold" />
      </span>
      În curând pe Google Play
    </span>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav aria-label="Navigare principală" className="flex items-center gap-0.5 sm:gap-1">
          {NAV.map((n, i) => (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded-full px-2.5 py-1.5 text-[14.5px] font-medium text-ink/80 transition hover:bg-surface hover:text-burgundy sm:px-3.5 ${
                i === NAV.length - 1 ? "hidden sm:inline-block" : ""
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
            Calendarul ortodox, zi de zi: sfântul zilei, posturile și dezlegările, bisericile și
            troițele din toată țara.
          </p>
          <div className="mt-5">
            <StoreButton />
          </div>
        </div>
        <div>
          <h2 className="text-[13px] font-bold uppercase tracking-[0.1em] text-muted">Calendar</h2>
          <ul className="mt-3 space-y-2 text-[15px]">
            <li><Link className="hover:text-burgundy" href="/azi">Sfântul zilei</Link></li>
            <li><Link className="hover:text-burgundy" href="/calendar-ortodox/2026">Calendar ortodox 2026</Link></li>
            <li><Link className="hover:text-burgundy" href="/calendar-ortodox/2027">Calendar ortodox 2027</Link></li>
            <li><Link className="hover:text-burgundy" href="/posturi">Posturile anului</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-[13px] font-bold uppercase tracking-[0.1em] text-muted">Troița</h2>
          <ul className="mt-3 space-y-2 text-[15px]">
            <li><Link className="hover:text-burgundy" href="/despre">Despre aplicație</Link></li>
            <li><Link className="hover:text-burgundy" href="/confidentialitate">Politica de confidențialitate</Link></li>
            <li><a className="hover:text-burgundy" href={`mailto:${SITE.email}`}>Contact</a></li>
            {ADS.client && <li><CookieSettingsButton className="hover:text-burgundy" /></li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-5 text-[13px] text-muted sm:flex-row sm:justify-between sm:px-6">
          <span>© {SITE.operator}. Troița nu este o publicație oficială a Bisericii Ortodoxe Române.</span>
          <span>Date despre biserici: © contributorii OpenStreetMap</span>
        </div>
      </div>
    </footer>
  );
}

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-12 pb-8 text-center sm:px-6 sm:pt-16">
      {eyebrow && (
        <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-gold">{eyebrow}</p>
      )}
      <h1 className="font-display mt-3 text-[34px] font-bold leading-[1.1] text-burgundy sm:text-[46px]">{title}</h1>
      {children && <div className="mx-auto mt-4 max-w-2xl text-[17px] leading-relaxed text-muted">{children}</div>}
      <div className="rule-gold mx-auto mt-8 w-24" />
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Pesmet" className="mx-auto max-w-3xl px-4 pt-6 text-[13.5px] text-muted sm:px-6">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>›</span>}
            {it.href ? (
              <Link href={it.href} className="hover:text-burgundy">{it.label}</Link>
            ) : (
              <span aria-current="page" className="text-ink">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Small, non-blocking app note under a content page. Never an interstitial. */
export function AppNote({ children }: { children?: React.ReactNode }) {
  return (
    <aside className="mx-auto mt-12 max-w-3xl px-4 sm:px-6">
      <div className="flex flex-col items-start gap-4 rounded-[20px] border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <p className="text-[15.5px] leading-relaxed text-ink/90">
          {children ?? (
            <>
              <strong className="font-semibold">Pe telefon, cu notificări.</strong> Aplicația Troița vă anunță
              sfântul zilei și începutul fiecărui post, fără cont.
            </>
          )}
        </p>
        <div className="shrink-0">
          <StoreButton />
        </div>
      </div>
    </aside>
  );
}
