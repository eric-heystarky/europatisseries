/**
 * Catering ordering rules — themed packs, the order minimum, free-delivery
 * threshold, and the tiered volume discount. Pure/isomorphic (no server-only
 * imports) so both the packs UI and the sticky progress bar can use it.
 *
 * Packs reference catalog items by exact Square name and are priced live from
 * the menu (sum of their components), so pricing never drifts from Square. The
 * catering saving is the tiered % discount below, applied once the subtotal
 * clears each threshold.
 */

import type { Menu, MenuItem } from "./menu";

export const CATERING_MIN_CENTS = 10_000; // $100 minimum catering order
/**
 * Free-delivery threshold shown in the catering progress bar. Mirrors the live,
 * site-wide checkout waiver (`FREE_DELIVERY_THRESHOLD_CENTS` in lib/delivery.ts,
 * which is server-only and can't be imported client-side). Keep the two in sync.
 */
export const CATERING_FREE_DELIVERY_CENTS = 15_000; // free delivery at $150

/** Volume discount tiers, ascending. `pct` applies to the whole subtotal. */
export const CATERING_TIERS = [
  { thresholdCents: 17_500, pct: 5 },
  { thresholdCents: 20_000, pct: 7 },
  { thresholdCents: 22_500, pct: 9 },
  { thresholdCents: 25_000, pct: 11 },
] as const;

export type PackComponent = { name: string; qty: number };
export type PackDef = {
  id: string;
  title: string;
  blurb: string;
  serves: string;
  /** Numeric headcount this pack comfortably serves — drives the planner math. */
  servesCount: number;
  /** Tags used by the event planner to match a pack to an occasion. */
  styles: EventStyleId[];
  components: PackComponent[];
};

export type EventStyleId = "breakfast" | "morning-tea" | "lunch" | "mixed";

/**
 * The four themed packs, each built from the top 12-month sellers in its
 * categories. Component `name` must match the Square item name exactly.
 */
export const CATERING_PACKS: PackDef[] = [
  {
    id: "savoury-lunch",
    title: "Savoury Lunch Platter",
    blurb: "Our best-selling wraps, focaccias and toasties — cut for grazing.",
    serves: "Serves 8–10",
    servesCount: 9,
    styles: ["lunch"],
    components: [
      { name: "Wraps - Chicken & Dill", qty: 2 },
      { name: "Wraps - Turkey & Cranberry", qty: 1 },
      { name: "Wraps - Chicken Schnitzel", qty: 1 },
      { name: "Focaccia - Chicken & Dill", qty: 2 },
      { name: "Focaccia - Vegetarian", qty: 1 },
      { name: "Toastie - Chicken & Avocado", qty: 2 },
      { name: "Toastie - Ham Cheese Tomato", qty: 1 },
    ],
  },
  {
    id: "hot-savoury",
    title: "Hot Savoury Party Pack",
    blurb: "Party pies, mini sausage rolls, mini quiche and pasties — warm bites.",
    serves: "Serves 10 · ~25 bites",
    servesCount: 10,
    styles: ["lunch"],
    components: [
      { name: "Party Pie Plain Steak", qty: 8 },
      { name: "Party Pie Chicken Mushroom", qty: 4 },
      { name: "Party Pie Steak Pepper", qty: 4 },
      { name: "Sausage Roll mini", qty: 8 },
      { name: "Salmon Quiche Mini", qty: 4 },
      { name: "Pasties Veggie", qty: 2 },
      { name: "Pasties Spinach Fetta", qty: 2 },
    ],
  },
  {
    id: "sweet-morning-tea",
    title: "Sweet / Morning Tea Pack",
    blurb: "Macarons, fruit tarts, éclairs and vanilla slices — an assorted spread.",
    serves: "Serves 10–12",
    servesCount: 11,
    styles: ["morning-tea"],
    components: [
      { name: "Macarons", qty: 12 },
      { name: "Tart Strawberry", qty: 3 },
      { name: "Tart Raspberry", qty: 3 },
      { name: "Eclairs Chocolate", qty: 3 },
      { name: "Vanilla Slice (Mille-Feuille)", qty: 3 },
    ],
  },
  {
    id: "breakfast-pastry",
    title: "Breakfast Pastry Pack",
    blurb: "Croissants, pain aux raisin and choc croissants — plus mini croissants.",
    serves: "Serves 8–10",
    servesCount: 9,
    styles: ["breakfast"],
    components: [
      { name: "Croissant", qty: 4 },
      { name: "Pain Aux Raisin (Escargot)", qty: 3 },
      { name: "Choc Croissant (pain au chocolat)", qty: 3 },
      { name: "Croissant - Mini", qty: 4 },
      { name: "Croissant - Mini Choc", qty: 4 },
    ],
  },
  {
    id: "grand-grazing",
    title: "Grand Grazing Table",
    blurb:
      "A generous savoury-and-sweet spread — wraps, party pies, mini quiche, macarons and tarts for a proper grazing table.",
    serves: "Serves 20–25",
    servesCount: 25,
    styles: ["mixed"],
    components: [
      { name: "Wraps - Chicken & Dill", qty: 4 },
      { name: "Wraps - Turkey & Cranberry", qty: 3 },
      { name: "Wraps - Chicken Schnitzel", qty: 3 },
      { name: "Focaccia - Chicken & Dill", qty: 2 },
      { name: "Focaccia - Vegetarian", qty: 2 },
      { name: "Party Pie Plain Steak", qty: 12 },
      { name: "Party Pie Chicken Mushroom", qty: 6 },
      { name: "Sausage Roll mini", qty: 12 },
      { name: "Salmon Quiche Mini", qty: 6 },
      { name: "Macarons", qty: 20 },
      { name: "Tart Strawberry", qty: 4 },
      { name: "Tart Raspberry", qty: 4 },
      { name: "Eclairs Chocolate", qty: 6 },
    ],
  },
  {
    id: "celebration-feast",
    title: "The Celebration Feast",
    blurb:
      "Our biggest spread — the full savoury range plus an abundant sweet selection. Built to feed a crowd at a launch, wedding or big office do.",
    serves: "Serves 45–50",
    servesCount: 50,
    styles: ["mixed"],
    components: [
      { name: "Wraps - Chicken & Dill", qty: 6 },
      { name: "Wraps - Turkey & Cranberry", qty: 5 },
      { name: "Wraps - Chicken Schnitzel", qty: 5 },
      { name: "Wraps - Tuna", qty: 4 },
      { name: "Focaccia - Chicken & Dill", qty: 3 },
      { name: "Focaccia - Chicken & Pesto", qty: 3 },
      { name: "Focaccia - Vegetarian", qty: 2 },
      { name: "Party Pie Plain Steak", qty: 20 },
      { name: "Party Pie Chicken Mushroom", qty: 10 },
      { name: "Party Pie Steak Pepper", qty: 10 },
      { name: "Sausage Roll mini", qty: 20 },
      { name: "Salmon Quiche Mini", qty: 10 },
      { name: "Pasties Veggie", qty: 4 },
      { name: "Pasties Spinach Fetta", qty: 4 },
      { name: "Macarons", qty: 30 },
      { name: "Tart Strawberry", qty: 6 },
      { name: "Tart Raspberry", qty: 6 },
      { name: "Eclairs Chocolate", qty: 10 },
      { name: "Vanilla Slice (Mille-Feuille)", qty: 8 },
    ],
  },
];

