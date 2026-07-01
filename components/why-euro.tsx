import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RotatingWord } from "./rotating-word";

/**
 * Homepage "Why Euro Patisserie" value-prop section — the Australian flour +
 * French ingredients story, with a link to the full /our-craft page.
 */
const PILLARS = [
  {
    icon: "🌾",
    name: "Laucke Euro T55 Flour",
    origin: "Australian",
    body: "Milled in Australia from premium Australian wheat — the traditional French T55 for authentic viennoiserie.",
  },
  {
    icon: "🧈",
    name: "Lescure 84% AOP Butter",
    origin: "French",
    body: "AOP-certified French butter, crafted since 1884. 84% butterfat for richer flavour and flakier layers.",
  },
  {
    icon: "🍫",
    name: "Valrhona Chocolate",
    origin: "French",
    body: "One of the world's most respected chocolate makers and a certified B Corp — in every Pain au Chocolat.",
  },
];

export function WhyEuro() {
  return (
    <section className="border-t-2 border-primary bg-background px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
          Why Euro Patisserie
        </p>
        <h2 className="mx-auto mt-6 max-w-4xl text-center font-serif text-3xl font-light uppercase leading-tight md:text-5xl">
          Exceptional{" "}
          <RotatingWord
            words={["Australian Flour", "French Ingredients", "Artisan Pastries"]}
            className="text-primary"
          />
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-center text-base font-light text-muted-foreground md:text-lg">
          Every croissant is a three-day labour of love — French Lescure 84% AOP butter and Valrhona
          chocolate, laminated through premium Australian Laucke T55 flour, then slow-fermented for a
          light, honeycomb crumb.
        </p>

        <div className="mt-12 grid border-2 border-primary sm:grid-cols-3">
          {PILLARS.map((p, i) => (
            <div
              key={p.name}
              className={`flex flex-col p-6 md:p-8 ${
                i < PILLARS.length - 1 ? "border-b-2 border-primary sm:border-b-0 sm:border-r-2" : ""
              }`}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                {p.origin}
              </p>
              <h3 className="mt-1 font-serif text-lg font-semibold">{p.name}</h3>
              <p className="mt-2 text-sm font-light text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link href="/our-craft" className="btn-brutal px-8 py-3.5 text-xs">
            Discover Our Craft
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
