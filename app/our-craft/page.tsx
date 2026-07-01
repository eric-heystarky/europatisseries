import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedSection } from "@/components/AnimatedSection";
import { RotatingWord } from "@/components/rotating-word";

export const metadata: Metadata = {
  title: "Our Craft — Australian Flour, French Ingredients",
  description:
    "Exceptional Australian Laucke T55 flour, French Lescure 84% AOP butter and Valrhona chocolate, slow-fermented over three days. The ingredients and craft behind every Euro Patisserie pastry.",
  alternates: { canonical: "/our-craft" },
};

const CROISSANT = "/images/hero/croissant.jpg";
const ECLAIRS = "/images/hero/eclairs.jpg";
const CRUMB = "/images/featured/croissant-close.jpg";

const BUTTER_POINTS = [
  "Better lamination and consistency",
  "Less butter leakage during baking",
  "Richer, more buttery flavour",
  "Lighter, flakier layers",
  "Beautiful colour and caramelisation",
];

const FLOUR_POINTS = [
  "Milled from premium Australian wheat",
  "Consistent quality every single day",
  "Excellent dough strength for long fermentation",
  "Outstanding extensibility for lamination",
  "A light, open honeycomb crumb",
];

const JOURNEY = [
  { n: "01", t: "Mix", d: "Premium Laucke T55 flour brought together to form the dough." },
  { n: "02", t: "Slow Ferment", d: "A long, cold fermentation develops deeper flavour and strength." },
  { n: "03", t: "Laminate", d: "Folded with Lescure 84% butter into dozens of delicate layers." },
  { n: "04", t: "Rest & Shape", d: "The dough rests, then each pastry is shaped by hand." },
  { n: "05", t: "Proof", d: "A patient final rise for that light, airy structure." },
  { n: "06", t: "Bake", d: "Baked to a golden, caramelised, honeycomb-crumbed finish." },
];

