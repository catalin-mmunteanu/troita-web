// Every day of 2026–2030 against the golden vectors written by the app repo
// (troita: tool/engine_golden.py → test/golden/engine-2026-2030.json, copied
// here as data/engine-golden.json by the data sync). The Dart engine is tested
// against the same file, so the two engines cannot drift apart unnoticed.
// Run: npm test
import golden from "../data/engine-golden.json";
import { dayFor, parseRank, pascha, type FastLevel } from "../src/lib/liturgical";
import { iso } from "../src/lib/dates";

const LEVELS = new Set(["none", "fish", "wineOil", "fast", "strict"]);
let bad = 0;

for (const [year, want] of Object.entries(golden.pascha)) {
  const got = iso(pascha(Number(year)));
  if (got !== want) {
    bad++;
    console.log("BAD pascha", year, got, "want", want);
  }
}

for (const row of golden.days as (string | number | null)[][]) {
  const [date, rank, dz, level, period, glas, vos] = row;
  const [y, m, d] = String(date).split("-").map(Number);
  const dezlegare = LEVELS.has(String(dz)) ? (dz as FastLevel) : null;
  const r = dayFor({ y, m, d }, parseRank(rank as string), dezlegare);
  const got = [r.fastLevel, r.period?.kind ?? null, r.glas, r.voscreasna].join("|");
  const want = [level, period, glas, vos].join("|");
  if (got !== want) {
    bad++;
    if (bad <= 20) console.log("BAD", date, "got", got, "want", want);
  }
}

console.log(`engine golden: ${golden.days.length} days, bad: ${bad}`);
if (bad > 0) process.exit(1);
