import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedSection } from "@/components/AnimatedSection";
import { FaqSection } from "@/components/faq-section";
import { Reviews } from "@/components/home/social";
import { getGoogleReviews } from "@/lib/google-reviews";
import { BTN_ON_PHOTO, BTN_ON_PHOTO_OUTLINE, PhotoHero, Points, Split } from "@/components/split";

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
const CRAFT_FLATLAY = "/images/catering/croissant-flatlay.jpg";

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

export default async function AboutPage() {
  const reviews = await getGoogleReviews();

  return (
    <div className="bg-white">
      <PhotoHero img={CROISSANTS} alt="Freshly baked croissants" eyebrow="Euro Patisserie · Armadale" title="Our Story" />

      {/* Intro */}
      <AnimatedSection className="mx-auto max-w-[760px] px-6 py-20 text-center md:py-28">
        <p className="text-[clamp(18px,1.7vw,22px)] font-light leading-[1.7] text-euro-text">
          Euro Patisserie is a European bakery in the heart of Armadale, where French technique meets a warm
          neighbourhood welcome. From the first batch of croissants before sunrise to the last slice of cake in the
          afternoon, everything is made by hand, in-house, every single day.
        </p>
      </AnimatedSection>

      <Split img={CRAFT_FLATLAY} alt="Croissants laid out on the bench" eyebrow="The craft" title="Butter, time & technique" tint>
        <p>
          Great pastry can&apos;t be rushed. We laminate our doughs the traditional way, whip our own creams and
          ganaches, and finish every cake by hand. It&apos;s slower — but you can taste the difference in every flaky,
          buttery bite.
        </p>
      </Split>

      {/* Our Craft */}
      <section className="px-6 py-20 text-center md:py-28">
        <AnimatedSection className="mx-auto flex max-w-[760px] flex-col items-center gap-5">
          <p className="euro-eyebrow text-euro-muted">Our craft</p>
          <h2 className="euro-heading text-[clamp(26px,2.8vw,40px)] text-euro-ink">Australian flour, French ingredients</h2>
          <p className="text-[15px] leading-[1.8] text-euro-soft">
            We never stop improving. By pairing premium Australian wheat with world-class French butter and chocolate —
            and traditional French technique — every pastry is uniquely Euro Patisserie.
          </p>
        </AnimatedSection>
      </section>

      <Split img={CRAFT_CROISSANT} alt="Golden butter croissants" eyebrow="The butter · France" title="Lescure 84% AOP">
        <p>
          Crafted in France since 1884 and trusted by many of the world&apos;s leading pâtisseries, Lescure&apos;s AOP
          certification guarantees authentic French origin and traditional methods. At 84% butterfat — less water, more
          pure butter — it&apos;s in every Croissant and Pain au Chocolat we make.
        </p>
        <Points items={BUTTER_POINTS} />
      </Split>

      <Split img={CRAFT_ECLAIRS} alt="Glossy chocolate pastries" eyebrow="The chocolate · France" title="Valrhona" flip>
        <p>
          One of the world&apos;s most respected chocolate makers, trusted by leading pastry chefs for over 100 years. As a
          certified B Corporation, Valrhona is recognised for ethical sourcing, sustainability and supporting
          cocoa-growing communities.
        </p>
        <p>
          We&apos;ve upgraded to Valrhona chocolate batons from France — so every Pain au Chocolat delivers an even richer,
          more luxurious chocolate experience.
        </p>
      </Split>

      <Split img={CRAFT_CRUMB} alt="The open honeycomb crumb of a croissant" eyebrow="The flour · Australia" title="Laucke Euro T55">
        <p>
          Exceptional pastries begin with exceptional flour. Milled in Australia from premium Australian wheat, Laucke Euro
          T55 is developed for authentic European viennoiserie. &ldquo;T55&rdquo; is the traditional French classification
          used throughout France for classic pastries — the ideal balance of strength, extensibility and texture. Laucke
          has been milling with Australian growers for over 125 years.
        </p>
        <Points items={FLOUR_POINTS} />
      </Split>

      {/* The three-day journey */}
      <section className="bg-euro-tint px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-[1180px]">
          <AnimatedSection className="mx-auto flex max-w-[680px] flex-col items-center gap-5 text-center">
            <p className="euro-eyebrow text-euro-muted">Every croissant</p>
            <h2 className="euro-heading text-[clamp(26px,2.8vw,40px)] text-euro-ink">A three-day journey</h2>
            <p className="text-[15px] leading-[1.8] text-euro-soft">
              What many customers don&apos;t see is the patience behind every pastry. Slow fermentation develops deeper
              flavour, strengthens the dough, and creates the light honeycomb crumb that defines an exceptional croissant.
            </p>
          </AnimatedSection>
          <ol className="mt-14 grid border-t border-euro-line sm:grid-cols-2 lg:grid-cols-3">
            {JOURNEY.map((s) => (
              <li key={s.n} className="flex flex-col gap-2 border-b border-euro-line py-8 sm:pr-10">
                <span className="text-[28px] font-extralight leading-none text-euro-muted">{s.n}</span>
                <span className="euro-label mt-2 text-euro-ink">{s.t}</span>
                <span className="text-[14px] leading-[1.7] text-euro-soft">{s.d}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-[1180px]">
          <AnimatedSection className="flex flex-col items-center gap-5 text-center">
            <p className="euro-eyebrow text-euro-muted">Our promise</p>
            <h2 className="euro-heading text-[clamp(26px,2.8vw,40px)] text-euro-ink">What we stand for</h2>
          </AnimatedSection>
          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
            {VALUES.map((v, i) => (
              <AnimatedSection key={v.title} delay={i * 0.1} className="flex flex-col gap-3 border-t border-euro-ink pt-6">
                <span className="text-[11px] font-medium tracking-[0.2em] text-euro-muted">0{i + 1}</span>
                <h3 className="euro-label text-euro-ink">{v.title}</h3>
                <p className="text-[14px] leading-[1.75] text-euro-soft">{v.body}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Kind words — the real Google reviews */}
      <section className="bg-euro-tint px-6 py-20 md:px-12 md:py-24">
        <div className="mx-auto grid max-w-[1180px] items-center gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-20">
          <AnimatedSection className="flex flex-col gap-5">
            <p className="euro-eyebrow text-euro-muted">Loved locally</p>
            <h2 className="euro-heading text-[clamp(26px,2.8vw,40px)] text-euro-ink">Kind words</h2>
            <p className="max-w-[400px] text-[15px] leading-[1.8] text-euro-soft">
              A few words from our regulars, straight from Google.
            </p>
          </AnimatedSection>
          <Reviews data={reviews} />
        </div>
      </section>

      {/* Come say hello */}
      <section className="relative flex h-[560px] flex-col items-center justify-center overflow-hidden text-center text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SHOP} alt="Inside Euro Patisserie Armadale" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 bg-[rgba(5,9,48,0.42)]" />
        <AnimatedSection className="relative flex flex-col items-center gap-5 px-6">
          <h2 className="euro-heading mr-[-0.16em] text-[clamp(28px,3.2vw,44px)] tracking-[0.16em]">Come say hello</h2>
          <p className="euro-eyebrow">974 High St, Armadale · Open 7 days, 7am – 3pm</p>
          <div className="mt-3 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/pre-order"
              className={BTN_ON_PHOTO}
            >
              Order online
            </Link>
            <Link
              href="/contact"
              className={BTN_ON_PHOTO_OUTLINE}
            >
              Visit us
            </Link>
          </div>
        </AnimatedSection>
      </section>

      <Split img={CAKE} alt="Custom celebration cake" eyebrow="Celebrations" title="For your big moments" flip>
        <p>
          Birthdays, weddings, office shouts — our custom cakes and catering platters turn any occasion into something
          special. Tell us what you&apos;re celebrating and we&apos;ll make it.
        </p>
        <Link href="/catering" className="btn-euro-outline mt-2 self-start text-euro-ink hover:bg-euro-ink hover:text-white">
          Explore catering &amp; events
        </Link>
      </Split>

      <FaqSection />
    </div>
  );
}
