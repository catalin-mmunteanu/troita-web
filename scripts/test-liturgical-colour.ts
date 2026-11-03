// Checks the liturgical colour of known days. Run: npm run test
import { getDay } from "../src/lib/calendar";
import { ymd } from "../src/lib/dates";
import { liturgicalColour } from "../src/lib/liturgical-colour";
const cases: [number,number,number,string|null][] = [
 [2026,4,5,"green"],[2026,5,31,"green"],[2026,6,1,"green"],[2026,4,12,"red"],[2026,9,14,"red"],
 [2026,12,25,"gold"],[2026,1,6,"gold"],[2026,10,25,"gold"],[2026,8,15,"blue"],[2026,11,8,"blue"],
 [2026,3,4,"purple"],[2026,11,21,"blue"],[2026,3,25,"blue"],[2026,10,26,"red"],[2026,10,24,null],
];
let bad=0;
for (const [y,m,d,exp] of cases){ const r=liturgicalColour(getDay(ymd(y,m,d))); const ok=(r?.colour??null)===exp; if(!ok) bad++; if(!ok) console.log("BAD", `${d}.${m}.${y}`, r?.colour, r?.label); }
const c: Record<string,number>={}; for(let m=1;m<=12;m++) for(let d=1;d<=31;d++){ const dt=ymd(2026,m,d); if(dt.m!==m) continue; const r=liturgicalColour(getDay(dt)); c[r?.colour??"none"]=(c[r?.colour??"none"]??0)+1; }
console.log(c, "bad:", bad, "of", cases.length);
if (bad > 0) process.exit(1);
