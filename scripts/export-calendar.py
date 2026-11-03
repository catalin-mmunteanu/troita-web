#!/usr/bin/env python3
"""Export the calendar from the app's seed database into data/seed-export.json.

The website reads the same data the Android app ships, so the two can never
disagree. Run this whenever the app's seed is rebuilt (tool/update_data.py):

    python3 scripts/export-calendar.py ../troita/android/app/src/main/assets/seed/churches.db

Only facts are exported: commemoration names, ranks, fasting levels, Sunday
pericopes. The sinaxar texts and saint images are NOT exported: they belong to
the sites they were taken from and stay inside the app.
"""
from __future__ import annotations

import json
import os
import re
import sqlite3
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "data", "seed-export.json")

# A handful of scraped notes carry the source page's JavaScript (analytics
# snippets, button handlers). Any segment containing code-like characters is
# dropped; real Romanian notes never contain them.
_JUNK = re.compile(r"[\"'\[\]{}=|\\/<>]|window|script|\bpdf", re.IGNORECASE)


def clean_notes(raw: str | None) -> str | None:
    if not raw:
        return None
    parts = [p.strip() for p in raw.split(";")]
    # Real notes always start with a capital ("Post", "Zi aliturgică");
    # leftovers like "!isOpen" or "a,m" never do.
    keep = [p for p in parts if len(p) > 2 and p[0].isupper() and not _JUNK.search(p)]
    return "; ".join(keep) or None


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    db = sqlite3.connect(sys.argv[1])
    db.row_factory = sqlite3.Row

    meta = {r["key"]: r["value"] for r in db.execute("SELECT key, value FROM meta")}

    feasts = [
        {
            "monthDay": r["month_day"],
            "movableKey": r["movable_key"],
            "name": r["name"],
            "rank": r["rank"],
            "kind": r["kind"],
            "note": clean_notes(r["note"]),
            "dezlegare": r["dezlegare"],
        }
        for r in db.execute("SELECT * FROM feasts ORDER BY id")
    ]

    overrides = []
    for r in db.execute("SELECT * FROM day_overrides ORDER BY year, month_day"):
        row = {
            "year": r["year"],
            "monthDay": r["month_day"],
            "fastLevel": r["fast_level"],
            "notes": clean_notes(r["notes"]),
            "glas": r["glas"],
            "voscreasna": r["voscreasna"],
            "sundayTitle": r["sunday_title"],
            "sundaySubtitle": r["sunday_subtitle"],
            "apostol": r["apostol"],
            "evanghelie": r["evanghelie"],
        }
        # Skip rows that carry nothing.
        if any(v is not None for k, v in row.items() if k not in ("year", "monthDay")):
            overrides.append({k: v for k, v in row.items() if v is not None})

    out = {
        "seedVersion": meta.get("seed_version"),
        "publishedYears": [int(y) for y in meta.get("published_years", "").split(",") if y],
        "feasts": feasts,
        "overrides": overrides,
    }
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print(f"{len(feasts)} feasts, {len(overrides)} overrides, years {out['publishedYears']} -> {OUT}")


if __name__ == "__main__":
    main()
