const FEATURES = [
  { icon: "🚲", title: "Delivery (D+1)", body: "By courier across Melbourne" },
  { icon: "🏪", title: "In-store", body: "Tues–Sun 7am–3pm" },
  { icon: "📍", title: "Click & Collect", body: "Order before 8pm, collect from 10am" },
  { icon: "🔒", title: "Secure Payment", body: "Card payments via Square" },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t-2 border-border bg-primary text-primary-foreground">
      {/* Features bar */}
      <div className="grid grid-cols-2 divide-border border-b-2 border-primary-foreground/20 md:grid-cols-4 md:divide-x-2">
        {FEATURES.map((f) => (
          <div key={f.title} className="px-5 py-6 text-center">
            <div className="text-2xl">{f.icon}</div>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.15em]">{f.title}</p>
            <p className="mt-1 text-xs text-primary-foreground/60">{f.body}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 px-5 py-12 md:grid-cols-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground/60">
            Our Location
          </h3>
          <p className="mt-3 font-semibold">Armadale</p>
          <p className="mt-1 text-sm text-primary-foreground/70">974 High St, Armadale VIC 3143</p>
          <a
            href="https://maps.google.com/?q=Euro+Patisserie+Armadale"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-xs font-bold uppercase tracking-[0.15em] underline underline-offset-4"
          >
            View on map
          </a>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground/60">
            Hours
          </h3>
          <p className="mt-3 text-sm text-primary-foreground/70">Tues–Sun · 7am–3pm</p>
          <p className="text-sm text-primary-foreground/70">Monday · Closed</p>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground/60">
            Follow Us
          </h3>
          <div className="mt-3 flex flex-col gap-1 text-sm">
            <a href="https://instagram.com/europatisseriearmadale" className="underline underline-offset-4">
              Instagram
            </a>
            <a href="https://tiktok.com/@europatisseriearmadale" className="underline underline-offset-4">
              TikTok
            </a>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-primary-foreground/20 px-5 py-5 text-center">
        <p className="text-xl font-extrabold uppercase tracking-[0.25em]">Euro Patisserie</p>
        <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-primary-foreground/50">
          Powered by HeyStarky AU
        </p>
      </div>
    </footer>
  );
}
