"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";
const KEY = "troita-theme";
const EVENT = "troita-theme-change";

/**
 * Runs in <head> before the page paints, so a saved choice never flashes the
 * other theme first. Without a saved choice the site follows the device.
 */
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem("${KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

function current(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** The theme lives outside React: data-theme on <html>, or the device setting. */
function subscribe(onChange: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    mq.removeEventListener("change", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

/** Light / dark switch in the header corner. Rectangular, per DESIGN.MD. */
export function ThemeToggle() {
  // null on the server, which can't know the visitor's theme.
  const theme = useSyncExternalStore<Theme | null>(subscribe, current, () => null);

  function toggle() {
    const next: Theme = current() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // Private mode or blocked storage: the choice lasts for this page only.
    }
    window.dispatchEvent(new Event(EVENT));
  }

  const label = theme === "dark" ? "Treci la tema deschisă" : "Treci la tema întunecată";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="grid h-9 w-9 shrink-0 place-items-center sm:h-10 sm:w-10 rounded-sm border border-oak bg-surface text-ink transition-colors hover:border-umber"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

const svg = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "square" as const,
  "aria-hidden": true,
};

const SunIcon = () => (
  <svg {...svg}>
    <path d="M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z" />
    <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
  </svg>
);

const MoonIcon = () => (
  <svg {...svg}>
    <path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z" />
  </svg>
);
