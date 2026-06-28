"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import type { Menu, MenuItem } from "@/lib/menu";
import { formatPrice, slugify } from "@/lib/format";
import { useCart } from "./cart-context";
import { ItemDialog } from "./item-dialog";

export function MenuClient({ menu }: { menu: Menu }) {
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { count, subtotalCents, openDrawer } = useCart();

  const q = query.trim().toLowerCase();

  // Apply the category filter + text search, dropping empty categories.
  const visibleCategories = useMemo(() => {
    return menu.categories
      .filter((c) => activeCategory === "all" || c.id === activeCategory)
      .map((c) => ({
        ...c,
        items: c.items.filter(
          (it) =>
            !q ||
            it.name.toLowerCase().includes(q) ||
            it.description.toLowerCase().includes(q),
        ),
      }))
      .filter((c) => c.items.length > 0);
  }, [menu.categories, activeCategory, q]);

  const resultCount = visibleCategories.reduce((n, c) => n + c.items.length, 0);
  const isFiltering = q !== "" || activeCategory !== "all";

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

      {/* Sticky search + category filter toolbar */}
      <div className="sticky top-[102px] z-30 border-b-2 border-border bg-background/95 backdrop-blur md:top-[120px]">
        <div className="mx-auto max-w-2xl px-5 py-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the menu…"
              aria-label="Search the menu"
              className="field-brutal pl-9 pr-9"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            <CategoryPill active={activeCategory === "all"} onClick={() => setActiveCategory("all")}>
              All
            </CategoryPill>
            {menu.categories.map((c) => (
              <CategoryPill
                key={c.id}
                active={activeCategory === c.id}
                onClick={() => setActiveCategory(c.id)}
              >
                {c.name}
              </CategoryPill>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-5 pb-24">
        {isFiltering && (
          <p className="pt-6 text-xs uppercase tracking-[0.15em] text-muted-foreground">
            {resultCount} {resultCount === 1 ? "item" : "items"}
            {q && (
              <>
                {" "}
                for “<span className="text-foreground">{query}</span>”
              </>
            )}
          </p>
        )}

        {visibleCategories.length === 0 && (
          <p className="py-20 text-center uppercase tracking-[0.15em] text-muted-foreground">
            No items match your search.
          </p>
        )}

        {visibleCategories.map((category) => (
          <section key={category.id} id={slugify(category.name)} className="scroll-mt-44 pt-10">
            <h2 className="font-serif text-2xl font-semibold uppercase tracking-wide md:text-3xl">
              {category.name}
            </h2>
            {/* Square-style tappable rows: text left, thumbnail right. */}
            <ul className="mt-4 border-t-2 border-border">
              {category.items.map((item) => {
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
                        <h3 className="font-serif text-lg font-semibold leading-tight">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                            {item.description}
                          </p>
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
                          className="h-24 w-24 flex-none border-2 border-border object-cover sm:h-28 sm:w-28"
                        />
                      ) : (
                        <span
                          aria-hidden
                          className="flex h-24 w-24 flex-none items-center justify-center border-2 border-border bg-card text-3xl font-light text-primary/30 transition group-hover:bg-primary group-hover:text-primary-foreground sm:h-28 sm:w-28"
                        >
                          +
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

        {/* Contact — only on the unfiltered view */}
        {!isFiltering && (
          <section id="contact" className="scroll-mt-44 border-t-2 border-border pt-16 mt-20">
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
        )}
      </div>

      {/* Floating cart bar */}
      {count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-border bg-background">
          <div className="mx-auto max-w-2xl px-5 py-3">
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

function CategoryPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`min-h-11 whitespace-nowrap border-2 border-border px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] transition ${
        active ? "bg-primary text-primary-foreground" : "bg-card hover:bg-primary/10"
      }`}
    >
      {children}
    </button>
  );
}