export type EventStyle = {
  id: EventStyleId;
  label: string;
  emoji: string;
  hint: string;
  image: string;
};

/** The occasions a client picks from in the planner. */
export const EVENT_STYLES: EventStyle[] = [
  { id: "breakfast", label: "Breakfast", emoji: "🥐", hint: "Croissants & pastries", image: "/images/catering/croissant-flatlay.jpg" },
  { id: "morning-tea", label: "Morning / Afternoon Tea", emoji: "🍰", hint: "Sweet treats", image: "/images/catering/lemon-tart.jpg" },
  { id: "lunch", label: "Lunch", emoji: "🥪", hint: "Wraps, toasties & hot bites", image: "/images/featured/chicken-wrap.jpg" },
  { id: "mixed", label: "Mixed Grazing", emoji: "🎉", hint: "A bit of everything", image: "/images/catering/buffet.jpg" },
];

export type Recommendation = { pack: PackDef; qty: number };

/**
 * Suggest which packs (and how many of each) best cover a headcount for a given
 * occasion. Big groups lean on the large packs to minimise the item count;
 * smaller ones scale the matching themed pack.
 */
export function recommendPacks(guests: number, style: EventStyleId): Recommendation[] {
  const g = Math.max(1, Math.round(guests));

  if (style === "mixed") {
    // Small mixed groups: pair a savoury + a sweet pack for variety without
    // over-serving a 25-person grazing table.
    if (g < 18) {
      const savoury = CATERING_PACKS.find((p) => p.id === "savoury-lunch")!;
      const sweet = CATERING_PACKS.find((p) => p.id === "sweet-morning-tea")!;
      return [
        { pack: savoury, qty: Math.max(1, Math.round(g / savoury.servesCount)) },
        { pack: sweet, qty: Math.max(1, Math.round(g / sweet.servesCount)) },
      ];
    }
    // Fill with Celebration Feasts (50), then a Grand Grazing (25) for a large
    // remainder — otherwise a single Grand Grazing scaled to the group.
    const feast = CATERING_PACKS.find((p) => p.id === "celebration-feast")!;
    const graze = CATERING_PACKS.find((p) => p.id === "grand-grazing")!;
    const recs: Recommendation[] = [];
    const feastQty = Math.floor(g / 45);
    if (feastQty > 0) recs.push({ pack: feast, qty: feastQty });
    const remainder = g - feastQty * 50;
    if (remainder >= 13) recs.push({ pack: graze, qty: 1 });
    else if (remainder > 0 && feastQty === 0)
      recs.push({ pack: graze, qty: Math.max(1, Math.round(g / graze.servesCount)) });
    return recs.length ? recs : [{ pack: graze, qty: 1 }];
  }

  // Single-theme occasions: scale the matching pack to the headcount.
  const pack =
    CATERING_PACKS.find((p) => p.styles.includes(style)) ??
    CATERING_PACKS.find((p) => p.id === "grand-grazing")!;
  return [{ pack, qty: Math.max(1, Math.round(g / pack.servesCount)) }];
}

