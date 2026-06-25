"use client";

import { useState } from "react";
import type { Menu, MenuItem } from "@/lib/menu";
import { formatPrice, slugify } from "@/lib/format";
import { useCart } from "./cart-context";
import { ItemDialog } from "./item-dialog";

export function MenuClient({ menu }: { menu: Menu }) {
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const { count, subtotalCents, openDrawer } = useCart();

  return (
    <>
      {/* Hero */}
      <section className="border-b-2 border-border bg-primary px-5 py-20 text-center text-primary-foreground">
        <p className="text-xs uppercase tracking-[0.35em] text-primary-foreground/60">
          Les Collections
        </p>
        <h1 className="font-display text-7xl leading-none md:text-8xl">pre-order</h1>
        <p className="mx-auto mt-4 max-w-md text-sm uppercase tracking-[0.15em] text-primary-foreground/70">
          Premium European pastries & catering, made in Armadale. Pickup or delivery.
        </p>
      </section>

      <div className="mx-auto max-w-5xl px-5 pb-24">
        {menu.categories.length === 0 && (
          <p className="py-20 text-center uppercase tracking-[0.15em] text-muted-foreground">
            No items published yet.
          </p>
        )}

        {menu.categories.map((category) => (
          <section key={category.id} id={slugify(category.name)} className="scroll-mt-28 pt-16">
            <h2 className="border-b-2 border-border pb-3 font-serif text-3xl font-semibold uppercase tracking-wide md:text-4xl">
              {category.name}
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {category.items.map((item) => {
                const prices = item.variations.map((v) => v.priceCents);
                const min = prices.length ? Math.min(...prices) : 0;
                const multi = item.variations.length > 1;
                const hasOptions = multi || item.modifierLists.length > 0;
                return (
                  <article
                    key={item.id}
                    className="flex flex-col border-2 border-border bg-card transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--color-primary)]"
                  >
                    {item.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-48 w-full border-b-2 border-border object-cover grayscale transition duration-500 hover:grayscale-0"
                      />
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="font-serif text-xl font-semibold">{item.name}</h3>
                        <span className="whitespace-nowrap font-bold tabular-nums">
                          {multi ? "from " : ""}
                          {formatPrice(min, menu.currency)}
                        </span>
                      </div>
                      {item.description && (
                        <p className="mt-1 flex-1 text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                      <button
                        onClick={() => setActiveItem(item)}
                        className="btn-brutal mt-5 py-2.5 text-xs"
                      >
                        {hasOptions ? "Choose options" : "Add to cart"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}

        {/* Contact */}
        <section id="contact" className="scroll-mt-28 border-t-2 border-border pt-16 mt-20">
          <h2 className="font-serif text-3xl font-semibold uppercase tracking-wide">Visit Us</h2>
          <div className="mt-6 grid gap-6 text-sm md:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Address</p>
              <p className="mt-2">974 High St, Armadale VIC 3143</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Hours</p>
              <p className="mt-2">Tues–Sun · 7am–3pm</p>
              <p>Monday · Closed</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Contact</p>
              <p className="mt-2">hello@europatisserie.com</p>
              <p>(03) 9822 1234</p>
            </div>
          </div>
        </section>
      </div>

      {/* Floating cart bar */}
      {count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-border bg-background">
          <div className="mx-auto max-w-5xl px-5 py-3">
            <button onClick={openDrawer} className="btn-brutal w-full justify-between px-4 py-3 text-sm">
              <span className="flex items-center gap-2">
                <span className="inline-flex h-6 min-w-6 items-center justify-center bg-primary-foreground px-1.5 text-xs text-primary tabular-nums">
                  {count}
                </span>
                View Order
              </span>
              <span className="tabular-nums">{formatPrice(subtotalCents, menu.currency)}</span>
            </button>
          </div>
        </div>
      )}

      {activeItem && (
        <ItemDialog
          item={activeItem}
          currency={menu.currency}
          onClose={() => setActiveItem(null)}
        />
      )}
    </>
  );
}
