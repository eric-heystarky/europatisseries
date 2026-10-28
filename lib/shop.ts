/**
 * Homepage shop model. Shapes the Square menu into the tabs agreed with Kham
 * (five core tabs, the rest behind "More") and classifies each item's options
 * into what the customer must choose vs. optional add-ons. Pure/isomorphic:
 * built on the server, rendered on the client.
 */
import type { Menu, MenuItem, MenuModifier } from "./menu";
import { CATERING_PACKS, indexMenuByName, resolvePack } from "./catering";

/** A choice the customer must make before adding (e.g. Fresh / Warm / Toasted, size). */
export type ShopChoiceGroup = {
  id: string;
  title: string;
  /** "variation" groups pick the Square variation; "modifier" groups pick one modifier. */
  kind: "variation" | "modifier";
  choices: { id: string; name: string; priceCents: number }[];
};

export type ShopItem = {
  id: string;
  name: string;
  /** Square's own name, kept for the cart/order. */
  squareName: string;
  description: string;
  imageUrl: string | null;
  fromCents: number;
  /** Single variation used when there's no variation group. */
  variationId: string;
  variationName: string;
  groups: ShopChoiceGroup[];
  /** Optional extras (multi-select). */
  addOns: MenuModifier[];
  soldOutToday?: boolean;
};

export type ShopTab = {
  id: string;
  name: string;
  layout: "grid" | "list";
  items: ShopItem[];
};

export type ShopPack = {
  id: string;
  title: string;
  blurb: string;
  serves: string;
  servesCount: number;
  totalCents: number;
  imageUrl: string | null;
  lines: { itemId: string; name: string; variationId: string; variationName: string; unitCents: number; qty: number; imageUrl: string | null }[];
};

export type Shop = {
  currency: string;
  core: ShopTab[];
  more: ShopTab[];
  packs: ShopPack[];
  source: "square" | "sample";
};

/** Tabs in display order. `match` is tested against the Square category name. */
const TABS: { id: string; name: string; match: RegExp; layout: "grid" | "list"; core: boolean }[] = [
  { id: "viennoiserie", name: "Viennoiserie", match: /^pastry$/i, layout: "grid", core: true },
  { id: "cakes", name: "Cakes & Slices", match: /^cakes?$/i, layout: "grid", core: true },
  { id: "pies", name: "Pies & Rolls", match: /^pies|^pasties$/i, layout: "grid", core: true },
  { id: "baguettes", name: "Baguettes & Wraps", match: /baguette|^wraps?$/i, layout: "grid", core: true },
  { id: "toasties", name: "Toasties", match: /^toasties$/i, layout: "grid", core: false },
  { id: "quiche", name: "Quiche", match: /^quiche$/i, layout: "grid", core: false },
  { id: "coffee", name: "Coffee", match: /^coffee$/i, layout: "list", core: false },
  { id: "tea", name: "Tea", match: /^tea$/i, layout: "list", core: false },
  { id: "gelato", name: "Gelato", match: /^gelato$/i, layout: "list", core: false },
];

/** POS-only option lists that make no sense online. */
const HIDDEN_LISTS = /eat in|takeaway/i;
/** POS buttons / placeholders that shouldn't be sold online. */
const HIDDEN_ITEMS = /open item|special$|^plaque/i;
/** Variation names that just mean "the one size" and aren't worth showing. */
const PLAIN_VARIATIONS = /^(regular|each|slice|single)$/i;

/** Mock stock for the sample menu only — real stock comes from Square inventory (Phase 4). */
const SAMPLE_SOLD_OUT = new Set(["cruffin", "black forrest slice"]);

/** Styled photos for the platters (Square only has single-item shots). */
const PACK_PHOTOS: Record<string, string> = {
  "savoury-lunch": "/images/catering/cocktails-salees.jpg",
  "hot-savoury": "/images/catering/gourmet-pie.jpg",
  "sweet-morning-tea": "/images/catering/cocktails-sucrees.jpg",
  "breakfast-pastry": "/images/catering/croissant-flatlay.jpg",
  "grand-grazing": "/images/catering/buffet.jpg",
  "celebration-feast": "/images/catering/grand-entremets.jpg",
};

