import Link from "next/link";
import { RotatingWord } from "../rotating-word";

const INGREDIENTS = [
  {
    origin: "Australian",
    name: "Laucke Euro T55 Flour",
    body: "Milled in Australia from premium Australian wheat — the traditional French T55 for authentic viennoiserie.",
  },
  {
    origin: "French",
    name: "Lescure 84% AOP Butter",
    body: "AOP-certified French butter, crafted since 1884. 84% butterfat for richer flavour and flakier layers.",
  },
  {
    origin: "French",
    name: "Valrhona Chocolate",
    body: "One of the world’s most respected chocolate makers and a certified B Corp — in every Pain au Chocolat.",
  },
];

/** The ingredients story — a compact two-column band, not a full fold. */
export function WhyEuroSection() {
  return (
    <section id="why-euro" className="border-t border-euro-line bg-white px-6 py-20 md:px-12 md:py-24">
      <div className="mx-auto grid max-w-[1180px] gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-20">
        <div className="flex flex-col gap-5">
          <p className="euro-eyebrow text-euro-muted">Why Euro Patisserie</p>
          <h2 className="euro-heading text-[clamp(24px,2.4vw,34px)] text-euro-ink">
            Exceptional
            <br />
            <RotatingWord
              words={["Artisan Pastries", "French Ingredients", "Australian Flour"]}
              intervalMs={2800}
              align="left"
            />
          </h2>
          <p className="max-w-[440px] text-[14.5px] leading-[1.8] text-euro-soft">
            Every croissant is a three-day labour of love — French Lescure 84% AOP butter and Valrhona chocolate,
            laminated through premium Australian Laucke T55 flour, then slow-fermented for a light, honeycomb crumb.
          </p>
          <Link href="/about" className="btn-euro mt-2 self-start">
            Discover our craft
          </Link>
        </div>
        <ul className="divide-y divide-euro-line border-y border-euro-line">
          {INGREDIENTS.map((i) => (
            <li key={i.name} className="grid gap-1.5 py-6 sm:grid-cols-[110px_minmax(0,1fr)] sm:gap-8">
              <span className="pt-[3px] text-[10.5px] font-medium uppercase tracking-[0.2em] text-euro-muted">{i.origin}</span>
              <span>
                <span className="block text-[13px] font-medium uppercase tracking-[0.12em] text-euro-ink">{i.name}</span>
                <span className="mt-1.5 block text-[13.5px] leading-[1.7] text-euro-soft">{i.body}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
