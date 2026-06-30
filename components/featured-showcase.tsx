import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Curated "featured creations" row — a few signature items with real food
 * photography (overhead by default, close-up on hover). Replaces the marquee.
 * Photos live in /public/images/featured and are generated/editorial shots.
 */
type Feature = {
  name: string;
  price: string;
  over: string;
  close: string;
};

const FEATURES: Feature[] = [
  { name: "Tarte au Citron", price: "$9.50", over: "/images/featured/tarte-au-citron-over.jpg", close: "/images/featured/tarte-au-citron-close.jpg" },
  { name: "Mille-Feuille", price: "$11.00", over: "/images/featured/mille-feuille-over.jpg", close: "/images/featured/mille-feuille-close.jpg" },
  { name: "L'Opéra", price: "$12.00", over: "/images/featured/lopera-over.jpg", close: "/images/featured/lopera-close.jpg" },
  { name: "Croissant au Beurre", price: "from $6.50", over: "/images/featured/croissant-over.jpg", close: "/images/featured/croissant-close.jpg" },
  { name: "Éclair", price: "$7.50", over: "/images/featured/eclair-over.jpg", close: "/images/featured/eclair-close.jpg" },
];

export function FeaturedShowcase() {
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

        {/* Scrollable card row */}
        <ul className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 md:mx-0 md:gap-6 md:px-0">
          {FEATURES.map((f) => (
            <li key={f.name} className="w-[72%] flex-none snap-start sm:w-[44%] lg:w-[calc((100%-4*1.5rem)/5)]">
              <Link href="/pre-order" className="group block">
                <div className="relative aspect-[3/4] w-full overflow-hidden border-2 border-primary bg-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.over}
                    alt={f.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.close}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    decoding="async"
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
