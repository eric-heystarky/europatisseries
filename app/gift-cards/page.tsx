import type { Metadata } from "next";
import { Gift, Mail, CreditCard } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";

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
    icon: CreditCard,
    title: "Choose & pay",
    body: "Pick a value (or any custom amount) and pay securely — checkout is powered by Square.",
  },
  {
    icon: Mail,
    title: "Sent by email",
    body: "The card is emailed to your recipient instantly, or schedule it to arrive on the perfect day.",
  },
  {
    icon: Gift,
    title: "They treat themselves",
    body: "Redeemable in-store on everything — pastries, cakes, coffee and catering.",
  },
];

export default function GiftCardsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b-2 border-primary bg-primary px-5 py-20 text-center text-primary-foreground">
        <p className="text-xs uppercase tracking-[0.35em] text-primary-foreground/60">The perfect treat</p>
        <h1 className="mt-2 font-shorelines text-6xl leading-none md:text-8xl">Gift Cards</h1>
        <p className="mx-auto mt-4 max-w-md text-sm uppercase tracking-[0.15em] text-primary-foreground/70">
          Give the gift of fresh European pastry.
        </p>
      </section>

      {/* Card visual + amounts */}
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2 md:items-center">
        <AnimatedSection>
          {/* Gift card mockup */}
          <div className="relative aspect-[16/10] w-full border-2 border-primary bg-primary p-7 text-primary-foreground shadow-[10px_10px_0_0_hsl(var(--primary))]">
            <div className="flex h-full flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="text-sm font-bold uppercase tracking-[0.25em]">eGift Card</span>
                <Gift className="h-7 w-7" strokeWidth={1.25} />
              </div>
              <div>
                <p className="font-shorelines text-4xl leading-none md:text-5xl">Euro Patisserie</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.4em] text-primary-foreground/70">Armadale</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <h2 className="font-serif text-3xl font-semibold uppercase tracking-wide md:text-4xl">
            Any occasion, any amount
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Birthdays, thank-yous, or just because — a Euro Patisserie eGift card never disappoints. Buy online
            in seconds and it&apos;s emailed straight to your recipient.
          </p>

          {/* Amount tiles double as quick "buy" entry points */}
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {AMOUNTS.map((a) => (
              <a
                key={a}
                href={GIFT_CARD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center border-2 border-primary bg-card py-4 text-lg font-bold tabular-nums transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground hover:shadow-[3px_3px_0_0_hsl(var(--primary))]"
              >
                {a}
              </a>
            ))}
          </div>

          <a
            href={GIFT_CARD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brutal mt-7 flex w-full items-center justify-center gap-2 py-3.5 text-sm"
          >
            Buy a gift card →
          </a>
          <p className="mt-3 text-xs text-muted-foreground">
            Secure checkout powered by Square. Also available to purchase in-store at 974 High St, Armadale.
          </p>
        </AnimatedSection>
      </section>

      {/* How it works */}
      <section className="border-t-2 border-primary bg-secondary px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <AnimatedSection>
            <h2 className="border-b-2 border-primary pb-3 font-serif text-3xl font-semibold uppercase tracking-wide md:text-4xl">
              How it works
            </h2>
          </AnimatedSection>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.1} className="border-2 border-primary bg-background p-7">
                <s.icon className="h-8 w-8" strokeWidth={1.25} />
                <h3 className="mt-4 font-serif text-xl font-semibold uppercase tracking-wide">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
