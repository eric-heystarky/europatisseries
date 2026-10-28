"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart, lineUnitPrice } from "./cart-context";
import { addDays, dayLabel, firstOrderDay, useOrder } from "./order-context";
import { formatPrice } from "@/lib/format";

const HIDDEN_VARIATIONS = ["Each", "Slice", "Regular"];
// Free delivery on orders over $150 — nudge the customer toward it.
const FREE_DELIVERY_CENTS = 15_000;

export function CartDrawer({ currency = "AUD" }: { currency?: string }) {
  const { lines, count, subtotalCents, setQty, remove, drawerOpen, closeDrawer } = useCart();
  const order = useOrder();
  const router = useRouter();

  // Back to the products, not wherever the page was scrolled: the menu section on this page
  // if there is one (home, /pre-order), otherwise the menu page.
  function continueShopping() {
    closeDrawer();
    const shop = document.getElementById("shop");
    if (!shop) return router.push("/pre-order");
    // Wait a frame for the scroll lock to lift before scrolling.
    requestAnimationFrame(() => shop.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  const freeRemaining = Math.max(0, FREE_DELIVERY_CENTS - subtotalCents);
  const freePct = Math.min(100, Math.round((subtotalCents / FREE_DELIVERY_CENTS) * 100));
  // Items sold out for the chosen day block checkout until the order moves or they're removed.
  const blocked = order.isFirstDay ? lines.filter((l) => l.soldOutToday) : [];
  const nextDay = addDays(firstOrderDay(), 1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeDrawer]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (drawerOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [drawerOpen]);

  return (
    <div className={`fixed inset-0 z-[60] font-jost ${drawerOpen ? "visible" : "invisible"}`} aria-hidden={!drawerOpen}>
      <div
        className={`absolute inset-0 bg-black/35 transition-opacity duration-300 ${drawerOpen ? "opacity-100" : "opacity-0"}`}
        onClick={closeDrawer}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-[480px] flex-col bg-white transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Your bag"
      >
        <header className="flex items-center justify-between border-b border-euro-line px-[30px] py-[22px]">
          <h2 className="text-base font-medium uppercase tracking-[0.18em] text-euro-ink">Your bag ({count})</h2>
          <button onClick={closeDrawer} aria-label="Close bag" className="flex h-[42px] w-[42px] items-center justify-center text-euro-ink">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </header>

        <div className="flex flex-col gap-2 bg-euro-cream px-[30px] py-3.5">
          <span className="text-[12.5px] text-euro-ink">
            {order.mode === "pickup" ? "Pickup" : "Delivery"} · {dayLabel(order.date)}
            {order.time && `, ${order.time}`}
            {" · "}
            {freeRemaining > 0
              ? `${formatPrice(freeRemaining, currency)} away from free delivery`
              : "Free delivery unlocked"}
          </span>
          <div className="h-0.5 bg-white">
            <div className="h-0.5 bg-euro-ink transition-[width] duration-500" style={{ width: `${freePct}%` }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-[30px]">
          {lines.length === 0 ? (
            <div className="flex flex-col items-center gap-5 py-16 text-center">
              <p className="text-[13px] uppercase tracking-[0.14em] text-euro-soft">Your bag is empty</p>
              <button type="button" onClick={continueShopping} className="btn-euro-outline text-euro-ink hover:bg-euro-ink hover:text-white">
                Browse the menu
              </button>
            </div>
          ) : (
            lines.map((line) => {
              const subline = [line.variationName, ...line.modifiers.map((m) => m.name)]
                .filter((s) => s && !HIDDEN_VARIATIONS.includes(s))
                .join(" · ");
              const isBlocked = blocked.includes(line);
              return (
                <article key={line.key} className="flex gap-4 border-b border-euro-line py-5">
                  <div className="h-[105px] w-[84px] flex-none bg-euro-cream">
                    {line.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={line.imageUrl} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex justify-between gap-2.5">
                      <span className="text-[12.5px] font-medium uppercase tracking-[0.12em] text-euro-ink">{line.itemName}</span>
                      <span className="whitespace-nowrap text-[13px] tabular-nums">
                        {formatPrice(lineUnitPrice(line) * line.quantity, currency)}
                      </span>
                    </div>
                    {subline && <span className="text-[12.5px] text-euro-soft">{subline}</span>}
                    {isBlocked && (
                      <span className="text-[11px] uppercase tracking-[0.14em] text-euro-ink">
                        Sold out {dayLabel(order.date).toLowerCase()}
                      </span>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-1">
                      <div className="flex items-center border border-euro-line">
                        <button onClick={() => setQty(line.key, line.quantity - 1)} aria-label="Decrease quantity" className="h-[38px] w-[38px] text-base text-euro-ink">
                          −
                        </button>
                        <span className="w-5 text-center text-[13px] tabular-nums">{line.quantity}</span>
                        <button onClick={() => setQty(line.key, line.quantity + 1)} aria-label="Increase quantity" className="h-[38px] w-[38px] text-base text-euro-ink">
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => remove(line.key)}
                        className="min-h-10 text-[11px] uppercase tracking-[0.14em] text-euro-soft underline underline-offset-4"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {lines.length > 0 && (
          <footer className="flex flex-col gap-2.5 border-t border-euro-line px-[30px] pb-7 pt-[22px]">
            <div className="flex justify-between text-[13px] font-medium uppercase tracking-[0.14em] text-euro-ink">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatPrice(subtotalCents, currency)}</span>
            </div>
            <span className="text-[12.5px] text-euro-soft">Pickup is free. Delivery is $5 per km, worked out at checkout.</span>
            {blocked.length > 0 ? (
              <>
                <div role="alert" className="flex flex-col gap-2.5 bg-euro-cream px-4 py-3.5">
                  <span className="text-[13px] leading-relaxed text-euro-ink">
                    <strong className="font-medium">{blocked.map((l) => l.itemName).join(", ")}</strong>{" "}
                    {blocked.length === 1 ? "is" : "are"} sold out for {dayLabel(order.date).toLowerCase()}. Move your order to{" "}
                    {dayLabel(nextDay).toLowerCase()} or remove {blocked.length === 1 ? "it" : "them"} to continue.
                  </span>
                  <button
                    type="button"
                    onClick={() => order.setWhen(nextDay)}
                    className="h-[38px] self-start border border-euro-ink bg-white px-4 text-[11px] font-medium uppercase tracking-[0.16em] text-euro-ink"
                  >
                    Order for {dayLabel(nextDay).toLowerCase()}
                  </button>
                </div>
                <button disabled className="mt-2 h-[52px] cursor-not-allowed bg-[#A6A9BE] text-[11px] font-medium uppercase tracking-[0.2em] text-white">
                  Proceed to secure checkout
                </button>
              </>
            ) : (
              <Link href="/checkout" onClick={closeDrawer} className="btn-euro mt-2 h-[52px] w-full">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="5" y="11" width="14" height="9" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
                Proceed to secure checkout
              </Link>
            )}
            <button onClick={continueShopping} className="min-h-11 text-[11px] font-medium uppercase tracking-[0.18em] text-euro-ink">
              Continue shopping
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
