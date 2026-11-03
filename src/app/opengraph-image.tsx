import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Troița: calendarul ortodox, zi de zi. În curând pe Google Play.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const font = (f: string) => readFile(join(process.cwd(), "src/assets/og", f));

// Read once at module load, so the image is generated at build time.
const [b, bx, r, rx] = await Promise.all([
  font("fraunces-latin-700-normal.woff"),
  font("fraunces-latin-ext-700-normal.woff"),
  font("fraunces-latin-400-normal.woff"),
  font("fraunces-latin-ext-400-normal.woff"),
]);

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FCFAF2",
          padding: "72px 80px",
          fontFamily: "Fraunces, FrauncesExt",
          borderBottom: "18px solid #5C1321",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "#5C1321",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#FCFAF2" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2.5v19" />
              <path d="M9.5 5.5h5" />
              <path d="M6.5 9.5h11" />
              <path d="M9 17.5l6-2.4" />
            </svg>
          </div>
          <div style={{ fontSize: 52, fontWeight: 700, color: "#5C1321" }}>Troița</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 700, color: "#5C1321", lineHeight: 1.02, letterSpacing: -2 }}>
            Calendarul ortodox,
          </div>
          <div style={{ fontSize: 92, fontWeight: 700, color: "#5C1321", lineHeight: 1.02, letterSpacing: -2 }}>
            zi de zi.
          </div>
          <div style={{ marginTop: 28, fontSize: 34, color: "#6B5E4F" }}>
            Sfântul zilei · Posturi și dezlegări · Harta bisericilor
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 28px",
              borderRadius: 999,
              background: "#F5EFCF",
              border: "2px solid #C59B27",
              color: "#5C1321",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            <div style={{ width: 14, height: 14, borderRadius: 7, background: "#C59B27" }} />
            În curând pe Google Play
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: b, weight: 700, style: "normal" },
        { name: "FrauncesExt", data: bx, weight: 700, style: "normal" },
        { name: "Fraunces", data: r, weight: 400, style: "normal" },
        { name: "FrauncesExt", data: rx, weight: 400, style: "normal" },
      ],
    },
  );
}
