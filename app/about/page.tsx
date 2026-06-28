import Link from "next/link";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Testimonials } from "@/components/testimonials";

const SHOP = "https://vibe.filesafe.space/1782359074813107391/attachments/982a14ae-934a-417e-828f-386be0dadded.png";
const CAKE = "https://vibe.filesafe.space/1782359074813107391/attachments/10a71050-16bc-405f-af35-634769e62040.jpg";
const CROISSANTS = "https://vibe.filesafe.space/1782359074813107391/attachments/892503fb-424e-4d41-9419-88f00f047ebb.png";

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
            974 High St, Armadale · Tues–Sun 7am–3pm
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
            Explore Catering
          </Link>
        </AnimatedSection>
      </section>
    </div>
  );
}
