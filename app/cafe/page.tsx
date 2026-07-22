import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedSection } from "@/components/AnimatedSection";
import { FaqSection } from "@/components/faq-section";

export const metadata: Metadata = {
  title: "The Café — Dine In at Euro Patisserie Armadale",
  description:
    "Visit the Euro Patisserie café at 974 High St, Armadale. Dine-in pastries, cakes and coffee, a leafy dog-friendly courtyard, open 7 days 7am–3pm.",
  alternates: { canonical: "/cafe" },
};

const OUTDOOR =
  "https://vibe.filesafe.space/1782359074813107391/attachments/982a14ae-934a-417e-828f-386be0dadded.png";
const DOG =
  "https://vibe.filesafe.space/1782359074813107391/attachments/17124f1b-7f7c-4903-94c7-7d24968b1d60.png";

const GALLERY = [
  { src: "/images/hero/artisan-cakes.jpg", alt: "Artisan cakes on display" },
  { src: "/images/hero/croissant.jpg", alt: "Golden butter croissants" },
  { src: "/images/hero/grab-go.jpg", alt: "Grab-and-go pastries" },
  { src: "/images/hero/focaccia.jpg", alt: "Fresh-baked focaccia" },
];

export default function CafePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-end border-b-2 border-primary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={OUTDOOR}
          alt="Euro Patisserie courtyard in Armadale"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <AnimatedSection className="relative z-10 p-8 text-white md:p-16">
          <p className="text-xs uppercase tracking-[0.35em] text-white/70">Armadale · Dine In</p>
          <h1 className="mt-3 break-words font-shorelines text-5xl leading-none md:text-8xl">The Cafe</h1>
          <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-white/90">
            Buttery viennoiserie, French cakes and proper coffee — served fresh in our light-filled
            Armadale café and leafy, dog-friendly courtyard.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/pre-order"
              className="border-2 border-white bg-white px-8 py-4 text-xs font-bold uppercase tracking-widest text-primary transition hover:bg-transparent hover:text-white"
            >
              See the Menu
            </Link>
            <a
              href="https://maps.google.com/?q=974+High+St+Armadale+VIC+3143"
              target="_blank"
              rel="noreferrer"
              className="border-2 border-white px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-white hover:text-primary"
            >
              Get Directions
            </a>
          </div>
        </AnimatedSection>
      </section>

      {/* Info strip */}
      <section className="grid border-b-2 border-primary md:grid-cols-3">
        <div className="border-b-2 border-primary p-8 md:border-b-0 md:border-r-2 md:p-12">
          <h3 className="font-shorelines text-3xl">Visit Us</h3>
          <p className="mt-3 text-lg font-medium leading-relaxed">
            974 High St<br />
            Armadale VIC 3143
          </p>
        </div>
        <div className="border-b-2 border-primary p-8 md:border-b-0 md:border-r-2 md:p-12">
          <h3 className="font-shorelines text-3xl">Hours</h3>
          <p className="mt-3 text-lg font-medium leading-relaxed">
            Open 7 days<br />
            7am – 3pm
          </p>
        </div>
        <div className="p-8 md:p-12">
          <h3 className="font-shorelines text-3xl">Contact</h3>
          <p className="mt-3 text-lg font-medium leading-relaxed">
            euro@patisseries.com.au<br />
            (03) 9822 1234
          </p>
        </div>
      </section>

      {/* Dine-in experience */}
      <section className="flex flex-col border-b-2 border-primary md:flex-row">
        <div className="w-full md:w-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero/artisan-cakes.jpg"
            alt="Cakes and pastries at the counter"
            className="h-full w-full object-cover md:min-h-[55vh]"
          />
        </div>
        <AnimatedSection className="flex w-full flex-col justify-center border-t-2 border-primary p-8 md:w-1/2 md:border-l-2 md:border-t-0 md:p-16">
          <p className="text-sm font-faro uppercase tracking-widest text-primary/70">The Experience</p>
          <h2 className="mt-3 font-serif text-4xl font-light uppercase leading-tight md:text-5xl">
            Stay a while
          </h2>
          <p className="mt-6 font-light text-muted-foreground">
            Pull up a chair for a warm croissant straight from the oven, a slice of L&apos;Opéra and a
            coffee made just how you like it. Everything on the counter is baked in-house from premium
            Australian flour and French butter — the same pastries you can pre-order to take home.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-block w-fit border-2 border-primary px-6 py-3 text-xs font-bold uppercase tracking-widest transition hover:bg-primary hover:text-primary-foreground"
          >
            Discover Our Craft
          </Link>
        </AnimatedSection>
      </section>

      {/* Dog-friendly courtyard */}
      <section className="flex flex-col border-b-2 border-primary md:flex-row-reverse">
        <div className="w-full md:w-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={DOG}
            alt="A dog relaxing in the Euro Patisserie courtyard"
            className="h-full w-full object-cover md:min-h-[55vh]"
          />
        </div>
        <AnimatedSection className="flex w-full flex-col justify-center border-t-2 border-primary p-8 md:w-1/2 md:border-r-2 md:border-t-0 md:p-16">
          <p className="text-sm font-faro uppercase tracking-widest text-primary/70">🐾 Bring the Pup</p>
          <h2 className="mt-3 font-serif text-4xl font-light uppercase leading-tight md:text-5xl">
            Dog-friendly courtyard
          </h2>
          <p className="mt-6 font-light text-muted-foreground">
            Our outdoor area is made for lazy Armadale mornings — leafy, sunny and always happy to see a
            four-legged guest. Bring your dog, grab a pastry, and settle in.
          </p>
          <a
            href="https://maps.google.com/?q=974+High+St+Armadale+VIC+3143"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-block w-fit border-2 border-primary px-6 py-3 text-xs font-bold uppercase tracking-widest transition hover:bg-primary hover:text-primary-foreground"
          >
            Get Directions
          </a>
        </AnimatedSection>
      </section>

      {/* Gallery */}
      <section className="border-b-2 border-primary bg-secondary px-5 py-16 md:px-8 md:py-24">
        <AnimatedSection className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">On the Counter</p>
          <h2 className="mt-3 font-shorelines text-5xl leading-none md:text-6xl">Freshly baked, daily</h2>
        </AnimatedSection>
        <div className="mx-auto mt-10 grid max-w-5xl gap-px border-2 border-primary bg-primary sm:grid-cols-2 lg:grid-cols-4">
          {GALLERY.map((g) => (
            <div key={g.src} className="aspect-square overflow-hidden bg-background">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={g.src}
                alt={g.alt}
                className="h-full w-full object-cover transition duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-primary px-5 py-20 text-center text-primary-foreground md:py-28">
        <AnimatedSection className="mx-auto max-w-3xl">
          <h2 className="font-shorelines text-5xl leading-none md:text-6xl">See you soon</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-light leading-relaxed">
            Can&apos;t make it in? Pre-order your favourites for pickup or delivery and we&apos;ll have
            them ready.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/pre-order"
              className="border-2 border-primary-foreground bg-primary-foreground px-8 py-4 text-xs font-bold uppercase tracking-widest text-primary transition hover:bg-transparent hover:text-primary-foreground"
            >
              Order Pastries
            </Link>
            <Link
              href="/contact"
              className="border-2 border-primary-foreground px-8 py-4 text-xs font-bold uppercase tracking-widest text-primary-foreground transition hover:bg-primary-foreground hover:text-primary"
            >
              Contact Us
            </Link>
          </div>
        </AnimatedSection>
      </section>

      <FaqSection />
    </div>
  );
}
