"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Menu, MenuItem, MenuCategory } from "@/lib/menu";
import { formatPrice } from "@/lib/format";
import { useCart } from "./cart-context";
import { ItemDialog } from "./item-dialog";

export function MenuClient({ menu }: { menu: Menu }) {
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const { count, subtotalCents, openDrawer } = useCart();
  const contentRef = useRef<HTMLDivElement>(null);

  const openCategory = menu.categories.find((c) => c.id === openId) ?? null;

  const goTo = (id: string | null) => {
    setOpenId(id);
    requestAnimationFrame(() =>
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  return (
    <>
      {/* Hero */}
      <section className="border-b-2 border-border bg-primary px-5 py-20 text-center text-primary-foreground">
        <p className="text-xs uppercase tracking-[0.35em] text-primary-foreground/60">Les Collections</p>
        <h1 className="font-display text-7xl leading-none md:text-8xl">menu</h1>
        <p className="mx-auto mt-4 max-w-md text-sm uppercase tracking-[0.15em] text-primary-foreground/70">
          Premium European pastries &amp; catering, made in Armadale. Pickup or delivery.
        </p>
      </section>

      <div ref={contentRef} className="mx-auto max-w-4xl scroll-mt-[110px] px-5 pb-24 md:scroll-mt-[128px]">
        {!openCategory ? (
          /* ───────── Browse by category ───────── */
          <>
            <h2 className="pt-10 font-serif text-2xl font-semibold uppercase tracking-wide md:text-3xl">
              Browse by category
            </h2>

            {menu.categories.length === 0 ? (
              <p className="py-20 text-center uppercase tracking-[0.15em] text-muted-foreground">
                No items available right now.
              </p>
            ) : (
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {menu.categories.map((cat) => (
                  <CategoryCard key={cat.id} category={cat} onOpen={() => goTo(cat.id)} />
                ))}
              </div>
            )}

            {/* Contact */}
            <section id="contact" className="mt-20 scroll-mt-44 border-t-2 border-border pt-16">
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
          </>
        ) : (
          /* ───────── Selected category ───────── */
          <>
            <button
              onClick={() => goTo(null)}
              className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> All categories
            </button>
            <h2 className="mt-4 border-b-2 border-border pb-3 font-serif text-3xl font-semibold uppercase tracking-wide md:text-4xl">
              {openCategory.name}
            </h2>

            {/* Mobile: Square-style tappable rows */}
            <ul className="mt-4 border-t-2 border-border md:hidden">
              {openCategory.items.map((item) => {
                const prices = item.variations.map((v) => v.priceCents);
                const min = prices.length ? Math.min(...prices) : 0;
                const multi = item.variations.length > 1;
                const hasOptions = multi || item.modifierLists.length > 0;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveItem(item)}
                      className="group flex w-full items-stretch gap-4 border-b-2 border-border py-4 text-left transition hover:bg-primary/5"
                    >
                      <div className="flex min-w-0 flex-1 flex-col">
                        <h3 className="font-serif text-lg font-semibold leading-tight">{item.name}</h3>
                        {item.description && (
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                        )}
                        <div className="mt-auto flex items-center gap-3 pt-2">
                          <span className="font-bold tabular-nums">
                            {multi ? "from " : ""}
                            {formatPrice(min, menu.currency)}
                          </span>
                          {hasOptions && (
                            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                              Options
                            </span>
                          )}
                        </div>
                      </div>
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                          className="h-24 w-24 flex-none border-2 border-border object-cover"
                        />
                      ) : (
                        <span
                          aria-hidden
                          className="flex h-24 w-24 flex-none items-center justify-center border-2 border-border bg-card text-3xl font-light text-primary/30 transition group-hover:bg-primary group-hover:text-primary-foreground"
                        >
                          +
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Tablet & desktop: grid with photos */}
            <div className="mt-8 hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
              {openCategory.items.map((item, i) => {
                const prices = item.variations.map((v) => v.priceCents);
                const min = prices.length ? Math.min(...prices) : 0;
                const multi = item.variations.length > 1;
                const hasOptions = multi || item.modifierLists.length > 0;
                return (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: (i % 3) * 0.07 }}
                    className="group/item flex flex-col border-2 border-border bg-card transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_hsl(var(--primary))]"
                  >
                    {/* Photo + add-to-cart button revealed on hover */}
                    <div className="relative aspect-square w-full overflow-hidden border-b-2 border-border bg-card">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition duration-500 group-hover/item:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-5xl font-light text-primary/20">
                          +
                        </div>
                      )}
                      <button
                        onClick={() => setActiveItem(item)}
                        className="absolute inset-x-0 bottom-0 translate-y-full bg-primary/90 py-3.5 text-center text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground opacity-0 backdrop-blur-sm transition-all duration-300 group-hover/item:translate-y-0 group-hover/item:opacity-100"
                      >
                        {hasOptions ? "Choose Options" : "Add to Cart"}
                      </button>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="font-serif text-xl font-semibold">{item.name}</h3>
                        <span className="whitespace-nowrap font-bold tabular-nums">
                          {multi ? "from " : ""}
                          {formatPrice(min, menu.currency)}
                        </span>
                      </div>
                      {item.description && (
                        <p className="mt-1 flex-1 text-sm text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Floating cart bar */}
      {count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-border bg-background">
          <div className="mx-auto max-w-4xl px-5 py-3">
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
        <ItemDialog item={activeItem} currency={menu.currency} onClose={() => setActiveItem(null)} />
      )}
    </>
  );
}

/** A category "folder" card. On desktop, the cursor becomes a round arrow button. */
function CategoryCard({ category, onOpen }: { category: MenuCategory; onOpen: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const img = category.items.find((i) => i.imageUrl)?.imageUrl;

  const track = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <button
      ref={ref}
      onClick={onOpen}
      onMouseEnter={(e) => {
        setHover(true);
        track(e);
      }}
      onMouseLeave={() => setHover(false)}
      onMouseMove={track}
      className="group relative flex aspect-[16/10] w-full flex-col justify-end overflow-hidden border-2 border-border bg-primary text-left text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_hsl(var(--primary))] md:cursor-none"
    >
      {img && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img}
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-500 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />

      {/* Cursor-following arrow button (desktop only) */}
      <span
        aria-hidden
        style={{ left: pos.x, top: pos.y }}
        className={`pointer-events-none absolute z-20 hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary-foreground text-primary shadow-lg transition-opacity duration-200 md:flex ${
          hover ? "opacity-100" : "opacity-0"
        }`}
      >
        <ArrowRight className="h-5 w-5" />
      </span>

      <div className="relative z-10 flex items-end justify-between gap-3 p-5">
        <div className="min-w-0">
          <h3 className="font-shorelines text-3xl leading-none md:text-4xl">{category.name}</h3>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.15em] text-primary-foreground/70">
            {category.items.length} {category.items.length === 1 ? "item" : "items"}
          </p>
        </div>
        {/* Static arrow for touch devices (desktop uses the cursor button). */}
        <ArrowRight className="h-5 w-5 flex-none md:hidden" />
      </div>
    </button>
  );
}
