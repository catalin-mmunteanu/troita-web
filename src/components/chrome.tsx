import Link from "next/link";
import { CALENDAR_YEARS } from "@/lib/calendar";
import { ADS, NAV, SITE } from "@/lib/site";
import { ArrowIcon, RopeDivider, TroitaEmblem } from "./icons";
import { CookieSettingsButton } from "./ads";
import { DateJump } from "./date-jump";
import { ThemeToggle } from "./theme-toggle";

export function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-1.5 text-ink sm:gap-2" aria-label="Troița, pagina principală">
      <TroitaEmblem width={32} height={32} className="h-7 w-7 text-red sm:h-8 sm:w-8" />
      <span className="font-display text-[20px] font-bold max-[350px]:sr-only leading-none tracking-[-0.01em] sm:text-[23px]">Troița</span>
    </Link>
  );
}

/** Rectangular buttons (DESIGN.MD ban 4: no pills, no heavy shadows). */
export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const base =
    "inline-flex h-11 items-center gap-2 rounded-sm border px-5 font-ui text-[17px] font-medium transition-colors";
  const look =
    variant === "primary"
      ? "border-red bg-red text-on-red hover:opacity-90"
      : "border-oak bg-surface text-ink hover:border-umber";
  return (
    <Link href={href} className={`${base} ${look}`}>
      {children}
    </Link>
  );
}

/** Where the app stands: a plain line until launch, a download link after. */
export function StoreStatus() {
  if (SITE.playStoreUrl) {
    return (
      <a
        href={SITE.playStoreUrl}
        className="inline-flex h-11 items-center gap-2 rounded-sm border border-red bg-red px-5 font-ui text-[17px] font-medium text-on-red hover:opacity-90"
      >
        Descarcă din Google Play <ArrowIcon width={16} height={16} />
      </a>
    );
  }
  return (
    <p className="rubric flex items-center gap-2 text-umber">
      <span aria-hidden className="inline-block h-2 w-2 bg-gold" />
      Android · în curând pe Google Play
    </p>
  );
}

export function Header() {
  const min = `${CALENDAR_YEARS[0]}-01-01`;
  const max = `${CALENDAR_YEARS[CALENDAR_YEARS.length - 1]}-12-31`;
  return (
    <header className="sticky top-0 z-30 border-b border-oak bg-parchment">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-3 min-[400px]:px-4 sm:px-6">
        <Logo />
        <div className="flex items-center gap-0.5 sm:gap-3">
          <nav aria-label="Navigare principală" className="flex items-center">
            {NAV.map((n, i) => (
              <Link
                key={n.href}
                href={n.href}
                className={`px-1 py-2 font-ui text-[15px] min-[400px]:px-1.5 min-[400px]:text-[16px] sm:text-[17px] font-medium text-ink/85 underline-offset-[6px] hover:text-red hover:underline sm:px-3 ${
                  i === NAV.length - 1 ? "hidden md:inline-block" : ""
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <DateJump min={min} max={max} />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 bg-surface">
      <RopeDivider />
      <div className="mx-auto grid max-w-6xl gap-10 border-t border-oak px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-umber">
            Calendarul ortodox, zi de zi: sfântul zilei, posturile și dezlegările, bisericile și troițele din
            toată țara.
          </p>
          <div className="mt-5">
            <StoreStatus />
          </div>
        </div>
        <div>
          <h2 className="rubric text-umber">Calendar</h2>
          <ul className="mt-3 space-y-2 font-ui text-[17px]">
            <li><Link className="hover:text-red" href="/azi">Sfântul zilei</Link></li>
            {CALENDAR_YEARS.map((y) => (
              <li key={y}><Link className="hover:text-red" href={`/calendar-ortodox/${y}`}>Calendar ortodox {y}</Link></li>
            ))}
            <li><Link className="hover:text-red" href="/posturi">Posturile anului</Link></li>
            <li><Link className="hover:text-red" href="/evanghelia-zilei">Evanghelia zilei</Link></li>
            <li><Link className="hover:text-red" href="/zile-de-nume">Zile de nume</Link></li>
            <li><Link className="hover:text-red" href="/nunti">Când se fac nunți</Link></li>
            <li><Link className="hover:text-red" href="/botez">Când se face botezul</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="rubric text-umber">Troița</h2>
          <ul className="mt-3 space-y-2 font-ui text-[17px]">
            <li><Link className="hover:text-red" href="/despre">Despre aplicație</Link></li>
            <li><Link className="hover:text-red" href="/confidentialitate">Confidențialitate</Link></li>
            <li><a className="hover:text-red" href={`mailto:${SITE.email}`}>Contact</a></li>
            {ADS.client && <li><CookieSettingsButton className="hover:text-red" /></li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-oak">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-5 text-[13px] text-umber sm:flex-row sm:justify-between sm:px-6">
          <span>© {SITE.author}. Troița nu este o publicație oficială a Bisericii Ortodoxe Române.</span>
          <span>Date despre biserici: © contributorii OpenStreetMap</span>
        </div>
      </div>
    </footer>
  );
}

/** Left-aligned page title, like the head of a printed almanac page. */
export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-8 sm:px-6 sm:pt-14">
      <div className="max-w-3xl">
        {eyebrow && <p className="rubric text-red">{eyebrow}</p>}
        <h1 className="mt-2 text-[36px] font-bold leading-[1.15] text-ink sm:text-[44px]">{title}</h1>
        {children && <div className="mt-4 max-w-[62ch] text-[17px] leading-relaxed text-umber">{children}</div>}
      </div>
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  // BreadcrumbList structured data, which Google can show in place of the URL
  // in search results. The current page (last item) needs no URL.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.label,
      ...(it.href ? { item: `${SITE.url}${it.href === "/" ? "" : it.href}` } : {}),
    })),
  };
  return (
    <nav aria-label="Pesmet" className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ol className="rubric flex flex-wrap items-center gap-1.5 text-umber">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>/</span>}
            {it.href ? (
              <Link href={it.href} className="hover:text-red">{it.label}</Link>
            ) : (
              <span aria-current="page" className="text-ink">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** A quiet note about the app at the end of a content page. Never a pop-up. */
export function AppNote({ children }: { children?: React.ReactNode }) {
  return (
    <aside className="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
      <div className="max-w-3xl border-t border-oak pt-6">
        <p className="rubric text-red">Aplicația Troița</p>
        <p className="mt-2 max-w-[62ch] text-[16px] leading-relaxed text-ink">
          {children ?? (
            <>
              Pe telefon, cu notificări: sfântul zilei și începutul fiecărui post, fără cont. Aplicația pentru
              Android vine în curând pe Google Play.
            </>
          )}
        </p>
      </div>
    </aside>
  );
}
