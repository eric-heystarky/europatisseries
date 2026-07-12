"use client";

import { useCart } from "./cart-context";
import { formatPrice } from "@/lib/format";
import { cateringStatus, CATERING_TIERS, CATERING_MIN_CENTS } from "@/lib/catering";

/**
 * Sticky bottom bar (catering only) that nudges the order toward its next
 * milestone: the $100 minimum, free delivery at $150, then each volume-discount
 * tier. Reads the live cart subtotal and fills a progress bar toward the next
 * unlock. Hidden until the cart has something in it.
 */
export function DiscountProgressBar({ currency = "AUD" }: { currency?: string }) {
  const { subtotalCents, count, openDrawer } = useCart();
  if (count === 0) return null;

  const s = cateringStatus(subtotalCents);
  const money = (c: number) => formatPrice(c, currency);

  // Headline message, chosen by the nearest unmet milestone.
  let message: React.ReactNode;
  if (s.belowMin) {
    message = (
      <>
        Add <strong>{money(s.minRemainingCents)}</strong> to reach the{" "}
        <strong>{money(CATERING_MIN_CENTS)}</strong> catering minimum
      </>
    );
  } else if (s.nextTier) {
    message = (
      <>
        Spend <strong>{money(s.toNextCents)}</strong> more to unlock{" "}
        <strong>{s.nextTier.pct}% off</strong>
        {s.currentPct > 0 && (
          <span className="text-primary-foreground/70">
            {" "}
            · {s.currentPct}% applied now
          </span>
        )}
      </>
    );
  } else {
    message = (
      <>
        🎉 Max discount unlocked — <strong>{s.currentPct}% off</strong>{" "}
        <span className="text-primary-foreground/70">
          (−{money(s.discountCents)})
        </span>
      </>
    );
  }

  const topTier = CATERING_TIERS[CATERING_TIERS.length - 1].pct;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-primary-foreground/20 bg-primary text-primary-foreground shadow-[0_-4px_0_0_hsl(var(--primary))]">
      <div className="mx-auto flex max-w-4xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <p className="truncate text-sm font-medium sm:text-base">{message}</p>
            <p className="flex-none text-xs uppercase tracking-[0.15em] text-primary-foreground/70">
              {money(subtotalCents)}
              {s.currentPct > 0 && (
                <span className="ml-1 text-primary-foreground">
                  → {money(s.totalAfterDiscountCents)}
                </span>
              )}
            </p>
          </div>

          {/* Segmented progress toward the top tier: min → 5 → 7 → 9 → 11%. */}
          <div className="mt-2 flex items-center gap-2">
            <div
              className="relative h-2 flex-1 overflow-hidden border-2 border-primary-foreground/30 bg-primary-foreground/10"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round((s.currentPct / topTier) * 100)}
            >
              <div
                className="h-full bg-primary-foreground transition-[width] duration-500 ease-out"
                style={{ width: `${Math.round(s.progress * 100)}%` }}
              />
            </div>
            <span className="flex-none text-[10px] font-bold uppercase tracking-wider text-primary-foreground/70">
              {s.currentPct}%
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={openDrawer}
          className="flex-none border-2 border-primary-foreground bg-primary-foreground px-5 py-2 text-sm font-bold uppercase tracking-widest text-primary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_hsl(var(--primary-foreground))]"
        >
          View cart ({count})
        </button>
      </div>

      {!s.freeDeliveryUnlocked && !s.belowMin && (
        <div className="border-t border-primary-foreground/15 px-4 py-1.5 text-center text-[11px] uppercase tracking-[0.12em] text-primary-foreground/70">
          {money(s.toFreeDeliveryCents)} more for free delivery
        </div>
      )}
    </div>
  );
}