export default function OurCraftPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b-2 border-primary bg-primary px-5 py-24 text-center text-primary-foreground">
        <p className="text-xs uppercase tracking-[0.35em] text-primary-foreground/60">Why Euro Patisserie</p>
        <h1 className="mx-auto mt-4 max-w-4xl font-serif text-3xl font-light uppercase leading-tight md:text-5xl">
          Exceptional{" "}
          <RotatingWord words={["Australian Flour", "French Ingredients", "Artisan Pastries"]} />
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base font-light text-primary-foreground/80 md:text-lg">
          We never stop improving. By pairing premium Australian wheat with world-class French butter and
          chocolate — and traditional French technique — every pastry is uniquely Euro Patisserie.
        </p>
      </section>

      {/* 🧈 Butter */}
      <section className="flex flex-col border-b-2 border-primary md:flex-row">
        <div className="w-full md:w-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CROISSANT} alt="Golden butter croissants" className="h-full w-full object-cover md:min-h-[60vh]" />
        </div>
        <AnimatedSection className="flex w-full flex-col justify-center border-t-2 border-primary p-8 md:w-1/2 md:border-l-2 md:border-t-0 md:p-16">
          <p className="text-sm font-faro uppercase tracking-widest text-primary/70">🧈 The Butter</p>
          <h2 className="mt-3 font-serif text-4xl font-light uppercase leading-tight md:text-5xl">
            Lescure 84% AOP
          </h2>
          <p className="mt-6 font-light text-muted-foreground">
            Crafted in France since 1884 and trusted by many of the world&apos;s leading pâtisseries, Lescure&apos;s
            AOP certification guarantees authentic French origin and traditional methods. At 84% butterfat — less
            water, more pure butter — it&apos;s in every Croissant and Pain au Chocolat we make.
          </p>
          <ul className="mt-6 space-y-2">
            {BUTTER_POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm">
                <span className="mt-2 h-1.5 w-1.5 flex-none bg-primary" />
                {p}
              </li>
            ))}
          </ul>
        </AnimatedSection>
      </section>

      {/* 🍫 Chocolate */}
      <section className="flex flex-col border-b-2 border-primary md:flex-row-reverse">
        <div className="w-full md:w-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ECLAIRS} alt="Glossy chocolate pastries" className="h-full w-full object-cover md:min-h-[60vh]" />
        </div>
        <AnimatedSection className="flex w-full flex-col justify-center border-t-2 border-primary p-8 md:w-1/2 md:border-r-2 md:border-t-0 md:p-16">
          <p className="text-sm font-faro uppercase tracking-widest text-primary/70">🍫 The Chocolate</p>
          <h2 className="mt-3 font-serif text-4xl font-light uppercase leading-tight md:text-5xl">
            Valrhona, France
          </h2>
          <p className="mt-6 font-light text-muted-foreground">
            One of the world&apos;s most respected chocolate makers, trusted by leading pastry chefs for over 100
            years. As a certified B Corporation, Valrhona is recognised for ethical sourcing, sustainability and
            supporting cocoa-growing communities.
          </p>
          <p className="mt-4 font-light text-muted-foreground">
            We&apos;ve upgraded to Valrhona chocolate batons from France — so every Pain au Chocolat delivers an
            even richer, more luxurious chocolate experience.
          </p>
        </AnimatedSection>
      </section>

      {/* 🌾 Flour */}
      <section className="flex flex-col border-b-2 border-primary md:flex-row">
        <div className="w-full md:w-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CRUMB} alt="The open honeycomb crumb of a croissant" className="h-full w-full object-cover md:min-h-[60vh]" />
        </div>
        <AnimatedSection className="flex w-full flex-col justify-center border-t-2 border-primary p-8 md:w-1/2 md:border-l-2 md:border-t-0 md:p-16">
          <p className="text-sm font-faro uppercase tracking-widest text-primary/70">🌾 The Flour</p>
          <h2 className="mt-3 font-serif text-4xl font-light uppercase leading-tight md:text-5xl">
            Laucke Euro T55
          </h2>
          <p className="mt-6 font-light text-muted-foreground">
            Exceptional pastries begin with exceptional flour. Milled in Australia from premium Australian wheat,
            Laucke Euro T55 is developed for authentic European viennoiserie. &ldquo;T55&rdquo; is the traditional
            French classification used throughout France for classic pastries — the ideal balance of strength,
            extensibility and texture. Laucke has been milling with Australian growers for over 125 years.
          </p>
          <ul className="mt-6 space-y-2">
            {FLOUR_POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm">
                <span className="mt-2 h-1.5 w-1.5 flex-none bg-primary" />
                {p}
              </li>
            ))}
          </ul>
        </AnimatedSection>
      </section>

      {/* The three-day journey */}
      <section className="border-b-2 border-primary bg-secondary px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-5xl">
          <AnimatedSection className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Every Croissant</p>
            <h2 className="mt-3 font-shorelines text-5xl leading-none md:text-7xl">a three-day journey</h2>
            <p className="mx-auto mt-6 max-w-2xl font-light text-muted-foreground">
              What many customers don&apos;t see is the patience behind every pastry. Slow fermentation develops
              deeper flavour, strengthens the dough, and creates the light honeycomb crumb that defines an
              exceptional croissant.
            </p>
          </AnimatedSection>
          <div className="mt-12 grid gap-px border-2 border-primary bg-primary sm:grid-cols-2 lg:grid-cols-3">
            {JOURNEY.map((s) => (
              <div key={s.n} className="bg-background p-6 md:p-8">
                <p className="font-serif text-2xl font-light text-muted-foreground">{s.n}</p>
                <h3 className="mt-2 font-bold uppercase tracking-wide">{s.t}</h3>
                <p className="mt-1 text-sm font-light text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="bg-primary px-5 py-20 text-center text-primary-foreground md:py-28">
        <AnimatedSection className="mx-auto max-w-3xl">
          <p className="text-lg font-light leading-relaxed md:text-xl">
            The combination of exceptional Australian wheat, world-class French ingredients and traditional French
            techniques is what makes every pastry uniquely Euro Patisserie. Together, we&apos;re not just making
            pastries — we&apos;re creating authentic French pâtisserie experiences.
          </p>
          <p className="mt-8 font-shorelines text-4xl md:text-5xl">Merci à tous 🇫🇷</p>
          <Link
            href="/pre-order"
            className="mt-10 inline-block border-2 border-primary-foreground bg-primary-foreground px-8 py-4 text-xs font-bold uppercase tracking-widest text-primary transition hover:bg-transparent hover:text-primary-foreground"
          >
            Order Pastries
          </Link>
        </AnimatedSection>
      </section>
    </div>
  );
}
