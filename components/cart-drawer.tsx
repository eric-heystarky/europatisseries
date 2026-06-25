"use client";

import { useEffect } from "react";
import { useCart, lineUnitPrice } from "./cart-context";
import { formatPrice } from "@/lib/format";

export function CartDrawer({ currency = "AUD" }: { currency?: string }) {
  const { lines, subtotalCents, setQty, remove, clear, drawerOpen, closeDrawer } = useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeDrawer]);

  return (
    <div className={`fixed inset-0 z-[60] ${drawerOpen ? "visible" : "invisible"}`} aria-hidden={!drawerOpen}>
      <div
        className={`absolute inset-0 bg-primary/40 transition-opacity ${
          drawerOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeDrawer}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l-2 border-border bg-background transition-transform ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Your order"
      >
        <header className="flex items-center justify-between border-b-2 border-border px-5 py-4">
          <h2 className="text-sm font-extrabold uppercase tracking-[0.2em]">Your Order</h2>
          <button
            onClick={closeDrawer}
            aria-label="Close cart"
            className="border-2 border-border px-2 leading-none hover:bg-primary hover:text-primary-foreground"
          >
            ✕
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 items-center justify-center px-5 text-center text-sm uppercase tracking-[0.15em] text-muted-foreground">
            Your cart is empty.
          </div>
        ) : (
          <ul className="flex-1 divide-y-2 divide-border overflow-y-auto px-5">
            {lines.map((line) => (
              <li key={line.key} className="py-4">
                <div className="flex justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold uppercase tracking-wide">{line.itemName}</p>
                    {(line.variationName && !["Each", "Slice"].includes(line.variationName)) ||
                    line.modifiers.length > 0 ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {[line.variationName, ...line.modifiers.map((m) => m.name)]
                          .filter((s) => s && !["Each", "Slice"].includes(s))
                          .join(" · ")}
                      </p>
                    ) : null}
                  </div>
                  <span className="whitespace-nowrap text-sm tabular-nums">
                    {formatPrice(lineUnitPrice(line) * line.quantity, currency)}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center border-2 border-border text-sm">
                    <button
                      onClick={() => setQty(line.key, line.quantity - 1)}
                      className="px-2.5 py-1 hover:bg-primary hover:text-primary-foreground"
                      aria-label="Decrease"
                    >
                      −
                    </button>
                    <span className="w-7 text-center tabular-nums">{line.quantity}</span>
                    <button
                      onClick={() => setQty(line.key, line.quantity + 1)}
                      className="px-2.5 py-1 hover:bg-primary hover:text-primary-foreground"
                      aria-label="Increase"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => remove(line.key)}
                    className="text-xs uppercase tracking-[0.15em] text-muted-foreground underline-offset-2 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {lines.length > 0 && (
          <footer className="border-t-2 border-border px-5 py-4">
            <div className="flex justify-between text-sm font-bold uppercase tracking-[0.15em]">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatPrice(subtotalCents, currency)}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Tax & any delivery fee calculated at checkout.
            </p>
            <a href="/checkout" onClick={closeDrawer} className="btn-brutal mt-4 w-full py-3 text-sm">
              Go to Checkout
            </a>
            <button
              onClick={clear}
              className="mt-2 w-full text-center text-xs uppercase tracking-[0.15em] text-muted-foreground hover:underline"
            >
              Clear cart
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
