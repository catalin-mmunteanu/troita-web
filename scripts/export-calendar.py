#!/usr/bin/env python3
"""Export the calendar from the app's seed database into data/seed-export.json.

The website reads the same data the Android app ships, so the two can never
disagree. Run this whenever the app's seed is rebuilt (tool/update_data.py):

    python3 scripts/export-calendar.py ../troita/android/app/src/main/assets/seed/churches.db \
        [--golden ../troita/test/golden/engine-2026-2030.json]

The CI workflow .github/workflows/sync-app-data.yml runs exactly this against
the app repo's master branch and opens a pull request with the result.

--golden copies the engine's golden test vectors to data/engine-golden.json,
which `npm test` checks the TypeScript engine against.

Only facts are exported: commemoration names, ranks, fasting levels, Sunday
pericopes. The sinaxar texts and saint images are NOT exported: they belong to
the sites they were taken from and stay inside the app.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import sqlite3

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "data", "seed-export.json")
GOLDEN_OUT = os.path.join(HERE, "..", "data", "engine-golden.json")

# Same constant as tool/build_seed.py in the app repo. Used only for seeds built
# before the app wrote `computed_years` into meta.
CALENDAR_UNTIL = 2030

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


def years(meta: dict, key: str) -> list[int]:
    return [int(y) for y in (meta.get(key) or "").split(",") if y.strip()]


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("db")
    ap.add_argument("--golden", help="the app repo's test/golden/engine-2026-2030.json")
    args = ap.parse_args()
    db = sqlite3.connect(args.db)
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

    published = years(meta, "published_years")
    computed = years(meta, "computed_years") if "computed_years" in meta else [
        y for y in range((published[-1] + 1) if published else 2026, CALENDAR_UNTIL + 1)
        if y not in published]
    out = {
        "seedVersion": meta.get("seed_version"),
        "publishedYears": published,
        "computedYears": computed,
        "feasts": feasts,
        "overrides": overrides,
    }
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print(f"{len(feasts)} feasts, {len(overrides)} overrides, published {published}, "
          f"computed {computed} -> {OUT}")
    if args.golden:
        shutil.copyfile(args.golden, GOLDEN_OUT)
        print(f"golden vectors -> {GOLDEN_OUT}")


if __name__ == "__main__":
    main()
