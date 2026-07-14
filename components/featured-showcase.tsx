"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";

/**
 * Curated "featured creations" row — signature items with real food photography
 * (default shot, warmer variation on hover). The row is drag-to-scroll on
 * desktop (click and drag) and swipe on touch. Photos live in
 * /public/images/featured.
 */
type Feature = {
  name: string;
  price: string;
  over: string;
  close: string;
};

const FEATURES: Feature[] = [
  { name: "Croissant au Beurre", price: "$7.20", over: "/images/featured/croissant-hero.jpg", close: "/images/featured/croissant-hover.jpg" },
  { name: "Éclair", price: "$10.30", over: "/images/featured/eclair-hero.jpg", close: "/images/featured/eclair-hover.jpg" },
  { name: "Steak Pie", price: "$10.40", over: "/images/featured/steak-pie.jpg", close: "/images/featured/steak-pie-hover.jpg" },
  { name: "Nutella Scroll", price: "$9.40", over: "/images/featured/nutella-scroll.jpg", close: "/images/featured/nutella-scroll-hover.jpg" },
  { name: "Chicken & Dill Wrap", price: "$10.90", over: "/images/featured/chicken-wrap.jpg", close: "/images/featured/chicken-wrap-hover.jpg" },
];

export function FeaturedShowcase() {
  const rowRef = useRef<HTMLUListElement>(null);
  // Drag-to-scroll state. `moved` suppresses the card's click after a drag so a
  // drag doesn't accidentally navigate.
  const drag = useRef({ down: false, startX: 0, scrollLeft: 0, moved: false });

  const onDown = (e: React.MouseEvent) => {
    const el = rowRef.current;
    if (!el) return;
    drag.current = { down: true, startX: e.pageX, scrollLeft: el.scrollLeft, moved: false };
  };
  const onMove = (e: React.MouseEvent) => {
    const el = rowRef.current;
    if (!el || !drag.current.down) return;
    const dx = e.pageX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.scrollLeft - dx;
  };
  const onUp = () => {
    drag.current.down = false;
  };
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  return (
    <section className="border-b-2 border-primary bg-background px-5 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Header row: label + view all */}
        <div className="mb-8 flex items-end justify-between gap-4 border-b-2 border-primary pb-4 md:mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
              Our Creations
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold uppercase tracking-wide md:text-4xl">
              Made fresh daily
            </h2>
          </div>
          <Link
            href="/pre-order"
            className="group flex flex-none items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] hover:underline"
          >
            View all
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Drag-to-scroll card row (swipe on touch) */}
        <ul
          ref={rowRef}
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={onUp}
          onMouseLeave={onUp}
          onClickCapture={onClickCapture}
          className="-mx-5 flex cursor-grab select-none gap-5 overflow-x-auto px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] active:cursor-grabbing md:mx-0 md:gap-6 md:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {FEATURES.map((f) => (
            <li key={f.name} className="w-[72%] flex-none sm:w-[44%] lg:w-[calc((100%-4*1.5rem)/5)]">
              <Link href="/pre-order" className="group block" draggable={false}>
                <div className="relative aspect-[3/4] w-full overflow-hidden border-2 border-primary bg-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.over}
                    alt={f.name}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.close}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                </div>
                <div className="mt-3">
                  <h3 className="font-serif text-base font-semibold uppercase tracking-wide">{f.name}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">{f.price}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
