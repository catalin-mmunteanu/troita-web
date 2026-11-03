import fs from "node:fs";
import path from "node:path";

/**
 * Real app screenshots, dropped into public/screenshots/ as
 * calendar.png, posturi.png, harta.png, profil.png (or .webp / .jpg).
 * Until a file exists, the page draws that screen from live calendar data.
 */
export type ScreenName = "calendar" | "posturi" | "harta" | "profil";

export function screenshot(name: ScreenName): string | null {
  for (const ext of ["webp", "png", "jpg"]) {
    const rel = `screenshots/${name}.${ext}`;
    if (fs.existsSync(path.join(process.cwd(), "public", rel))) return `/${rel}`;
  }
  return null;
}
