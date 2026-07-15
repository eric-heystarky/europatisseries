"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Clock, DollarSign, Truck, ShoppingBag, ChevronDown, Check } from "lucide-react";
import type { Menu, MenuItem } from "@/lib/menu";
import { formatPrice } from "@/lib/format";
import { useCart } from "./cart-context";
import {
  CATERING_PACKS,
  CATERING_FOOD_CATEGORIES,
  EVENT_STYLES,
  recommendPacks,
  cateringStatus,
  indexMenuByName,
  resolvePack,
  type PackDef,
  type EventStyleId,
} from "@/lib/catering";

/** Add a single menu item (cheapest variation, no modifiers) to the cart. */
function useAddItem() {
  const { addLine } = useCart();
  return (item: MenuItem, qty: number) => {
    const variation = item.variations.reduce(
      (min, v) => (v.priceCents < min.priceCents ? v : min),
      item.variations[0],
    );
    if (!variation) return;
    addLine(
      {
        itemId: item.id,
        itemName: item.name,
        variationId: variation.id,
        variationName: variation.name,
        basePriceCents: variation.priceCents,
        modifiers: [],
        imageUrl: item.imageUrl ?? undefined,
      },
      qty,
    );
  };
}

export function CateringOrder({ menu }: { menu: Menu }) {
  const byName = useMemo(() => indexMenuByName(menu), [menu]);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-40">
      {/* 1 — Ready-made packs (the primary path) */}
      <div className="-mt-10">
        <PacksSection menu={menu} byName={byName} />
      </div>

      {/* 2 — Guided planner (secondary path) */}
      <div className="mt-16">
        <EventPlanner menu={menu} byName={byName} />
      </div>

      {/* 3 — Build your own (secondary) */}
      <BuildYourOwn menu={menu} />

      {/* 4 — How catering works (trust strip) — page footer */}
      <HowItWorks currency={menu.currency} />
    </div>
  );
}

