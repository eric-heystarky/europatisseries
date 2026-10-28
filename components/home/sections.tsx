"use client";

import { selectShopTab } from "./shop-events";

const DOG_IMG =
  "https://vibe.filesafe.space/1782359074813107391/attachments/17124f1b-7f7c-4903-94c7-7d24968b1d60.png";

const MOSAIC = [
  { name: "Croissants", img: "/images/catering/croissant-flatlay.jpg", span: "col-span-2", ratio: "aspect-[16/10]", tab: "viennoiserie" },
  { name: "Almond Croissant", img: "/images/catering/almond-croissant.jpg", span: "", ratio: "aspect-[4/5]", tab: "viennoiserie" },
  { name: "Tarte au Citron", img: "/images/catering/lemon-tart.jpg", span: "", ratio: "aspect-[4/5]", tab: "cakes" },
  { name: "Gourmet Pies", img: "/images/catering/gourmet-pie.jpg", span: "", ratio: "aspect-[4/5]", tab: "pies" },
  { name: "Cinnamon Scroll", img: "/images/catering/cinnamon-scroll.jpg", span: "", ratio: "aspect-[4/5]", tab: "viennoiserie" },
];

/** Full-bleed photo with one clear call to order. */
export function OrderBanner() {
  return (
    <section className="relative flex h-[560px] flex-col items-center justify-end overflow-hidden text-center text-white md:h-[640px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/hero/croissant.jpg" alt="Croissants fresh from the oven" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div aria-hidden="true" className="absolute inset-0 bg-[rgba(5,9,48,0.36)]" />
      <div className="relative flex max-w-[760px] flex-col items-center gap-[18px] px-6 pb-24 md:pb-28">
        <p className="euro-eyebrow">Pickup &amp; delivery</p>
        <h2 className="euro-heading mr-[-0.16em] text-[clamp(28px,3.2vw,44px)] tracking-[0.16em]">Order online, any time</h2>
        <p className="text-[15px] leading-relaxed">Ready in opening hours — pick up on High St or have it delivered.</p>
        <a
          href="#shop"
          onClick={() => selectShopTab("viennoiserie")}
          className="mt-2.5 flex h-[46px] items-center border border-white px-[34px] text-[11px] font-medium uppercase tracking-[0.2em] transition-colors hover:bg-white hover:text-euro-ink"
        >
          Order now
        </a>
      </div>
    </section>
  );
}

/** Catering pitch beside a photo mosaic of the bestsellers. */
export function EventsSection() {
  return (
    <section id="events" className="flex flex-wrap items-start border-t-4 border-white">
      <div className="flex min-w-0 flex-[1_1_520px] flex-col items-center justify-center gap-[26px] px-6 py-16 text-center md:sticky md:top-0 md:min-h-[760px] md:px-12">
        <p className="euro-eyebrow text-euro-ink">Discover</p>
        <h2 className="euro-heading mr-[-0.14em] max-w-[560px] text-[clamp(28px,2.9vw,42px)] leading-[1.35] text-euro-ink">
          Our custom creations for your events
        </h2>
        <a href="#shop" onClick={() => selectShopTab("catering")} className="btn-euro mt-1.5">
          View catering
        </a>
      </div>
      <div className="grid min-w-0 flex-[1_1_560px] grid-cols-2 gap-2.5 p-2.5 md:pl-0">
        {MOSAIC.map((m) => (
          <a
            key={m.name}
            href="#shop"
            onClick={() => selectShopTab(m.tab)}
            className={`group relative block overflow-hidden ${m.span} ${m.ratio}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.img} alt={m.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
            <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[90px] bg-gradient-to-b from-transparent to-black/45" />
            <span className="absolute inset-x-0 bottom-[22px] text-center text-[13px] font-medium uppercase tracking-[0.06em] text-white">
              {m.name}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

/** Where we are, and that dogs are welcome. */
export function LocationSection() {
  return (
    <section id="location" className="flex flex-wrap items-stretch bg-euro-cream">
      <div className="relative min-h-[320px] min-w-0 flex-[1_1_520px] md:min-h-[560px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={DOG_IMG}
          alt="A cream long-haired dachshund sitting on the café's terracotta floor"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-[1_1_520px] flex-col items-center justify-center gap-5 px-6 py-[72px] text-center md:px-12">
        <p className="euro-eyebrow text-euro-ink">Our location</p>
        <h2 className="euro-heading mr-[-0.2em] text-[clamp(34px,3.6vw,52px)] tracking-[0.2em] text-euro-ink">Armadale</h2>
        <p className="text-sm leading-[1.8] text-euro-soft">
          974 High St, Armadale VIC 3143
          <br />
          Open 7 days, 7am – 3pm
        </p>
        <p className="max-w-[420px] text-sm leading-[1.75] text-euro-text">
          We&apos;re dog friendly — our leafy courtyard is made for lazy mornings with your pup by your side, and water
          bowls are always on the house.
        </p>
        <a
          href="https://maps.google.com/?q=Euro+Patisserie+Armadale"
          target="_blank"
          rel="noreferrer"
          className="btn-euro-outline mt-2 text-euro-ink hover:bg-euro-ink hover:text-white"
        >
          Get directions
        </a>
      </div>
    </section>
  );
}
