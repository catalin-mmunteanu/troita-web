#!/usr/bin/env node
/**
 * Design guard: fails the build when code breaks the DESIGN.MD ban list.
 * Runs automatically before `next build` (the "prebuild" script), so a
 * banned pattern can't reach Vercel. Run by hand: npm run lint:design
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SRC = join(ROOT, "src");

const RULES = [
  { re: /\brounded-full\b/, why: "pill shapes (DESIGN.MD ban 4, §5: 8px max)" },
  { re: /\brounded(?:-[a-z]+)?-\[(\d+(?:\.\d+)?)px\]/, test: (m) => Number(m[1]) > 8, why: "radius over 8px (ban 7, §5)" },
  { re: /\bshadow-(?:sm|md|lg|xl|2xl|inner|\[)/, why: "shadows other than shadow-micro (§5)" },
  { re: /\b(?:backdrop-)?blur(?:-[a-z0-9]+)?\b/, why: "blur and glow effects (§5)" },
  { re: /\bbg-(?:gradient|linear|radial|conic)-|\b(?:linear|radial|conic)-gradient\(/, why: "gradients (ban 2)" },
  { re: /\b(?:Inter|Geist|Space Grotesk|Fraunces)\b/, why: "banned or replaced font (ban 1, §3)" },
  // Emoji (ban 8), and the ☦ glyph, which the fonts lack and systems draw as an emoji.
  { re: /(?![©®™])\p{Extended_Pictographic}/u, why: "emoji or pictographic character; draw it as SVG (ban 8)" },
];

const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|css|mjs)$/.test(name)) files.push(p);
  }
})(SRC);

let problems = 0;
for (const file of files) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    // Comments may name banned things to explain why they are banned.
    const code = line.replace(/\/\/.*$/, "").replace(/\/\*.*?\*\//g, "").replace(/^\s*\*.*$/, "");
    for (const rule of RULES) {
      const m = code.match(rule.re);
      if (m && (!rule.test || rule.test(m))) {
        problems++;
        console.error(`${relative(ROOT, file)}:${i + 1}  ${rule.why}\n    ${line.trim().slice(0, 140)}`);
      }
    }
  });
}

if (problems) {
  console.error(`\nDesign guard: ${problems} problem(s). See DESIGN.MD.`);
  process.exit(1);
}
console.log(`Design guard: ${files.length} files checked, no DESIGN.MD violations.`);
