"use client";

import { AnimatedSection } from "@/components/AnimatedSection";
import type { Menu } from "@/lib/menu";
import { CateringOrder } from "@/components/catering-order";
import { DiscountProgressBar } from "@/components/discount-progress-bar";

export default function Catering({ menu }: { menu: Menu }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      {/* Compact hero — the planner does the heavy lifting right below it */}
      <AnimatedSection className="border-b-2 border-primary bg-primary px-4 pb-16 pt-20 text-primary-foreground md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-primary-foreground/60">
            Euro Patisserie · Catering &amp; Events
          </p>
          <h1 className="mb-4 mt-2 font-shorelines text-6xl md:text-7xl">catering made easy</h1>
          <p className="mx-auto max-w-xl text-base font-medium text-primary-foreground/85 md:text-lg">
            Tell us your headcount and we&rsquo;ll put together the perfect spread from
            our best-sellers — ready in one tap. Order 24 hours ahead for pickup or delivery.
          </p>
        </div>
      </AnimatedSection>

      <CateringOrder menu={menu} />

      {/* Sticky discount-progress nudge (catering only) */}
      <DiscountProgressBar currency={menu.currency} />
    </div>
  );
}
