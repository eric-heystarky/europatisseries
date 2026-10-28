import type { Metadata } from "next";
import { AnimatedSection } from "@/components/AnimatedSection";
import { FaqSection } from "@/components/faq-section";

export const metadata: Metadata = {
  title: "Gift Cards",
  description:
    "Give the gift of fresh European pastry. Buy a Euro Patisserie Armadale eGift card online in any amount — emailed instantly and redeemable in-store on pastries, cakes, coffee & catering.",
  alternates: { canonical: "/gift-cards" },
};

/** Square-hosted eGift purchase flow (handles payment, card creation & emailing). */
const GIFT_CARD_URL = "https://app.squareup.com/gift/ML6J1PF8K4AKW/order";

const AMOUNTS = ["$25", "$50", "$100", "Custom"];

const STEPS = [
  {
    title: "Choose & pay",
    body: "Pick a value (or any custom amount) and pay securely — checkout is powered by Square.",
  },
  {
    title: "Sent by email",
    body: "The card is emailed to your recipient instantly, or schedule it to arrive on the perfect day.",
  },
  {
    title: "They treat themselves",
    body: "Redeemable in-store on everything — pastries, cakes, coffee and catering.",
  },
];

export default function GiftCardsPage() {
  return (
    <div className="bg-white">
      {/* Intro */}
      <section className="bg-euro-tint px-6 py-20 text-center md:py-24">
        <AnimatedSection className="mx-auto flex max-w-[640px] flex-col items-center gap-4">
          <p className="euro-eyebrow text-euro-muted">The perfect treat</p>
          <h1 className="euro-heading mr-[-0.2em] text-[clamp(32px,3.8vw,52px)] tracking-[0.2em] text-euro-ink">Gift cards</h1>
          <p className="text-[15px] leading-[1.8] text-euro-soft">Give the gift of fresh European pastry.</p>
        </AnimatedSection>
      </section>

      {/* Card + amounts */}
      <section className="px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto grid max-w-[1180px] items-center gap-14 md:grid-cols-2 md:gap-20">
          <AnimatedSection>
            {/* Card mockup — navy with the framed double edge used on our buttons */}
            <div className="relative aspect-[16/10] w-full bg-euro-accent p-2 shadow-[0_24px_60px_rgba(5,9,48,0.22)]">
              <div className="flex h-full flex-col justify-between border border-euro-edge p-6 text-white md:p-8">
                <span className="text-[10.5px] font-medium uppercase tracking-[0.24em] text-white/75">eGift card</span>
                <span className="flex flex-col items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/logo/euro-patisserie.svg" alt="Euro Patisserie" className="h-auto w-[46%] brightness-0 invert" />
                </span>
                <span className="flex items-end justify-between text-[10.5px] uppercase tracking-[0.24em] text-white/75">
                  <span>Armadale</span>
                  <span>974 High St</span>
                </span>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.15} className="flex flex-col gap-5">
            <p className="euro-eyebrow text-euro-muted">eGift cards</p>
            <h2 className="euro-heading text-[clamp(24px,2.6vw,36px)] text-euro-ink">Any occasion, any amount</h2>
            <p className="max-w-[480px] text-[15px] leading-[1.8] text-euro-soft">
              Birthdays, thank-yous, or just because — a Euro Patisserie eGift card never disappoints. Buy online in
              seconds and it&apos;s emailed straight to your recipient.
            </p>

            {/* Amounts double as quick "buy" entry points */}
            <div className="mt-2 grid max-w-[480px] grid-cols-4 gap-2">
              {AMOUNTS.map((a) => (
                <a
                  key={a}
                  href={GIFT_CARD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 items-center justify-center border border-euro-line text-[13px] font-light tabular-nums tracking-[0.06em] text-euro-ink transition-colors hover:border-euro-ink hover:bg-euro-ink hover:text-white"
                >
                  {a}
                </a>
              ))}
            </div>

            <a href={GIFT_CARD_URL} target="_blank" rel="noopener noreferrer" className="btn-euro mt-1 w-full max-w-[480px]">
              Buy a gift card
            </a>
            <p className="max-w-[480px] text-[12.5px] text-euro-muted">
              Secure checkout powered by Square. Also available to purchase in-store at 974 High St, Armadale.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-euro-tint px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-[1180px]">
          <AnimatedSection className="flex flex-col items-center gap-5 text-center">
            <p className="euro-eyebrow text-euro-muted">Three steps</p>
            <h2 className="euro-heading text-[clamp(26px,2.8vw,40px)] text-euro-ink">How it works</h2>
          </AnimatedSection>
          <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
            {STEPS.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.1} className="flex flex-col gap-3 border-t border-euro-ink pt-6">
                <span className="text-[11px] font-medium tracking-[0.2em] text-euro-muted">0{i + 1}</span>
                <h3 className="euro-label text-euro-ink">{s.title}</h3>
                <p className="text-[14px] leading-[1.75] text-euro-soft">{s.body}</p>
              </AnimatedSection>
            ))}
          </ol>
        </div>
      </section>

      <FaqSection />
    </div>
  );
}
