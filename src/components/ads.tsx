"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ADS } from "@/lib/site";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
    googlefc?: { callbackQueue: unknown[]; showRevocationMessage?: () => void };
  }
}

/**
 * One responsive display ad, labelled as advertising. Renders nothing until
 * AdSense is configured in src/lib/site.ts. Space is reserved up front so the
 * page doesn't jump when the ad arrives (layout shift hurts Core Web Vitals).
 */
export function AdSlot({ slot = ADS.slots.inContent }: { slot?: string | null }) {
  const pathname = usePathname();
  const ref = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!ADS.client || !slot || !ref.current) return;
    // Each <ins> may be filled once; client-side navigation remounts it.
    if (ref.current.getAttribute("data-adsbygoogle-status")) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ad blockers and unfilled slots are normal; the page works without ads.
    }
  }, [pathname, slot]);

  if (!ADS.client || !slot) return null;

  return (
    <aside aria-label="Publicitate" className="mx-auto my-10 max-w-3xl px-4 sm:px-6">
      <p className="mb-1.5 text-center text-[11px] uppercase tracking-[0.14em] text-muted/80">Publicitate</p>
      <div className="min-h-[280px] overflow-hidden rounded-[14px] bg-surface-subtle">
        <ins
          key={pathname}
          ref={ref}
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={ADS.client}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
}

/**
 * Reopens Google's consent message so visitors can change their choice, which
 * GDPR requires to be as easy as giving it. Shown only when AdSense is on.
 */
export function CookieSettingsButton({ className = "" }: { className?: string }) {
  if (!ADS.client) return null;
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        window.googlefc = window.googlefc || { callbackQueue: [] };
        window.googlefc.callbackQueue.push(() => window.googlefc?.showRevocationMessage?.());
      }}
    >
      Preferințe cookie
    </button>
  );
}
