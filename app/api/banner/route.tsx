import { ImageResponse } from "next/og";

/**
 * On-demand 1080×1080 social banner: a menu photo with a navy gradient and
 * brand promo text. Query params: title, sub, img (photo URL).
 * Dev-only helper for generating marketing assets — not linked from the site.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "ORDER ONLINE NOW";
  const sub = searchParams.get("sub") ?? "Pickup or delivery · Armadale";
  const img = searchParams.get("img") ?? "";

  return new ImageResponse(
    (
      <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", background: "#050930" }}>
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt="" style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
        ) : null}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            background: "linear-gradient(to bottom, rgba(5,9,48,0.25) 35%, rgba(5,9,48,0.95) 100%)",
          }}
        />
        <div style={{ position: "absolute", top: 56, left: 64, display: "flex", color: "#e9ecf8", fontSize: 26, letterSpacing: 6, textTransform: "uppercase", fontWeight: 700 }}>
          Euro Patisserie · Armadale
        </div>
        <div style={{ position: "absolute", left: 64, right: 64, bottom: 72, display: "flex", flexDirection: "column", color: "#e9ecf8" }}>
          <div style={{ fontSize: 92, fontWeight: 800, lineHeight: 1.02, textTransform: "uppercase", letterSpacing: -1 }}>
            {title}
          </div>
          <div style={{ fontSize: 36, marginTop: 18, opacity: 0.9 }}>{sub}</div>
        </div>
      </div>
    ),
    { width: 1080, height: 1080 },
  );
}
