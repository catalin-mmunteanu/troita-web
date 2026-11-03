import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Troița: calendarul ortodox, zi de zi. În curând pe Google Play.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const font = (f: string) => readFile(join(process.cwd(), "src/assets/og", f));

// Read once at module load, so the image is generated at build time.
const [lb, lbx, lr, lrx, m, mx] = await Promise.all([
  font("literata-latin-700-normal.woff"),
  font("literata-latin-ext-700-normal.woff"),
  font("literata-latin-400-normal.woff"),
  font("literata-latin-ext-400-normal.woff"),
  font("jetbrains-mono-latin-500-normal.woff"),
  font("jetbrains-mono-latin-ext-500-normal.woff"),
]);

const PARCHMENT = "#FDFBF7";
const INK = "#1A1817";
const UMBER = "#574F4A";
const OAK = "#E2D8C8";
const RED = "#8B1E1E";
const GOLD = "#D4AF37";

/** Same rules as the site: parchment, oak hairlines, a 3px liturgical bar, no gradients. */
export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: PARCHMENT, padding: 44, fontFamily: "Literata, LiterataExt" }}>
        <div style={{ display: "flex", flex: 1, border: `2px solid ${OAK}`, borderRadius: 4, position: "relative", padding: "44px 60px", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, background: GOLD }} />
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width="60" height="60" viewBox="0 0 36 36" fill="none">
              <path d="M6.5 11.5 18 3.5l11.5 8" stroke={RED} strokeWidth="2.2" />
              <rect x="16.3" y="7" width="3.4" height="27" fill={RED} />
              <rect x="13.8" y="9.6" width="8.4" height="2.2" fill={RED} />
              <rect x="8" y="14" width="20" height="3.2" fill={RED} />
              <path d="m12.3 26.4 11.6-4.2.9 2.3-11.6 4.2z" fill={RED} />
              <path d="M10.5 34.2h15" stroke={RED} strokeWidth="1.4" />
            </svg>
            <div style={{ fontSize: 48, fontWeight: 700, color: INK }}>Troița</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Mono, MonoExt", fontSize: 24, letterSpacing: 2, color: RED, textTransform: "uppercase" }}>
              Calendar ortodox românesc
            </div>
            <div style={{ fontSize: 68, fontWeight: 700, color: INK, lineHeight: 1.1, marginTop: 12 }}>
              Calendarul ortodox, zi de zi
            </div>
            <div style={{ fontSize: 30, color: UMBER, marginTop: 16 }}>
              Sfântul zilei · posturi și dezlegări · harta bisericilor
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "Mono, MonoExt", fontSize: 24, letterSpacing: 2, color: UMBER, textTransform: "uppercase" }}>
            <div style={{ width: 14, height: 14, background: GOLD }} />
            Android · în curând pe Google Play
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Literata", data: lb, weight: 700, style: "normal" },
        { name: "LiterataExt", data: lbx, weight: 700, style: "normal" },
        { name: "Literata", data: lr, weight: 400, style: "normal" },
        { name: "LiterataExt", data: lrx, weight: 400, style: "normal" },
        { name: "Mono", data: m, weight: 500, style: "normal" },
        { name: "MonoExt", data: mx, weight: 500, style: "normal" },
      ],
    },
  );
}
