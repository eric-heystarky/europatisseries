"use client";

import { useEffect, useRef, useState } from "react";
import { selectShopTab } from "./shop-events";

/** Hero slides — each collection name links to its tab in the shop below. */
const SLIDES = [
  { name: "Artisan Cakes", img: "/images/hero/artisan-cakes.jpg", alt: "Artisan cakes, tarts and mille-feuille on a table", tab: "cakes" },
  { name: "Le Croissant", img: "/images/hero/croissant.jpg", alt: "Croissants fresh from the oven", tab: "viennoiserie" },
  { name: "Éclairs", img: "/images/hero/eclairs.jpg", alt: "A row of éclairs", tab: "cakes" },
  // Placeholder photo until the 5 Nov shoot (baguettes replace focaccia).
  { name: "Baguettes", img: "/images/hero/focaccia.jpg", alt: "Filled baguettes and savouries", tab: "baguettes" },
  { name: "Grab & Go", img: "/images/hero/grab-go.jpg", alt: "A golden steak pie", tab: "pies" },
];

const SWIPE_PX = 40;

/**
 * Full-bleed photo with the collections over it. Slides change every 5s.
 * Desktop: the full list — hovering a name shows its photo and holds the rotation.
 * Phones: the same stacked list with dots and Order now; swipe left/right moves the highlight.
 * The header floats over this (see navbar), so the hero sits flush under the announcement line.
 */
export function Hero() {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hold, setHold] = useState(false);
  const touchX = useRef<number | null>(null);

  // Restarts whenever the slide changes, so a swipe gets a full 5s before the next auto-advance.
  useEffect(() => {
    if (paused || hold) return;
    const id = setTimeout(() => setSlide((s) => (s + 1) % SLIDES.length), 5000);
    return () => clearTimeout(id);
  }, [slide, paused, hold]);

  const step = (d: number) => setSlide((s) => (s + d + SLIDES.length) % SLIDES.length);
  const current = SLIDES[slide];

  return (
    <section
      id="top"
      aria-label="Les Collections"
      className="relative flex h-[calc(100svh-36px)] max-h-[900px] min-h-[560px] touch-pan-y flex-col overflow-hidden bg-euro-ink text-white"
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > SWIPE_PX) step(dx < 0 ? 1 : -1);
      }}
    >
      {SLIDES.map((s, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={s.img}
          src={s.img}
          alt={s.alt}
          aria-hidden={i !== slide}
          fetchPriority={i === 0 ? "high" : undefined}
          className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] ease-out [transition-duration:1.2s,7s]"
          style={{ opacity: i === slide ? 1 : 0, transform: `scale(${i === slide ? 1.06 : 1})` }}
        />
      ))}
      <div aria-hidden="true" className="absolute inset-0 bg-[rgba(5,9,48,0.36)]" />

      <h1 className="sr-only">Euro Patisserie — European pastries, cakes &amp; catering in Armadale</h1>
      <div className="relative z-[1] flex flex-1 flex-col items-center justify-center gap-6 px-6 pt-16">
        <p className="euro-eyebrow">Les Collections</p>
        <nav aria-label="Collections" onMouseLeave={() => setHold(false)} className="flex flex-col items-center">
          {SLIDES.map((s, i) => (
            <a
              key={s.name}
              href="#shop"
              onClick={() => selectShopTab(s.tab)}
              onMouseEnter={() => {
                setSlide(i);
                setHold(true);
              }}
              onFocus={() => setSlide(i)}
              aria-current={i === slide ? "true" : undefined}
              className="mr-[-0.3em] text-center text-[clamp(26px,4.2vw,56px)] font-light uppercase leading-[1.3] tracking-[0.24em] transition-opacity duration-500 hover:opacity-100 md:tracking-[0.3em]"
              style={{ opacity: i === slide ? 1 : 0.5 }}
            >
              {s.name}
            </a>
          ))}
        </nav>
        <a
          href="#shop"
          onClick={() => selectShopTab(current.tab)}
          className="mt-4 flex h-[46px] items-center border border-white px-[34px] text-[11px] font-medium uppercase tracking-[0.2em] md:hidden"
        >
          Order now
        </a>
      </div>

      {/* Phones: slide dots (swipe or tap) and pause */}
      <div className="absolute inset-x-0 bottom-10 z-[1] flex items-center justify-center gap-1 md:hidden">
        {SLIDES.map((s, i) => (
          <button
            key={s.name}
            type="button"
            onClick={() => setSlide(i)}
            aria-label={`Show ${s.name}`}
            aria-current={i === slide ? "true" : undefined}
            className="flex h-8 w-6 items-center justify-center"
          >
            <span className={`block h-[2px] transition-all duration-300 ${i === slide ? "w-5 bg-white" : "w-2.5 bg-white/45"}`} />
          </button>
        ))}
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Play slideshow" : "Pause slideshow"}
          className="ml-2 flex h-8 w-8 items-center justify-center"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d={paused ? "M7 4l13 8-13 8V4Z" : "M6 4h4v16H6zM14 4h4v16h-4z"} />
          </svg>
        </button>
      </div>

      <div className="absolute bottom-9 right-12 z-[1] hidden items-center gap-4 md:flex">
        <span aria-hidden="true" className="h-0.5 w-[26px] bg-white" />
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Play slideshow" : "Pause slideshow"}
          className="flex h-8 w-8 items-center justify-center"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d={paused ? "M7 4l13 8-13 8V4Z" : "M6 4h4v16H6zM14 4h4v16h-4z"} />
          </svg>
        </button>
      </div>
    </section>
  );
}
