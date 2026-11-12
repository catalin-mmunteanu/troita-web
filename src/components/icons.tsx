import type { SVGProps } from "react";
import type { FastLevel } from "@/lib/liturgical";

type P = SVGProps<SVGSVGElement>;
const line = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "square" as const,
  strokeLinejoin: "miter" as const,
  "aria-hidden": true,
};

/**
 * The three-bar Orthodox cross, drawn rather than typed: none of the site's
 * fonts has U+2626, and the system fallback renders it as an emoji.
 */
export const OrthodoxCross = (p: P) => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <rect x="10.8" y="1.5" width="2.4" height="21" />
    <rect x="8.2" y="4.2" width="7.6" height="2" />
    <rect x="4.5" y="8.4" width="15" height="2.4" />
    <path d="M7.6 17.9l8.4-3.4.75 1.9-8.4 3.4z" />
  </svg>
);

/**
 * The troiță: a wooden wayside cross under its small gabled roof, cut in the
 * flat, incised style of Romanian woodcraft. Logo, favicon and OG image.
 */
export const TroitaEmblem = (p: P) => (
  <svg width={36} height={36} viewBox="0 0 36 36" fill="none" aria-hidden {...p}>
    {/* roof */}
    <path d="M6.5 11.5 18 3.5l11.5 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" />
    <path d="M10 10.2 18 4.8l8 5.4" stroke="currentColor" strokeWidth="0.9" opacity="0.55" />
    {/* post, with an incised centre line */}
    <rect x="16.3" y="7" width="3.4" height="27" fill="currentColor" />
    <path d="M18 9v23" stroke="var(--parchment)" strokeWidth="0.6" opacity="0.7" />
    {/* top bar, main bar, slanted foot bar */}
    <rect x="13.8" y="9.6" width="8.4" height="2.2" fill="currentColor" />
    <rect x="8" y="14" width="20" height="3.2" fill="currentColor" />
    <path d="M9.5 17.6h17" stroke="var(--parchment)" strokeWidth="0.6" opacity="0.7" />
    <path d="m12.3 26.4 11.6-4.2.9 2.3-11.6 4.2z" fill="currentColor" />
    {/* carved notches on the arms */}
    <path d="M10 14v3.2M26 14v3.2" stroke="var(--parchment)" strokeWidth="0.7" />
    {/* ground */}
    <path d="M10.5 34.2h15" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

/**
 * The twisted rope (funie) carved around troițe and wooden church portals,
 * used as a thin section divider. Purely decorative.
 */
export function RopeDivider({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="100%" height="8" aria-hidden preserveAspectRatio="none">
      <defs>
        <pattern id="funie" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M-1 7 3 1M3 7l4-6M7 7l4-6" stroke="var(--oak)" strokeWidth="1.6" />
        </pattern>
      </defs>
      <rect width="100%" height="8" fill="url(#funie)" />
    </svg>
  );
}

export const ArrowIcon = (p: P) => (
  <svg {...line} {...p}>
    <path d="M4 12h15M14 7l5 5-5 5" />
  </svg>
);

export const ChevronLeft = (p: P) => (
  <svg {...line} {...p}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
);

export const ChevronRight = (p: P) => (
  <svg {...line} {...p}>
    <path d="M9 5l7 7-7 7" />
  </svg>
);

export const CalendarIcon = (p: P) => (
  <svg {...line} {...p}>
    <path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" />
  </svg>
);

export const MapPinIcon = (p: P) => (
  <svg {...line} {...p}>
    <path d="M12 21s-6.5-6-6.5-11.5a6.5 6.5 0 0 1 13 0C18.5 15 12 21 12 21z" />
    <path d="M12 7.5v4M10 9.5h4" />
  </svg>
);

export const UserIcon = (p: P) => (
  <svg {...line} {...p}>
    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20.5c1.3-3.5 4.2-5.5 7.5-5.5s6.2 2 7.5 5.5" />
  </svg>
);

// -------------------------------------------------------------- fast levels

const FishIcon = (p: P) => (
  <svg {...line} {...p}>
    <path d="M3 12c3-4.5 9-6 14-2l4-3v10l-4-3c-5 4-11 2.5-14-2z" />
  </svg>
);
const DropIcon = (p: P) => (
  <svg {...line} {...p}>
    <path d="M12 3.5s-6 6.6-6 11a6 6 0 0 0 12 0c0-4.4-6-11-6-11z" />
  </svg>
);
const LeafIcon = (p: P) => (
  <svg {...line} {...p}>
    <path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15M5 19l7-7" />
  </svg>
);
const StrictIcon = (p: P) => (
  <svg {...line} {...p}>
    <path d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM6.5 17.5l11-11" />
  </svg>
);
const BreadIcon = (p: P) => (
  <svg {...line} {...p}>
    <path d="M4 11a8 4.5 0 0 1 16 0v8H4z" />
    <path d="M9 9l1.5 3M13 8.5l1.5 3" />
  </svg>
);

export const FAST_ICON: Record<FastLevel, (p: P) => React.ReactElement> = {
  none: BreadIcon,
  fish: FishIcon,
  wineOil: DropIcon,
  fast: LeafIcon,
  strict: StrictIcon,
};
