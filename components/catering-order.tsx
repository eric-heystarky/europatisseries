"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
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
    const variation =
      item.variations.reduce((min, v) => (v.priceCents < min.priceCents ? v : min), item.variations[0]);
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
  const addItem = useAddItem();
  const { openDrawer } = useCart();

  const addPack = (pack: PackDef) => {
    const { lines, itemCount } = resolvePack(pack, byName);
    if (lines.length === 0) {
      toast.error("That pack is unavailable right now.");
      return;
    }
    for (const l of lines) addItem(l.item, l.qty);
    toast.success(`${pack.title} added — ${itemCount} items`);
    openDrawer();
  };

  return (
    <div className="mx-auto max-w-6xl px-5 pb-40 pt-12">
      {/* ───────── Guided event planner ───────── */}
      <EventPlanner menu={menu} byName={byName} />

      {/* ───────── Themed packs ───────── */}
      <div className="mt-24 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
          Or browse all packs
        </p>
        <h2 className="mt-1 font-shorelines text-5xl md:text-6xl">Catering Packs</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          Curated from our best-sellers. Add a pack, mix a few, or build your own
          below — then unlock up to 11% off as your order grows.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {CATERING_PACKS.map((pack) => {
          const { lines, totalCents, itemCount } = resolvePack(pack, byName);
          const hero = lines.find((l) => l.item.imageUrl)?.item.imageUrl ?? null;
          return (
            <div
              key={pack.id}
              className="flex flex-col border-2 border-primary bg-card shadow-[4px_4px_0_0_hsl(var(--primary))]"
            >
              <div className="flex gap-4 p-5">
                {hero && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={hero}
                    alt=""
                    className="h-24 w-24 flex-none border-2 border-primary object-cover"
                  />
                )}
                <div className="min-w-0">
                  <h3 className="font-serif text-xl font-bold uppercase tracking-wide">
                    {pack.title}
                  </h3>
                  <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    {pack.serves} · {itemCount} items
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{pack.blurb}</p>
                </div>
              </div>

              <ul className="flex-1 space-y-1 border-t-2 border-dashed border-primary/30 px-5 py-4 text-sm">
                {lines.map((l) => (
                  <li key={l.item.id} className="flex justify-between gap-2">
                    <span className="text-foreground/80">
                      {l.qty}× {l.item.name}
                    </span>
                    <span className="flex-none text-muted-foreground">
                      {formatPrice(l.unitCents * l.qty, menu.currency)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between border-t-2 border-primary p-5">
                <p className="text-lg font-bold">{formatPrice(totalCents, menu.currency)}</p>
                <button
                  type="button"
                  onClick={() => addPack(pack)}
                  className="border-2 border-primary bg-primary px-5 py-2 text-sm font-bold uppercase tracking-widest text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_hsl(var(--primary))]"
                >
                  Add pack
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ───────── Build your own pack ───────── */}
      <CustomPackBuilder menu={menu} />
    </div>
  );
}

/**
 * Guided planner: the client enters a headcount and occasion, and we recommend
 * the right pack(s) and quantities — a suggested order they can add in one tap.
 */
function EventPlanner({
  menu,
  byName,
}: {
  menu: Menu;
  byName: Map<string, MenuItem>;
}) {
  const addItem = useAddItem();
  const { openDrawer } = useCart();
  const [guests, setGuests] = useState(20);
  const [style, setStyle] = useState<EventStyleId>("mixed");

  const g = Math.max(1, guests || 1);
  const recs = recommendPacks(g, style);

  // Resolve each recommended pack against the live menu for pricing + contents.
  const resolved = recs.map((r) => ({
    ...r,
    resolved: resolvePack(r.pack, byName),
  }));
  const totalCents = resolved.reduce(
    (s, r) => s + r.resolved.totalCents * r.qty,
    0,
  );
  const totalPieces = resolved.reduce(
    (s, r) => s + r.resolved.itemCount * r.qty,
    0,
  );
  const perPerson = totalPieces / g;
  const status = cateringStatus(totalCents);

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
    toast.success(`Suggested order added — ${totalPieces} pieces for ${g} guests`);
    openDrawer();
  };

  const money = (c: number) => formatPrice(c, menu.currency);

  return (
    <div className="border-2 border-primary bg-primary text-primary-foreground shadow-[6px_6px_0_0_hsl(var(--primary))]">
      <div className="p-6 text-center sm:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-primary-foreground/60">
          Let us plan it for you
        </p>
        <h2 className="mt-1 font-shorelines text-5xl md:text-6xl">
          Planning an event?
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-primary-foreground/75">
          Tell us the numbers and the vibe — we&rsquo;ll suggest the perfect
          spread, ready to add in one tap.
        </p>
      </div>

      <div className="grid gap-px bg-primary-foreground/20 md:grid-cols-[1fr_1fr]">
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
            {EVENT_STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStyle(s.id)}
                className={`flex flex-col items-start border-2 p-3 text-left transition-colors ${
                  style === s.id
                    ? "border-primary-foreground bg-primary-foreground text-primary"
                    : "border-primary-foreground/40 hover:border-primary-foreground"
                }`}
              >
                <span className="text-xl leading-none">{s.emoji}</span>
                <span className="mt-1.5 text-sm font-bold leading-tight">
                  {s.label}
                </span>
                <span
                  className={`text-[11px] ${
                    style === s.id ? "text-primary/70" : "text-primary-foreground/60"
                  }`}
                >
                  {s.hint}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Suggested spread */}
      <div className="border-t-2 border-primary-foreground/20 bg-primary-foreground p-6 text-primary sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-serif text-xl font-bold uppercase tracking-wide">
            Your suggested spread
          </h3>
          <p className="text-xs uppercase tracking-[0.15em] text-primary/60">
            ~{perPerson.toFixed(1)} pieces / guest · {totalPieces} pieces total
          </p>
        </div>

        <ul className="mt-4 space-y-2">
          {resolved.map((r) => (
            <li
              key={r.pack.id}
              className="flex items-center justify-between gap-3 border-2 border-primary/20 p-3"
            >
              <span className="font-semibold">
                {r.qty}× {r.pack.title}
                <span className="ml-2 text-xs font-normal uppercase tracking-wide text-primary/50">
                  {r.pack.serves}
                </span>
              </span>
              <span className="flex-none font-bold tabular-nums">
                {money(r.resolved.totalCents * r.qty)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-col gap-4 border-t-2 border-primary/20 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-2xl font-bold">
              {money(totalCents)}
              {status.currentPct > 0 && (
                <span className="ml-2 text-base font-medium text-primary/70">
                  → {money(status.totalAfterDiscountCents)} with {status.currentPct}% off
                </span>
              )}
            </p>
            <p className="text-xs uppercase tracking-[0.12em] text-primary/60">
              {status.currentPct > 0
                ? `Unlocks ${status.currentPct}% catering discount`
                : status.nextTier
                  ? `Add ${money(status.toNextCents)} to unlock ${status.nextTier.pct}% off`
                  : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={addSuggested}
            className="flex-none border-2 border-primary bg-primary px-6 py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_hsl(var(--primary))]"
          >
            Add this order to cart
          </button>
        </div>
      </div>
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
    setQty((q) => {
      const next = Math.max(0, (q[id] ?? 0) + delta);
      return { ...q, [id]: next };
    });

  const addCustom = () => {
    if (selected.length === 0) return;
    for (const [id, n] of selected) {
      const it = itemById.get(id);
      if (it) addItem(it, n);
    }
    toast.success(`Your pack added — ${totalItems} items`);
    setQty({});
    openDrawer();
  };

  const cat = foodCats.find((c) => c.id === activeCat) ?? foodCats[0];

  return (
    <div className="mt-20 border-2 border-primary bg-card shadow-[4px_4px_0_0_hsl(var(--primary))]">
      <div className="border-b-2 border-primary p-6 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
          Your call
        </p>
        <h3 className="mt-1 font-shorelines text-4xl md:text-5xl">Build Your Own Pack</h3>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
          Pick any mix of items and quantities. It all counts toward your discount.
        </p>
      </div>

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

      {/* Items in the active category */}
      <div className="grid gap-3 p-4 sm:grid-cols-2">
        {cat?.items.map((it) => {
          const n = qty[it.id] ?? 0;
          return (
            <div
              key={it.id}
              className={`flex items-center gap-3 border-2 p-3 transition-colors ${
                n > 0 ? "border-primary bg-primary/5" : "border-primary/20"
              }`}
            >
              {it.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={it.imageUrl}
                  alt=""
                  className="h-14 w-14 flex-none border-2 border-primary/40 object-cover"
                />
              ) : (
                <div className="h-14 w-14 flex-none border-2 border-primary/20 bg-muted" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{it.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatPrice(unit(it), menu.currency)}
                </p>
              </div>
              <div className="flex flex-none items-center gap-2">
                <button
                  type="button"
                  aria-label={`Remove one ${it.name}`}
                  onClick={() => bump(it.id, -1)}
                  disabled={n === 0}
                  className="h-8 w-8 border-2 border-primary font-bold leading-none disabled:opacity-30"
                >
                  −
                </button>
                <span className="w-5 text-center text-sm font-bold tabular-nums">{n}</span>
                <button
                  type="button"
                  aria-label={`Add one ${it.name}`}
                  onClick={() => bump(it.id, 1)}
                  className="h-8 w-8 border-2 border-primary bg-primary font-bold leading-none text-primary-foreground"
                >
                  +
                </button>
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