/**
 * Food categories offered in the "build your own pack" picker. Everything else
 * on the live menu (coffee, tea, fridge drinks, etc.) is excluded — catering is
 * food only. Matched case-insensitively against the trimmed category name.
 */
export const CATERING_FOOD_CATEGORIES = [
  "Pastry",
  "Cakes",
  "Pies and Sausages",
  "Wraps",
  "Toasties",
  "Focaccia",
  "Quiche",
  "Pasties",
];

/** Lowercased name → MenuItem, for resolving pack components against the menu. */
export function indexMenuByName(menu: Menu): Map<string, MenuItem> {
  const map = new Map<string, MenuItem>();
  for (const cat of menu.categories) {
    for (const item of cat.items) map.set(item.name.trim().toLowerCase(), item);
  }
  return map;
}

export type ResolvedComponent = {
  item: MenuItem;
  qty: number;
  unitCents: number;
};

/** Resolve a pack's components against the live menu (skips missing items). */
export function resolvePack(
  pack: PackDef,
  byName: Map<string, MenuItem>,
): { lines: ResolvedComponent[]; totalCents: number; itemCount: number } {
  const lines: ResolvedComponent[] = [];
  for (const c of pack.components) {
    const item = byName.get(c.name.trim().toLowerCase());
    if (!item || item.variations.length === 0) continue;
    const unitCents = Math.min(...item.variations.map((v) => v.priceCents));
    lines.push({ item, qty: c.qty, unitCents });
  }
  const totalCents = lines.reduce((s, l) => s + l.unitCents * l.qty, 0);
  const itemCount = lines.reduce((s, l) => s + l.qty, 0);
  return { lines, totalCents, itemCount };
}

export type CateringStatus = {
  /** Below the $100 minimum. */
  belowMin: boolean;
  minRemainingCents: number;
  /** Discount % currently unlocked (0 if none). */
  currentPct: number;
  /** Next tier to chase, or null if at the top. */
  nextTier: { thresholdCents: number; pct: number } | null;
  toNextCents: number;
  /** Fractional progress (0–1) from the previous milestone to the next. */
  progress: number;
  freeDeliveryUnlocked: boolean;
  toFreeDeliveryCents: number;
  discountCents: number;
  totalAfterDiscountCents: number;
};

/** Where an order stands against the catering minimum, delivery and discounts. */
export function cateringStatus(subtotalCents: number): CateringStatus {
  const belowMin = subtotalCents < CATERING_MIN_CENTS;

  let currentPct = 0;
  for (const t of CATERING_TIERS) {
    if (subtotalCents >= t.thresholdCents) currentPct = t.pct;
  }
  const nextTier = CATERING_TIERS.find((t) => subtotalCents < t.thresholdCents) ?? null;

  // Previous milestone floor for the progress bar: the min, then each tier.
  const milestones = [CATERING_MIN_CENTS, ...CATERING_TIERS.map((t) => t.thresholdCents)];
  const prevFloor = milestones.filter((m) => subtotalCents >= m).pop() ?? 0;
  const nextFloor = nextTier?.thresholdCents ?? milestones[milestones.length - 1];
  const span = Math.max(1, nextFloor - prevFloor);
  const progress = nextTier
    ? Math.min(1, Math.max(0, (subtotalCents - prevFloor) / span))
    : 1;

  const discountCents = Math.round((subtotalCents * currentPct) / 100);

  return {
    belowMin,
    minRemainingCents: Math.max(0, CATERING_MIN_CENTS - subtotalCents),
    currentPct,
    nextTier,
    toNextCents: nextTier ? nextTier.thresholdCents - subtotalCents : 0,
    progress,
    freeDeliveryUnlocked: subtotalCents >= CATERING_FREE_DELIVERY_CENTS,
    toFreeDeliveryCents: Math.max(0, CATERING_FREE_DELIVERY_CENTS - subtotalCents),
    discountCents,
    totalAfterDiscountCents: subtotalCents - discountCents,
  };
}
