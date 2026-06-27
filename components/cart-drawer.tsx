"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart, lineUnitPrice } from "./cart-context";
import { formatPrice } from "@/lib/format";

const HIDDEN_VARIATIONS = ["Each", "Slice", "Regular"];

export function CartDrawer({ currency = "AUD" }: { currency?: string }) {
  const { lines, count, subtotalCents, setQty, remove, clear, drawerOpen, closeDrawer } = useCart();

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
    <div className={`fixed inset-0 z-[60] ${drawerOpen ? "visible" : "invisible"}`} aria-hidden={!drawerOpen}>
      <div
        className={`absolute inset-0 bg-primary/40 transition-opacity ${
          drawerOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeDrawer}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l-2 border-border bg-background transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Your order"
      >
        <header className="flex items-center justify-between border-b-2 border-border px-5 py-4">
          <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.2em]">
            <ShoppingBag className="h-4 w-4" />
            Your Cart
            {count > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center bg-primary px-1 text-[11px] text-primary-foreground tabular-nums">
                {count}
              </span>
            )}
          </h2>
          <button
            onClick={closeDrawer}
            aria-label="Close cart"
            className="border-2 border-border p-1 transition hover:bg-primary hover:text-primary-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" strokeWidth={1.25} />
            <p className="text-sm uppercase tracking-[0.15em] text-muted-foreground">Your cart is empty.</p>
            <Link href="/pre-order" onClick={closeDrawer} className="btn-brutal-outline px-5 py-2.5 text-xs">
              Browse the Menu
            </Link>
          </div>
        ) : (
          <ul className="flex-1 divide-y-2 divide-border overflow-y-auto">
            {lines.map((line) => {
              const subline = [line.variationName, ...line.modifiers.map((m) => m.name)]
                .filter((s) => s && !HIDDEN_VARIATIONS.includes(s))
                .join(" · ");
              return (
                <li key={line.key} className="flex gap-3 p-4">
                  {/* Thumbnail */}
                  <div className="h-20 w-20 flex-none border-2 border-border bg-card">
                    {line.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={line.imageUrl} alt={line.itemName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <ShoppingBag className="h-6 w-6" strokeWidth={1.25} />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <p className="font-bold uppercase leading-tight tracking-wide">{line.itemName}</p>
                      <button
                        onClick={() => remove(line.key)}
                        aria-label={`Remove ${line.itemName}`}
                        className="flex-none text-muted-foreground transition hover:text-primary"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {subline && <p className="mt-0.5 truncate text-xs text-muted-foreground">{subline}</p>}

                    <div className="mt-auto flex items-center justify-between pt-2">
                      {/* Quantity stepper */}
                      <div className="flex items-center border-2 border-border text-sm">
                        <button
                          onClick={() => setQty(line.key, line.quantity - 1)}
                          className="px-2 py-1 hover:bg-primary hover:text-primary-foreground"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center tabular-nums">{line.quantity}</span>
                        <button
                          onClick={() => setQty(line.key, line.quantity + 1)}
                          className="px-2 py-1 hover:bg-primary hover:text-primary-foreground"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="whitespace-nowrap text-sm font-bold tabular-nums">
                        {formatPrice(lineUnitPrice(line) * line.quantity, currency)}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {lines.length > 0 && (
          <footer className="border-t-2 border-border px-5 py-4">
            <div className="flex justify-between text-sm font-bold uppercase tracking-[0.15em]">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatPrice(subtotalCents, currency)}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Tax &amp; any delivery fee calculated at checkout.</p>
            <Link href="/checkout" onClick={closeDrawer} className="btn-brutal mt-4 w-full py-3 text-sm">
              Checkout · {formatPrice(subtotalCents, currency)}
            </Link>
            <button
              onClick={clear}
              className="mt-2 flex w-full items-center justify-center gap-1.5 text-center text-xs uppercase tracking-[0.15em] text-muted-foreground hover:underline"
            >
              <Trash2 className="h-3 w-3" /> Clear cart
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
