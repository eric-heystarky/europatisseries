"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "How do I order online?",
    a: (
      <>
        Browse the <Link href="/pre-order" className="underline underline-offset-2">menu</Link>, add items to
        your cart, then check out with pickup or delivery and pay securely by card. You&apos;ll get an order
        confirmation on screen.
      </>
    ),
  },
  {
    q: "Do you offer pickup and delivery?",
    a: (
      <>
        Both. Pick up from our shop at <strong>974 High St, Armadale</strong>, or have it delivered. Choose your
        option at checkout — ASAP or scheduled for later.
      </>
    ),
  },
  {
    q: "How much is delivery, and how far do you go?",
    a: (
      <>
        Delivery is <strong>$5 per km</strong> driving distance from our Armadale shop, calculated live at
        checkout when you enter your address. <strong>Free delivery on orders over $300.</strong> Enter your
        address for an instant quote.
      </>
    ),
  },
  {
    q: "Can you cater for events?",
    a: (
      <>
        Absolutely — wedding cakes, grand entremets, cocktail pieces, buffets and more. See the{" "}
        <Link href="/catering" className="underline underline-offset-2">catering page</Link> or send an enquiry.
        For large orders we recommend at least 48 hours&apos; notice.
      </>
    ),
  },
  {
    q: "Do you cater to allergies and dietary needs?",
    a: (
      <>
        We carry gluten-free and vegetarian options (look for them on the menu). However, everything is made in a
        kitchen that handles nuts, gluten, dairy and eggs, so we can&apos;t guarantee any item is completely
        allergen-free. Please ask us about specific requirements.
      </>
    ),
  },
  {
    q: "Do you sell gift cards?",
    a: (
      <>
        Yes — a Euro Patisserie gift card is the perfect treat. See{" "}
        <Link href="/gift-cards" className="underline underline-offset-2">gift cards</Link> for details.
      </>
    ),
  },
  {
    q: "What are your opening hours?",
    a: (
      <>
        <strong>Tuesday–Sunday, 7am–3pm.</strong> Closed Mondays. Order online any time and we&apos;ll have it
        ready in opening hours.
      </>
    ),
  },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b-2 border-primary bg-primary px-5 py-20 text-center text-primary-foreground">
        <p className="text-xs uppercase tracking-[0.35em] text-primary-foreground/60">Good to know</p>
        <h1 className="mt-2 font-shorelines text-7xl leading-none md:text-8xl">FAQ</h1>
        <p className="mx-auto mt-4 max-w-md text-sm uppercase tracking-[0.15em] text-primary-foreground/70">
          Everything about ordering, delivery, catering & more.
        </p>
      </section>

      <AnimatedSection className="mx-auto max-w-3xl px-5 py-16">
        <ul className="border-2 border-border divide-y-2 divide-border">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={i}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 bg-card px-5 py-5 text-left transition hover:bg-primary hover:text-primary-foreground"
                >
                  <span className="font-serif text-lg font-semibold md:text-xl">{item.q}</span>
                  <span className="flex-none border-2 border-current p-1">
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                <div
                  className={`grid overflow-hidden transition-all duration-300 ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="min-h-0">
                    <p className="px-5 pb-6 pt-1 text-sm leading-relaxed text-muted-foreground md:text-base">
                      {item.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Still have questions */}
        <div className="mt-10 border-2 border-border bg-card p-6 text-center">
          <p className="font-serif text-xl font-semibold uppercase tracking-wide">Still have a question?</p>
          <p className="mt-2 text-sm text-muted-foreground">We&apos;re happy to help — get in touch.</p>
          <Link href="/contact" className="btn-brutal mt-5 px-6 py-3 text-sm">
            Contact Us
          </Link>
        </div>
      </AnimatedSection>
    </div>
  );
}
