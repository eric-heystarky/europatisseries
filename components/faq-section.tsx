"use client";

import { useState } from "react";
import Link from "next/link";

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
        checkout when you enter your address. <strong>Free delivery on orders over $150.</strong> Enter your
        address for an instant quote.
      </>
    ),
  },
  {
    q: "Can you cater for events?",
    a: (
      <>
        Absolutely — wedding cakes, grand entremets, cocktail pieces, buffets and more. See the{" "}
        <Link href="/catering" className="underline underline-offset-2">catering &amp; events page</Link> or send
        an enquiry. For large orders we recommend at least 48 hours&apos; notice.
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
    q: "Are you dog friendly?",
    a: (
      <>
        Yes! Our leafy Armadale courtyard is made for lazy mornings with your pup by your side — water bowls and a
        warm welcome are always on the house. See <Link href="/cafe" className="underline underline-offset-2">the
        café</Link> for more.
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
        <strong>Open 7 days, 7am–3pm.</strong> Order online any time and we&apos;ll have it ready in opening
        hours.
      </>
    ),
  },
];

/**
 * Reusable FAQ accordion (v4): the heading and a "still have a question" note on
 * the left, a calm hairline accordion on the right. Sits at the bottom of the
 * menu page (#faq) and the other main pages.
 */
export function FaqSection({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className={`scroll-mt-[120px] border-t border-euro-line bg-white px-6 py-20 md:px-12 md:py-24 ${className}`}>
      <div className="mx-auto grid max-w-[1180px] gap-12 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:gap-20">
        <div className="flex flex-col gap-5">
          <p className="euro-eyebrow text-euro-muted">Good to know</p>
          <h2 className="euro-heading text-[clamp(24px,2.4vw,34px)] text-euro-ink">Questions</h2>
          <p className="max-w-[320px] text-[14px] leading-[1.8] text-euro-soft">
            Can&apos;t find what you&apos;re after? We&apos;re happy to help.
          </p>
          <Link href="/contact" className="btn-euro-outline mt-1 self-start text-euro-ink hover:bg-euro-ink hover:text-white">
            Contact us
          </Link>
        </div>

        <ul className="divide-y divide-euro-line border-y border-euro-line">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <span className="text-[13px] font-medium uppercase tracking-[0.12em] text-euro-ink transition-opacity group-hover:opacity-70">
                    {item.q}
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    aria-hidden="true"
                    className={`flex-none text-euro-ink transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                  >
                    <path d="M12 4v16M4 12h16" />
                  </svg>
                </button>
                <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="min-h-0 overflow-hidden">
                    <p className="max-w-[640px] pb-6 text-[14px] leading-[1.8] text-euro-soft [&_a]:text-euro-ink [&_strong]:font-medium [&_strong]:text-euro-text">
                      {item.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
