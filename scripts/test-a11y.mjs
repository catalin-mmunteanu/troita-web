#!/usr/bin/env node
// Accessibility check: axe-core against WCAG 2.2 A/AA on every kind of page,
// in light and dark mode, at phone and desktop width, plus a reflow check at
// 320px. Runs against a started
// production build (CI: npm run build && npm start, then this).
//
//   node scripts/test-a11y.mjs [base-url]     default http://localhost:3000
//
// Uses an installed Chrome (CHROME_PATH, or the usual locations), so no
// browser download is needed: GitHub's ubuntu runners have google-chrome.
// Automated checks find only part of the problems; see ACCESSIBILITY.md.
import { existsSync } from "node:fs";
import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";

const base = process.argv[2] ?? "http://localhost:3000";
const PAGES = [
  "/",
  "/azi",
  "/calendar-ortodox",
  "/calendar-ortodox/2026",
  "/calendar-ortodox/2026/noiembrie",
  "/calendar-ortodox/2028/aprilie",
  "/posturi",
  "/posturi/2026",
  "/posturi/2026/postul-craciunului",
  "/despre",
  "/confidentialitate",
  "/pagina-inexistenta",
];
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const VIEWPORTS = [
  { name: "telefon", width: 390, height: 844 },
  { name: "desktop", width: 1280, height: 900 },
];

const chrome = [
  process.env.CHROME_PATH,
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].find((p) => p && existsSync(p));
if (!chrome) {
  console.error("No Chrome found. Set CHROME_PATH.");
  process.exit(2);
}

const browser = await chromium.launch({ executablePath: chrome, args: ["--no-sandbox"] });
let bad = 0;
for (const scheme of ["light", "dark"]) {
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ colorScheme: scheme, viewport: vp });
    const page = await ctx.newPage();
    for (const path of PAGES) {
      await page.goto(base + path, { waitUntil: "networkidle" });
      const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
      for (const v of violations) {
        bad += v.nodes.length;
        console.log(`✗ ${scheme}/${vp.name} ${path}: ${v.id} (${v.impact}) ${v.help}`);
        for (const n of v.nodes.slice(0, 3)) console.log(`    ${n.target.join(" ")}  ${n.html.slice(0, 140)}`);
      }
    }
    await ctx.close();
  }
}
// WCAG 1.4.10 Reflow: at 320 CSS px nothing may scroll sideways (tables in
// their own scroll box are allowed; the page itself is not).
{
  const ctx = await browser.newContext({ viewport: { width: 320, height: 640 } });
  const page = await ctx.newPage();
  for (const path of PAGES) {
    await page.goto(base + path, { waitUntil: "networkidle" });
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    if (width > 320) {
      bad++;
      console.log(`✗ reflow ${path}: page is ${width}px wide at 320px`);
    }
  }
  await ctx.close();
}

await browser.close();
const runs = PAGES.length * VIEWPORTS.length * 2;
console.log(`Accessibility (axe, WCAG 2.2 AA): ${runs} page checks + reflow at 320px on ${PAGES.length} pages, ${bad} problems.`);
if (bad > 0) process.exit(1);
