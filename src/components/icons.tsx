import type { SVGProps } from "react";
import type { FastLevel } from "@/lib/liturgical";

type P = SVGProps<SVGSVGElement>;
const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Three-bar Orthodox cross, the mark of the app. */
export const CrossIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 2.5v19" />
    <path d="M9.5 5.5h5" />
    <path d="M6.5 9.5h11" />
    <path d="M9 17.5l6-2.4" />
  </svg>
);

export const CalendarIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
);

export const MapPinIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

export const UserIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20.5c1.4-3.6 4.4-5.5 8-5.5s6.6 1.9 8 5.5" />
  </svg>
);

export const BellIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" />
    <path d="M10 20.5a2 2 0 0 0 4 0" />
  </svg>
);

export const LockIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="5" y="10.5" width="14" height="10" rx="2" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
  </svg>
);

export const PhoneIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
    <path d="M11 18.5h2" />
  </svg>
);

export const ArrowIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ChevronLeft = (p: P) => (
  <svg {...base} {...p}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
);

export const ChevronRight = (p: P) => (
  <svg {...base} {...p}>
    <path d="M9 5l7 7-7 7" />
  </svg>
);

// ------------------------------------------------------------- fast levels

const FishIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 12c3-4.5 9-6 14-2l4-3v10l-4-3c-5 4-11 2.5-14-2z" />
    <circle cx="8" cy="11" r="0.6" fill="currentColor" />
  </svg>
);
const DropIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3.5s-6 6.6-6 11a6 6 0 0 0 12 0c0-4.4-6-11-6-11z" />
  </svg>
);
const EggIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3c-3.6 0-6.5 5.8-6.5 10.5a6.5 6.5 0 0 0 13 0C18.5 8.8 15.6 3 12 3z" />
  </svg>
);
const LeafIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15" />
    <path d="M5 19l7-7" />
  </svg>
);
const StrictIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8" />
    <path d="M6.5 17.5l11-11" />
  </svg>
);
const PlateIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 21V3c-2 1.5-3 4-3 7h3" />
  </svg>
);

export const FAST_ICON: Record<FastLevel, (p: P) => React.ReactElement> = {
  none: PlateIcon,
  dairy: EggIcon,
  fish: FishIcon,
  wineOil: DropIcon,
  fast: LeafIcon,
  strict: StrictIcon,
};