/** "Wraps - Chicken & Dill" → "Chicken & Dill Wrap", "Toastie - Ham Cheese" → "Ham Cheese Toastie". */
export function displayName(name: string): string {
  const n = name.trim();
  const m = n.match(/^(wraps?|baguette|toastie|focaccia)\s*-\s*(.+)$/i);
  if (m) {
    const kind = m[1].toLowerCase().startsWith("wrap") ? "Wrap" : m[1][0].toUpperCase() + m[1].slice(1).toLowerCase();
    return `${m[2].trim()} ${kind}`;
  }
  return n.replace(/Forrest/g, "Forest");
}

function toShopItem(item: MenuItem, sample: boolean): ShopItem | null {
  if (HIDDEN_ITEMS.test(item.name.trim()) || item.variations.length === 0) return null;
  const prices = item.variations.map((v) => v.priceCents);
  const fromCents = Math.min(...prices);
  if (fromCents <= 0) return null;

  const groups: ShopChoiceGroup[] = [];
  const multi = item.variations.length > 1;
  if (multi) {
    groups.push({
      id: `${item.id}-variation`,
      title: /regular|large|small|medium/i.test(item.variations.map((v) => v.name).join(" ")) ? "Size" : "Flavour",
      kind: "variation",
      choices: item.variations.map((v) => ({ id: v.id, name: v.name, priceCents: v.priceCents - fromCents })),
    });
  }

  const addOns: MenuModifier[] = [];
  for (const list of item.modifierLists) {
    if (HIDDEN_LISTS.test(list.name) || list.modifiers.length === 0) continue;
    const hasNone = list.modifiers.some((m) => /^none$/i.test(m.name));
    // A single-choice list without a "None" option is a real choice (e.g. Fresh / Warm / Toasted).
    if (list.selectionType === "SINGLE" && !hasNone) {
      groups.push({ id: list.id, title: list.name, kind: "modifier", choices: list.modifiers });
    } else {
      for (const m of list.modifiers) {
        if (/^none$/i.test(m.name) || /^tomato sauce \d/i.test(m.name)) continue;
        if (!addOns.some((a) => a.name === m.name)) addOns.push(m);
      }
    }
  }

  const v0 = item.variations[0];
  return {
    id: item.id,
    name: displayName(item.name),
    squareName: item.name,
    description: item.description,
    imageUrl: item.imageUrl,
    fromCents,
    variationId: v0.id,
    variationName: PLAIN_VARIATIONS.test(v0.name) ? "" : v0.name,
    groups,
    addOns,
    soldOutToday: sample && SAMPLE_SOLD_OUT.has(item.name.trim().toLowerCase()),
  };
}

export function buildShop(menu: Menu, source: "square" | "sample"): Shop {
  const sample = source === "sample";
  const core: ShopTab[] = [];
  const more: ShopTab[] = [];
  for (const def of TABS) {
    const items = menu.categories
      .filter((c) => def.match.test(c.name.trim()))
      .flatMap((c) => c.items)
      .map((i) => toShopItem(i, sample))
      .filter((i): i is ShopItem => !!i);
    if (items.length === 0) continue;
    // Photographed items first so the grid opens on its best foot; Square order otherwise.
    if (def.layout === "grid") items.sort((a, b) => Number(!!b.imageUrl) - Number(!!a.imageUrl));
    (def.core ? core : more).push({ id: def.id, name: def.name, layout: def.layout, items });
  }

  const byName = indexMenuByName(menu);
  const packs: ShopPack[] = CATERING_PACKS.map((pack) => {
    const r = resolvePack(pack, byName);
    return {
      id: pack.id,
      title: pack.title,
      blurb: pack.blurb,
      serves: pack.serves,
      servesCount: pack.servesCount,
      totalCents: r.totalCents,
      imageUrl: PACK_PHOTOS[pack.id] ?? r.lines.find((l) => l.item.imageUrl)?.item.imageUrl ?? null,
      lines: r.lines.map((l) => {
        const v = l.item.variations.reduce((min, x) => (x.priceCents < min.priceCents ? x : min), l.item.variations[0]);
        return {
          itemId: l.item.id,
          name: l.item.name,
          variationId: v.id,
          variationName: v.name,
          unitCents: l.unitCents,
          qty: l.qty,
          imageUrl: l.item.imageUrl,
        };
      }),
    };
  }).filter((p) => p.lines.length > 0);

  return { currency: menu.currency, core, more, packs, source };
}
