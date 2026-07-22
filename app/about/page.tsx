import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Testimonials } from "@/components/testimonials";
import { FaqSection } from "@/components/faq-section";

export const metadata: Metadata = {
  title: "Our Story & Craft — A European Bakery in Armadale",
  description:
    "Euro Patisserie is a European bakery in Armadale where French technique meets a warm neighbourhood welcome. Premium Australian flour, French Lescure butter and Valrhona chocolate, slow-fermented over three days — everything made by hand, in-house, every day.",
  alternates: { canonical: "/about" },
};

const SHOP = "https://vibe.filesafe.space/1782359074813107391/attachments/982a14ae-934a-417e-828f-386be0dadded.png";
const CAKE = "https://vibe.filesafe.space/1782359074813107391/attachments/10a71050-16bc-405f-af35-634769e62040.jpg";
const CROISSANTS = "https://vibe.filesafe.space/1782359074813107391/attachments/892503fb-424e-4d41-9419-88f00f047ebb.png";

// Our Craft imagery + copy (merged in from the former /our-craft page).
const CRAFT_CROISSANT = "/images/hero/croissant.jpg";
const CRAFT_ECLAIRS = "/images/hero/eclairs.jpg";
const CRAFT_CRUMB = "/images/featured/croissant-close.jpg";

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

const VALUES = [
  { title: "Made Fresh Daily", body: "Baked in-house every morning — pastries, cakes, breads and savouries, never frozen." },
  { title: "French Technique", body: "Classic methods, real butter, and a little patience: lamination, choux, ganache, the lot." },
  { title: "Proudly Armadale", body: "A neighbourhood patisserie on High Street, here for your morning coffee and your big celebrations alike." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b-2 border-primary bg-primary px-5 py-24 text-center text-primary-foreground">
        <p className="text-xs uppercase tracking-[0.35em] text-primary-foreground/60">Euro Patisserie · Armadale</p>
        <h1 className="mt-2 font-shorelines text-7xl leading-none md:text-9xl">Our Story</h1>
      </section>

      {/* Intro */}
      <AnimatedSection className="mx-auto max-w-3xl px-5 py-20 text-center">
        <p className="text-xl font-light leading-relaxed md:text-2xl">
          Euro Patisserie is a European bakery in the heart of Armadale, where French technique meets a warm
          neighbourhood welcome. From the first batch of croissants before sunrise to the last slice of cake in
          the afternoon, everything is made by hand, in-house, every single day.
        </p>
      </AnimatedSection>

      {/* Split — craft */}
      <section className="flex flex-col border-y-2 border-primary md:flex-row">
        <div className="w-full md:w-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CROISSANTS} alt="Freshly baked croissants" className="h-full w-full object-cover md:min-h-[60vh]" />
        </div>
        <AnimatedSection className="flex w-full flex-col justify-center border-t-2 border-primary p-8 md:w-1/2 md:border-l-2 md:border-t-0 md:p-16">
          <p className="text-sm font-faro uppercase tracking-widest text-primary/70">The Craft</p>
          <h2 className="mt-3 font-serif text-4xl font-light uppercase leading-tight md:text-5xl">
            Butter, time &amp; technique
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            Great pastry can&apos;t be rushed. We laminate our doughs the traditional way, whip our own creams and
            ganaches, and finish every cake by hand. It&apos;s slower — but you can taste the difference in every
            flaky, buttery bite.
          </p>
        </AnimatedSection>
      </section>

      {/* ───────── Our Craft ───────── */}
      <section className="border-b-2 border-primary bg-primary px-5 py-16 text-center text-primary-foreground md:py-20">
        <AnimatedSection className="mx-auto max-w-4xl">
          <p className="text-xs uppercase tracking-[0.35em] text-primary-foreground/60">Our Craft</p>
          <h2 className="mx-auto mt-4 max-w-3xl font-serif text-3xl font-light uppercase leading-tight md:text-5xl">
            Australian flour, French ingredients
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base font-light text-primary-foreground/80 md:text-lg">
            We never stop improving. By pairing premium Australian wheat with world-class French butter and
            chocolate — and traditional French technique — every pastry is uniquely Euro Patisserie.
          </p>
        </AnimatedSection>
      </section>

      {/* 🧈 Butter */}
      <section className="flex flex-col border-b-2 border-primary md:flex-row">
        <div className="w-full md:w-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CRAFT_CROISSANT} alt="Golden butter croissants" className="h-full w-full object-cover md:min-h-[60vh]" />
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
          <img src={CRAFT_ECLAIRS} alt="Glossy chocolate pastries" className="h-full w-full object-cover md:min-h-[60vh]" />
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
          <img src={CRAFT_CRUMB} alt="The open honeycomb crumb of a croissant" className="h-full w-full object-cover md:min-h-[60vh]" />
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

      {/* Values */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <AnimatedSection>
          <h2 className="border-b-2 border-border pb-3 font-serif text-3xl font-semibold uppercase tracking-wide md:text-4xl">
            What we stand for
          </h2>
        </AnimatedSection>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <AnimatedSection key={v.title} delay={i * 0.1} className="border-2 border-border bg-card p-7">
              <span className="font-serif text-5xl font-bold text-primary/15">0{i + 1}</span>
              <h3 className="mt-3 font-serif text-xl font-semibold uppercase tracking-wide">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Image breaker + CTA */}
      <section className="relative flex h-[60vh] items-center justify-center overflow-hidden border-y-2 border-primary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SHOP} alt="Inside Euro Patisserie Armadale" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-primary/50" />
        <AnimatedSection className="relative z-10 px-5 text-center text-primary-foreground">
          <h2 className="font-shorelines text-5xl leading-none md:text-7xl">Come say hello</h2>
          <p className="mt-4 text-sm uppercase tracking-[0.2em] text-primary-foreground/80">
            974 High St, Armadale · Open 7 days 7am–3pm
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/pre-order" className="btn-brutal px-7 py-3 text-sm">Order Online</Link>
            <Link
              href="/contact"
              className="border-2 border-primary-foreground px-7 py-3 text-sm font-bold uppercase tracking-[0.12em] transition hover:bg-primary-foreground hover:text-primary"
            >
              Visit Us
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* Cake teaser */}
      <section className="flex flex-col border-b-2 border-primary md:flex-row-reverse">
        <div className="w-full md:w-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CAKE} alt="Custom celebration cake" className="h-full w-full object-cover md:min-h-[55vh]" />
        </div>
        <AnimatedSection className="flex w-full flex-col justify-center border-t-2 border-primary p-8 md:w-1/2 md:border-r-2 md:border-t-0 md:p-16">
          <p className="text-sm font-faro uppercase tracking-widest text-primary/70">Celebrations</p>
          <h2 className="mt-3 font-serif text-4xl font-light uppercase leading-tight md:text-5xl">
            For your big moments
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            Birthdays, weddings, office shouts — our custom cakes and catering platters turn any occasion into
            something special. Tell us what you&apos;re celebrating and we&apos;ll make it.
          </p>
          <Link href="/catering" className="btn-brutal-outline mt-7 w-fit px-6 py-3 text-xs">
            Explore Catering &amp; Events
          </Link>
        </AnimatedSection>
      </section>

      <FaqSection />
    </div>
  );
}
