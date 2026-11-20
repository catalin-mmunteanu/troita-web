#!/usr/bin/env node
// design/tokens.json is the single source of the design tokens for the site
// and the Android app.
//
//   node scripts/tokens.mjs --check          globals.css matches tokens.json (npm test)
//   node scripts/tokens.mjs --dart <file>    write the app's lib/app/design_tokens.dart
//
// The CSS stays hand-written (it also holds the Tailwind theme and the
// dark-mode selectors); --check fails the build when a value there drifts from
// tokens.json. The Dart file is generated and committed in the app repo.
import { readFileSync, writeFileSync } from "node:fs";

const tokens = JSON.parse(readFileSync(new URL("../design/tokens.json", import.meta.url), "utf8"));
const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");

function cssBlock(selector) {
  const i = css.indexOf(selector);
  if (i < 0) throw new Error(`globals.css has no ${selector}`);
  const body = css.slice(i, css.indexOf("}", i));
  return Object.fromEntries([...body.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2].toUpperCase()]));
}

function check() {
  const problems = [];
  const blocks = {
    light: [cssBlock(":root {")],
    // Dark mode is written twice: the explicit switch and the media query.
    dark: [cssBlock(':root[data-theme="dark"] {'), cssBlock(':root:not([data-theme="light"]) {')],
  };
  for (const mode of ["light", "dark"]) {
    const want = tokens.color[mode];
    for (const css of blocks[mode]) {
      for (const [name, value] of Object.entries(want)) {
        if (css[name] !== value) problems.push(`${mode} --${name}: css ${css[name] ?? "missing"}, tokens ${value}`);
      }
      for (const name of Object.keys(css)) {
        if (!(name in want)) problems.push(`${mode} --${name} is in globals.css but not in tokens.json`);
      }
    }
  }
  if (problems.length) {
    console.log("Design tokens: globals.css differs from design/tokens.json\n  " + problems.join("\n  "));
    process.exit(1);
  }
  console.log(`Design tokens: globals.css matches design/tokens.json (${Object.keys(tokens.color.light).length} colours, light and dark).`);
}

const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const argb = (hex) => `Color(0xFF${hex.slice(1).toUpperCase()})`;

function dart(out) {
  const lines = [];
  const colours = (cls, doc, light, dark) => {
    lines.push(`/// ${doc}`, `abstract final class ${cls} {`);
    for (const [name, value] of Object.entries(light)) {
      lines.push(`  static const Color ${camel(name)} = ${argb(value)};`);
      if (dark?.[name]) lines.push(`  static const Color ${camel(name)}Dark = ${argb(dark[name])};`);
    }
    lines.push("}", "");
  };
  lines.push(
    "// GENERATED from troita-web/design/tokens.json by",
    "// `node scripts/tokens.mjs --dart <this file>`. Do not edit by hand:",
    "// change tokens.json in troita-web, regenerate, commit both.",
    "",
    "import 'package:flutter/painting.dart';",
    "",
  );
  colours("TroitaTokens", "Colours shared with the website (DESIGN.MD §4–§6). `…Dark` is the dark-mode value.", tokens.color.light, tokens.color.dark);
  colours("TroitaAppTokens", "App-only colours (no web counterpart).", tokens.app.light, tokens.app.dark);
  lines.push("/// Font families (DESIGN.MD §3). The first entry is the bundled font; the rest", "/// are fallbacks.", "abstract final class TroitaTokenFonts {");
  for (const [role, families] of Object.entries(tokens.font)) {
    lines.push(`  static const String ${role} = '${families[0]}';`);
  }
  lines.push("}", "", "/// Corner radii (DESIGN.MD §5: 4px by default, 8px at most).", "abstract final class TroitaTokenRadius {");
  for (const [name, value] of Object.entries(tokens.radius)) lines.push(`  static const double ${name} = ${value.toFixed(1)};`);
  lines.push("", "  /// The liturgical-colour bar on the left of a commemoration card.", `  static const double liturgicalBar = ${tokens.bar.liturgical.toFixed(1)};`, "}", "");
  writeFileSync(out, lines.join("\n"));
  console.log(`wrote ${out}`);
}

const [flag, arg] = process.argv.slice(2);
if (flag === "--check") check();
else if (flag === "--dart" && arg) dart(arg);
else {
  console.log("usage: node scripts/tokens.mjs --check | --dart <file>");
  process.exit(2);
}
