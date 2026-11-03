"use client";

import { useEffect } from "react";

/**
 * Marks today's row in a statically generated month list. Done in the browser
 * so the calendar pages can stay fully static and cached at the edge.
 */
export function TodayMarker() {
  useEffect(() => {
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Bucharest",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
    document.querySelectorAll(`[data-date="${today}"]`).forEach((el) => {
      el.setAttribute("data-today", "true");
      el.setAttribute("aria-current", "date");
    });
  }, []);
  return null;
}