/** Reassurance strip: minimum, lead time, fulfilment, free-delivery. */
function HowItWorks({ currency }: { currency: string }) {
  const items = [
    { icon: DollarSign, title: `${formatPrice(10_000, currency)} minimum`, sub: "Per catering order" },
    { icon: Clock, title: "24 hours notice", sub: "So the kitchen can prep" },
    { icon: ShoppingBag, title: "Pickup or delivery", sub: "Your choice at checkout" },
    { icon: Truck, title: "Free over $150", sub: "Delivery within our area" },
  ];
  return (
    <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden border-2 border-primary bg-primary md:grid-cols-4">
      {items.map(({ icon: Icon, title, sub }) => (
        <div key={title} className="flex items-center gap-3 bg-card px-4 py-4">
          <Icon className="h-6 w-6 flex-none" strokeWidth={1.5} />
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase leading-tight tracking-wide">{title}</p>
            <p className="text-xs text-muted-foreground">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Guided planner: headcount + occasion → a recommended spread framed around
 * guests and per-head value, added in one tap.
 */
function EventPlanner({ menu, byName }: { menu: Menu; byName: Map<string, MenuItem> }) {
  const addItem = useAddItem();
  const { openDrawer } = useCart();
  const [guests, setGuests] = useState(10);
  const [style, setStyle] = useState<EventStyleId>("lunch");
  const [open, setOpen] = useState(false);

  const g = Math.max(1, guests || 1);
  const recs = recommendPacks(g, style);
  const resolved = recs.map((r) => ({ ...r, resolved: resolvePack(r.pack, byName) }));
  const totalCents = resolved.reduce((s, r) => s + r.resolved.totalCents * r.qty, 0);
  const totalPieces = resolved.reduce((s, r) => s + r.resolved.itemCount * r.qty, 0);
  const servesTotal = resolved.reduce((s, r) => s + r.pack.servesCount * r.qty, 0);
  const status = cateringStatus(totalCents);
  const money = (c: number) => formatPrice(c, menu.currency);
  const perHead = money(Math.round(totalCents / g));

  const addSuggested = () => {
    let added = false;
    for (const r of resolved) {
      for (let i = 0; i < r.qty; i++) {
        for (const l of r.resolved.lines) {
          addItem(l.item, l.qty);
          added = true;
        }
      }
    }
    if (!added) {
      toast.error("That suggestion is unavailable right now.");
      return;
    }
    toast.success(`Added — enough for about ${g} guests`);
    openDrawer();
  };

  return (
    <div className="border-2 border-primary bg-primary text-primary-foreground shadow-[6px_6px_0_0_hsl(var(--primary))]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-6 text-left sm:px-8"
      >
        <span>
          <span className="text-xs uppercase tracking-[0.35em] text-primary-foreground/60">
            Or, need a hand?
          </span>
          <span className="mt-1 block font-shorelines text-5xl md:text-6xl">Plan my spread</span>
          <span className="mt-1 block max-w-md text-sm text-primary-foreground/75">
            {open
              ? "Two quick questions and we’ll put together the perfect order."
              : "Tap to answer two quick questions — we’ll suggest the perfect order."}
          </span>
        </span>
        <ChevronDown
          className={`h-8 w-8 flex-none transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
      <>
      <div className="grid gap-px bg-primary-foreground/20 md:grid-cols-2">
        {/* Step 1 — headcount */}
        <div className="bg-primary p-6 sm:p-8">
          <label className="text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground/60">
            1 · How many guests?
          </label>
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              aria-label="Fewer guests"
              onClick={() => setGuests((n) => Math.max(1, n - 5))}
              className="h-12 w-12 flex-none border-2 border-primary-foreground text-2xl font-bold leading-none"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              value={guests}
              onChange={(e) => setGuests(Math.max(1, Number(e.target.value) || 1))}
              className="h-12 w-full min-w-0 border-2 border-primary-foreground bg-transparent text-center text-2xl font-bold tabular-nums text-primary-foreground focus:outline-none"
            />
            <button
              type="button"
              aria-label="More guests"
              onClick={() => setGuests((n) => n + 5)}
              className="h-12 w-12 flex-none border-2 border-primary-foreground bg-primary-foreground text-2xl font-bold leading-none text-primary"
            >
              +
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {[10, 25, 50, 100].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setGuests(n)}
                className={`border-2 px-3 py-1 text-xs font-bold uppercase tracking-widest transition-colors ${
                  guests === n
                    ? "border-primary-foreground bg-primary-foreground text-primary"
                    : "border-primary-foreground/40 hover:border-primary-foreground"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2 — occasion */}
        <div className="bg-primary p-6 sm:p-8">
          <label className="text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground/60">
            2 · What&rsquo;s the occasion?
          </label>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {EVENT_STYLES.map((s) => {
              const active = style === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStyle(s.id)}
                  aria-pressed={active}
                  className={`group relative aspect-[4/3] overflow-hidden border-2 text-left transition-all ${
                    active
                      ? "border-primary-foreground shadow-[4px_4px_0_0_hsl(var(--primary-foreground))]"
                      : "border-primary-foreground/40 hover:border-primary-foreground"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.image}
                    alt={s.label}
                    className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                      active ? "" : "opacity-90"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-primary/5" />
                  {active && (
                    <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center border-2 border-primary bg-primary-foreground text-primary">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-3 text-primary-foreground">
                    <span className="block text-sm font-bold uppercase leading-tight tracking-wide [text-shadow:0_1px_6px_rgba(0,0,0,0.5)]">
                      {s.label}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-primary-foreground/80">
                      {s.hint}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="border-t-2 border-primary-foreground/20 bg-primary-foreground p-6 text-primary sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-serif text-lg font-bold uppercase tracking-wide">
            For {g} {g === 1 ? "guest" : "guests"}, we suggest
          </h3>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary/60">
            Feeds ~{servesTotal} · {perHead}/guest
          </p>
        </div>

        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {resolved.map((r) => {
            const hero = r.resolved.lines.find((l) => l.item.imageUrl)?.item.imageUrl ?? null;
            return (
              <li
                key={r.pack.id}
                className="relative aspect-[4/5] overflow-hidden border-2 border-primary shadow-[3px_3px_0_0_hsl(var(--primary))]"
              >
                {hero ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={hero} alt={r.pack.title} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-primary" />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/85" />
                {r.qty > 1 && (
                  <span className="absolute left-2 top-2 flex h-7 min-w-7 items-center justify-center border-2 border-white bg-white px-1.5 text-sm font-bold tabular-nums text-primary">
                    {r.qty}×
                  </span>
                )}
                <h4 className="absolute inset-x-3 top-3 pr-8 font-serif text-sm font-bold uppercase leading-tight tracking-wide text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.6)]">
                  {r.pack.title}
                </h4>
                <div className="absolute inset-x-3 bottom-3 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-white/85">
                    {r.pack.serves}
                  </p>
                  <p className="mt-0.5 text-base font-bold [text-shadow:0_1px_6px_rgba(0,0,0,0.6)]">
                    {money(r.resolved.totalCents * r.qty)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 flex flex-col gap-4 border-t-2 border-primary/15 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-3xl font-bold">
              {money(totalCents)}
              {status.currentPct > 0 && (
                <span className="ml-2 text-base font-medium text-primary/70">
                  → {money(status.totalAfterDiscountCents)} after {status.currentPct}% off
                </span>
              )}
            </p>
            <p className="text-xs uppercase tracking-[0.12em] text-primary/60">
              {totalPieces} pieces ·{" "}
              {status.currentPct > 0
                ? `${status.currentPct}% catering discount applied`
                : status.nextTier
                  ? `Add ${money(status.toNextCents)} to save ${status.nextTier.pct}%`
                  : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={addSuggested}
            className="flex-none border-2 border-primary bg-primary px-6 py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_hsl(var(--primary))]"
          >
            Add to cart →
          </button>
        </div>
        <p className="mt-3 text-center text-xs text-primary/50 sm:text-left">
          Not quite right? Adjust the numbers above, browse ready-made packs, or
          build your own below.
        </p>
      </div>
      </>
      )}
    </div>
  );
}

/** Ready-made packs — image-led cards with collapsible contents + per-head price. */
function PacksSection({ menu, byName }: { menu: Menu; byName: Map<string, MenuItem> }) {
  const addItem = useAddItem();
  const { openDrawer } = useCart();

  const addPack = (pack: PackDef) => {
    const { lines, itemCount } = resolvePack(pack, byName);
    if (lines.length === 0) {
      toast.error("That pack is unavailable right now.");
      return;
    }
    for (const l of lines) addItem(l.item, l.qty);
    toast.success(`${pack.title} added — ${itemCount} pieces`);
    openDrawer();
  };

  return (
    <div className="mt-16">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
          Best-sellers · ready in one tap
        </p>
        <h2 className="mt-1 font-shorelines text-4xl md:text-5xl">Pick a Ready-Made Platter</h2>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {CATERING_PACKS.map((pack) => {
          const { lines, totalCents, itemCount } = resolvePack(pack, byName);
          const hero = lines.find((l) => l.item.imageUrl)?.item.imageUrl ?? null;
          const perHead = formatPrice(Math.round(totalCents / pack.servesCount), menu.currency);
          return (
            <div key={pack.id} className="flex">
              {/* Mobile: image-first tile with the label + price on the photo */}
              <div className="relative aspect-[4/5] w-full overflow-hidden border-2 border-primary shadow-[4px_4px_0_0_hsl(var(--primary))] sm:hidden">
                {hero ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={hero} alt={pack.title} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-primary" />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/85" />
                <h3 className="absolute inset-x-3 top-3 font-serif text-base font-bold uppercase leading-tight tracking-wide text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.55)]">
                  {pack.title}
                </h3>
                <div className="absolute inset-x-3 bottom-3 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-white/85">
                    {pack.serves} · ~{perHead}/guest
                  </p>
                  <div className="mt-1.5 flex items-center justify-between gap-2">
                    <span className="text-lg font-bold [text-shadow:0_1px_6px_rgba(0,0,0,0.55)]">
                      {formatPrice(totalCents, menu.currency)}
                    </span>
                    <button
                      type="button"
                      onClick={() => addPack(pack)}
                      className="border-2 border-white bg-white px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary active:scale-95"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Tablet / desktop: full detailed card */}
              <div className="hidden flex-1 flex-col border-2 border-primary bg-card shadow-[4px_4px_0_0_hsl(var(--primary))] sm:flex">
                {hero && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={hero}
                    alt={pack.title}
                    className="aspect-[4/3] w-full border-b-2 border-primary object-cover"
                  />
                )}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-serif text-xl font-bold uppercase tracking-wide">
                    {pack.title}
                  </h3>
                  <p className="mt-0.5 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    {pack.serves} · ~{perHead}/guest
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{pack.blurb}</p>

                  <details className="group mt-3">
                    <summary className="flex cursor-pointer list-none items-center gap-1 text-xs font-bold uppercase tracking-widest text-primary [&::-webkit-details-marker]:hidden">
                      See what&rsquo;s inside
                      <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <ul className="mt-2 space-y-1 text-sm text-foreground/70">
                      {lines.map((l) => (
                        <li key={l.item.id}>
                          {l.qty}× {l.item.name}
                        </li>
                      ))}
                    </ul>
                  </details>

                  <div className="mt-auto flex items-end justify-between pt-4">
                    <div>
                      <p className="text-lg font-bold">{formatPrice(totalCents, menu.currency)}</p>
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                        {itemCount} pieces
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addPack(pack)}
                      className="border-2 border-primary bg-primary px-5 py-2 text-sm font-bold uppercase tracking-widest text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_hsl(var(--primary))]"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Collapsible wrapper around the item-by-item builder (secondary path). */
function BuildYourOwn({ menu }: { menu: Menu }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-16">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 border-2 border-primary bg-card p-5 text-left shadow-[4px_4px_0_0_hsl(var(--primary))]"
      >
        <span>
          <span className="font-shorelines text-3xl md:text-4xl">Build your own pack</span>
          <span className="mt-0.5 block text-sm text-muted-foreground">
            Prefer full control? Pick any mix of items — it all counts toward your discount.
          </span>
        </span>
        <ChevronDown
          className={`h-7 w-7 flex-none transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <CustomPackBuilder menu={menu} />}
    </div>
  );
}

/** A "make your own pack" picker: choose food items + quantities, add in one go. */
function CustomPackBuilder({ menu }: { menu: Menu }) {
  const addItem = useAddItem();
  const { openDrawer } = useCart();
  const [qty, setQty] = useState<Record<string, number>>({});

  // Only food categories, in the configured order, each with its items.
  const foodCats = useMemo(() => {
    const want = CATERING_FOOD_CATEGORIES.map((c) => c.toLowerCase());
    return menu.categories
      .filter((c) => want.includes(c.name.trim().toLowerCase()) && c.items.length > 0)
      .sort(
        (a, b) =>
          want.indexOf(a.name.trim().toLowerCase()) -
          want.indexOf(b.name.trim().toLowerCase()),
      );
  }, [menu]);

  const [activeCat, setActiveCat] = useState(foodCats[0]?.id ?? "");
  const itemById = useMemo(() => {
    const m = new Map<string, MenuItem>();
    for (const c of menu.categories) for (const it of c.items) m.set(it.id, it);
    return m;
  }, [menu]);

  const unit = (it: MenuItem) =>
    it.variations.length ? Math.min(...it.variations.map((v) => v.priceCents)) : 0;

  const selected = Object.entries(qty).filter(([, n]) => n > 0);
  const totalCents = selected.reduce((s, [id, n]) => {
    const it = itemById.get(id);
    return it ? s + unit(it) * n : s;
  }, 0);
  const totalItems = selected.reduce((s, [, n]) => s + n, 0);

  const bump = (id: string, delta: number) =>
    setQty((q) => ({ ...q, [id]: Math.max(0, (q[id] ?? 0) + delta) }));

  const addCustom = () => {
    if (selected.length === 0) return;
    for (const [id, n] of selected) {
      const it = itemById.get(id);
      if (it) addItem(it, n);
    }
    toast.success(`Your pack added — ${totalItems} pieces`);
    setQty({});
    openDrawer();
  };

  const cat = foodCats.find((c) => c.id === activeCat) ?? foodCats[0];

  return (
    <div className="border-x-2 border-b-2 border-primary bg-card">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 border-b-2 border-primary/20 p-4">
        {foodCats.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveCat(c.id)}
            className={`border-2 px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors ${
              c.id === (cat?.id ?? "")
                ? "border-primary bg-primary text-primary-foreground"
                : "border-primary/40 bg-transparent text-foreground hover:border-primary"
            }`}
          >
            {c.name.trim()}
          </button>
        ))}
      </div>

      {/* Items in the active category — image-first tiles like the packs */}
      <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {cat?.items.map((it) => {
          const n = qty[it.id] ?? 0;
          return (
            <div
              key={it.id}
              className={`relative aspect-[4/5] overflow-hidden border-2 border-primary shadow-[3px_3px_0_0_hsl(var(--primary))] transition-all ${
                n > 0 ? "ring-2 ring-primary ring-offset-2 ring-offset-card" : ""
              }`}
            >
              {it.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={it.imageUrl}
                  alt={it.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-primary" />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85" />
              <h4 className="absolute inset-x-3 top-3 font-serif text-sm font-bold uppercase leading-tight tracking-wide text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.6)]">
                {it.name}
              </h4>
              <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 text-white">
                <span className="text-sm font-bold [text-shadow:0_1px_6px_rgba(0,0,0,0.6)]">
                  {formatPrice(unit(it), menu.currency)}
                </span>
                {n === 0 ? (
                  <button
                    type="button"
                    aria-label={`Add ${it.name}`}
                    onClick={() => bump(it.id, 1)}
                    className="border-2 border-white bg-white px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary active:scale-95"
                  >
                    Add
                  </button>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <button
                      type="button"
                      aria-label={`Remove one ${it.name}`}
                      onClick={() => bump(it.id, -1)}
                      className="flex h-7 w-7 items-center justify-center border-2 border-white bg-black/30 text-base font-bold leading-none text-white backdrop-blur-sm active:scale-95"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-sm font-bold tabular-nums [text-shadow:0_1px_6px_rgba(0,0,0,0.6)]">
                      {n}
                    </span>
                    <button
                      type="button"
                      aria-label={`Add one ${it.name}`}
                      onClick={() => bump(it.id, 1)}
                      className="flex h-7 w-7 items-center justify-center border-2 border-white bg-white text-base font-bold leading-none text-primary active:scale-95"
                    >
                      +
                    </button>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom-pack summary + add */}
      <div className="sticky bottom-0 flex items-center justify-between gap-4 border-t-2 border-primary bg-card p-5">
        <p className="text-sm">
          <span className="font-bold">{totalItems}</span> items ·{" "}
          <span className="font-bold">{formatPrice(totalCents, menu.currency)}</span>
        </p>
        <button
          type="button"
          onClick={addCustom}
          disabled={selected.length === 0}
          className="border-2 border-primary bg-primary px-6 py-2 text-sm font-bold uppercase tracking-widest text-primary-foreground transition-all duration-200 enabled:hover:-translate-y-0.5 enabled:hover:shadow-[3px_3px_0_0_hsl(var(--primary))] disabled:opacity-40"
        >
          Add my pack
        </button>
      </div>
    </div>
  );
}
