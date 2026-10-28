import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedSection } from "@/components/AnimatedSection";
import { FaqSection } from "@/components/faq-section";
import { BTN_ON_PHOTO, BTN_ON_PHOTO_OUTLINE, PhotoHero, Split } from "@/components/split";
import { BUSINESS } from "@/lib/site";

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
const DIRECTIONS = "https://maps.google.com/?q=974+High+St+Armadale+VIC+3143";

const GALLERY = [
  { src: "/images/hero/artisan-cakes.jpg", alt: "Artisan cakes on display" },
  { src: "/images/hero/croissant.jpg", alt: "Golden butter croissants" },
  { src: "/images/hero/grab-go.jpg", alt: "Grab-and-go pastries" },
  { src: "/images/hero/focaccia.jpg", alt: "Fresh-baked focaccia" },
];

const INFO = [
  { label: "Visit us", lines: ["974 High St", "Armadale VIC 3143"], href: DIRECTIONS, cta: "Get directions" },
  { label: "Hours", lines: ["Open 7 days", "7am – 3pm"] },
  {
    label: "Contact",
    lines: [BUSINESS.email, "(03) 9822 1234"],
    href: `tel:${BUSINESS.phone.replace(/[^\d+]/g, "")}`,
    cta: "Call us",
  },
];

export default function CafePage() {
  return (
    <div className="bg-white">
      <PhotoHero img={OUTDOOR} alt="Euro Patisserie café in Armadale" eyebrow="Armadale · Dine in" title="The Café">
        <p className="max-w-[560px] text-[15px] leading-[1.8] text-white/90">
          Buttery viennoiserie, French cakes and proper coffee — served fresh in our light-filled Armadale café and
          leafy, dog-friendly courtyard.
        </p>
        <div className="mt-3 flex flex-col items-center gap-3 sm:flex-row">
          <Link href="/pre-order" className={BTN_ON_PHOTO}>
            See the menu
          </Link>
          <a href={DIRECTIONS} target="_blank" rel="noreferrer" className={BTN_ON_PHOTO_OUTLINE}>
            Get directions
          </a>
        </div>
      </PhotoHero>

      {/* Visit, hours, contact */}
      <section className="border-b border-euro-line px-6 md:px-12">
        <div className="mx-auto grid max-w-[1180px] divide-y divide-euro-line md:grid-cols-3 md:divide-x md:divide-y-0">
          {INFO.map((i) => (
            <div key={i.label} className="flex flex-col gap-3 py-10 md:px-10 md:py-14 md:first:pl-0 md:last:pr-0">
              <p className="euro-eyebrow text-euro-muted">{i.label}</p>
              <p className="text-[17px] font-light leading-[1.7] text-euro-ink">
                {i.lines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </p>
              {i.href && (
                <a
                  href={i.href}
                  target={i.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="mt-1 w-fit text-[11px] font-medium uppercase tracking-[0.18em] text-euro-ink underline underline-offset-[6px] hover:opacity-70"
                >
                  {i.cta}
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <Split img="/images/hero/artisan-cakes.jpg" alt="Cakes and pastries at the counter" eyebrow="The experience" title="Stay a while">
        <p>
          Pull up a chair for a warm croissant straight from the oven, a slice of L&apos;Opéra and a coffee made just how
          you like it. Everything on the counter is baked in-house from premium Australian flour and French butter — the
          same pastries you can pre-order to take home.
        </p>
        <Link href="/about" className="btn-euro-outline mt-2 self-start text-euro-ink hover:bg-euro-ink hover:text-white">
          Discover our craft
        </Link>
      </Split>

      <Split img={DOG} alt="A dog relaxing in the Euro Patisserie courtyard" eyebrow="Bring the pup" title="Dog-friendly courtyard" flip tint>
        <p>
          Our outdoor area is made for lazy Armadale mornings — leafy, sunny and always happy to see a four-legged guest.
          Bring your dog, grab a pastry, and settle in.
        </p>
        <a
          href={DIRECTIONS}
          target="_blank"
          rel="noreferrer"
          className="btn-euro-outline mt-2 self-start text-euro-ink hover:bg-euro-ink hover:text-white"
        >
          Get directions
        </a>
      </Split>

      {/* On the counter */}
      <section className="px-2.5 pb-2.5 pt-20 md:pt-28">
        <AnimatedSection className="mx-auto mb-12 flex max-w-[680px] flex-col items-center gap-5 px-4 text-center">
          <p className="euro-eyebrow text-euro-muted">On the counter</p>
          <h2 className="euro-heading text-[clamp(26px,2.8vw,40px)] text-euro-ink">Freshly baked, daily</h2>
        </AnimatedSection>
        <ul className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          {GALLERY.map((g) => (
            <li key={g.src} className="aspect-[4/5] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={g.src}
                alt={g.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
              />
            </li>
          ))}
        </ul>
      </section>

      {/* See you soon */}
      <section className="bg-euro-tint px-6 py-20 text-center md:py-28">
        <AnimatedSection className="mx-auto flex max-w-[640px] flex-col items-center gap-5">
          <p className="euro-eyebrow text-euro-muted">Can&apos;t make it in?</p>
          <h2 className="euro-heading text-[clamp(26px,2.8vw,40px)] text-euro-ink">See you soon</h2>
          <p className="text-[15px] leading-[1.8] text-euro-soft">
            Pre-order your favourites for pickup or delivery and we&apos;ll have them ready.
          </p>
          <div className="mt-3 flex flex-col items-center gap-3 sm:flex-row">
            <Link href="/pre-order" className="btn-euro">
              Order pastries
            </Link>
            <Link href="/contact" className="btn-euro-outline text-euro-ink hover:bg-euro-ink hover:text-white">
              Contact us
            </Link>
          </div>
        </AnimatedSection>
      </section>

      <FaqSection />
    </div>
  );
}
