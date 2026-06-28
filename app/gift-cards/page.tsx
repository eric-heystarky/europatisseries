import type { Metadata } from "next";
import Link from "next/link";
import { Gift, Store, Mail } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: "Gift Cards",
  description:
    "Give the gift of fresh European pastry. Euro Patisserie Armadale gift cards in any amount — redeemable in-store on pastries, cakes, coffee & catering.",
  alternates: { canonical: "/gift-cards" },
};

const AMOUNTS = ["$25", "$50", "$100", "Custom"];

const STEPS = [
  { icon: Mail, title: "Choose an amount", body: "Pick a value (or any custom amount) and let us know who it's for." },
  { icon: Store, title: "We prepare it", body: "Collect a beautifully presented card in-store, or we'll email a digital one." },
  { icon: Gift, title: "They treat themselves", body: "Redeemable in-store on everything — pastries, cakes, coffee and catering." },
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
                <span className="text-sm font-bold uppercase tracking-[0.25em]">Gift Card</span>
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
            Birthdays, thank-yous, or just because — a Euro Patisserie gift card never disappoints. Choose a value
            below and we&apos;ll sort the rest.
          </p>
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {AMOUNTS.map((a) => (
              <div
                key={a}
                className="flex items-center justify-center border-2 border-primary bg-card py-4 text-lg font-bold tabular-nums"
              >
                {a}
              </div>
            ))}
          </div>
          <Link href="/contact" className="btn-brutal mt-7 w-full py-3.5 text-sm">
            Enquire / Order a Gift Card
          </Link>
          <p className="mt-3 text-xs text-muted-foreground">
            Also available to purchase in-store at 974 High St, Armadale.
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
