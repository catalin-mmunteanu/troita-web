import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#FDFBF7", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="132" height="132" viewBox="0 0 36 36" fill="#8B1E1E">
          <path d="M6.5 11.5 18 3.5l11.5 8" fill="none" stroke="#8B1E1E" strokeWidth="2.6" />
          <rect x="16.1" y="7" width="3.8" height="26" />
          <rect x="13.6" y="9.6" width="8.8" height="2.4" />
          <rect x="7.5" y="14" width="21" height="3.6" />
          <path d="m12 26.4 12-4.4 1 2.5-12 4.4z" />
          <rect x="10" y="33" width="16" height="1.8" />
        </svg>
      </div>
    ),
    size,
  );
}
