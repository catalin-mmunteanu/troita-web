import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#5C1321", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="120" height="120" viewBox="0 0 64 64" fill="none" stroke="#FCFAF2" strokeWidth="4.6" strokeLinecap="round">
          <path d="M32 9v46" />
          <path d="M26 16.5h12" />
          <path d="M18.5 26.5h27" />
          <path d="M24.5 46l15-6" />
        </svg>
      </div>
    ),
    size,
  );
}
