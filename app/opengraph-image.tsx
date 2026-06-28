import { ImageResponse } from "next/og";

// Branded social-share card (used for og:image and twitter:image).
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Euro Patisserie Armadale — European pastries, cakes & catering";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "84px",
          background: "#050930",
          color: "#e9ecf8",
          fontFamily: "sans-serif",
          border: "16px solid #e9ecf8",
        }}
      >
        <div style={{ fontSize: 30, letterSpacing: 10, textTransform: "uppercase", opacity: 0.65 }}>
          Armadale · Order Online
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 124,
            fontWeight: 800,
            lineHeight: 1.02,
            marginTop: 22,
            textTransform: "uppercase",
            letterSpacing: -2,
          }}
        >
          <span>Euro</span>
          <span>Patisserie</span>
        </div>
        <div style={{ fontSize: 36, marginTop: 30, opacity: 0.88 }}>
          European pastries, cakes &amp; catering · Pickup or delivery
        </div>
      </div>
    ),
    { ...size },
  );
}
