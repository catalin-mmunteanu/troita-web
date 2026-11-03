"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon } from "./icons";

const MONTHS = [
  "ianuarie", "februarie", "martie", "aprilie", "mai", "iunie",
  "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie",
];

/**
 * DESIGN.MD §6: a date quick-jump on the right of the header. Opens the
 * browser's own date picker and goes to that day in the month calendar.
 */
export function DateJump({ min, max }: { min: string; max: string }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);

  function open() {
    const el = input.current;
    if (!el) return;
    try {
      el.showPicker();
    } catch {
      el.focus();
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={open}
        className="flex h-10 items-center gap-2 rounded-sm border border-oak bg-surface px-2.5 font-ui text-[16px] font-medium text-ink transition-colors hover:border-umber sm:px-3"
      >
        <CalendarIcon width={18} height={18} />
        <span className="hidden md:inline">Mergi la o dată</span>
        <span className="sr-only md:hidden">Mergi la o dată din calendar</span>
      </button>
      <input
        ref={input}
        type="date"
        min={min}
        max={max}
        tabIndex={-1}
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 h-px w-px opacity-0"
        onChange={(e) => {
          const [y, m, d] = e.target.value.split("-").map(Number);
          if (!y || !m || !d) return;
          router.push(`/calendar-ortodox/${y}/${MONTHS[m - 1]}#ziua-${d}`);
        }}
      />
    </div>
  );
}
