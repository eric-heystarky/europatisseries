import "server-only";
import { unstable_cache } from "next/cache";
import { square, SQUARE_LOCATION_ID } from "./square";
import type { Square } from "square";

/** Cache tag used by the Square webhook to invalidate the menu on change. */
export const MENU_CACHE_TAG = "menu";

/**
 * Plain, JSON-serializable menu model. Square's SDK returns `bigint` money
 * amounts and deeply-nested catalog objects; we flatten them here so the data
 * can be passed straight into client components (cart, etc.).
 */
export type MenuModifier = {
  id: string;
  name: string;
  priceCents: number;
};

export type MenuModifierList = {
  id: string;
  name: string;
  selectionType: "SINGLE" | "MULTIPLE";
  minSelected: number;
  maxSelected: number;
  modifiers: MenuModifier[];
};

export type MenuVariation = {
  id: string;
  name: string;
  priceCents: number;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  /** All item photos (first is the primary; a second enables hover-swap). */
  imageUrls: string[];
  variations: MenuVariation[];
  modifierLists: MenuModifierList[];
};

export type MenuCategory = {
  id: string;
  name: string;
  items: MenuItem[];
};

export type Menu = {
  currency: string;
  categories: MenuCategory[];
};

const UNCATEGORIZED = "__uncategorized__";

/**
 * Categories that exist in the in-store POS catalog but shouldn't appear on the
 * public ordering site — internal POS buttons, retail goods, and alcohol (which
 * needs liquor licensing / age verification to sell online). Matched by name,
 * case-insensitive. The items stay untouched in Square; they're just not shown.
 */
const HIDDEN_CATEGORIES = new Set([
  "capping machine",
  "retail",
  "alcoholic beverages",
]);

/** Fetch every page of a catalog search, accumulating objects + related objects. */
async function searchAllCatalog(request: Parameters<typeof square.catalog.search>[0]) {
  const objects: Square.CatalogObject[] = [];
  const related: Square.CatalogObject[] = [];
  let cursor: string | undefined;
  do {
    const resp = await square.catalog.search({ ...request, cursor });
    if (resp.objects) objects.push(...resp.objects);
    if (resp.relatedObjects) related.push(...resp.relatedObjects);
    cursor = resp.cursor ?? undefined;
  } while (cursor);
  return { objects, related };
}

/**
 * Whether a catalog object is sold at our location. This Square account is
 * shared with another business (a second location), so items must be filtered
 * to SQUARE_LOCATION_ID — otherwise the other location's menu leaks onto the
 * site. With no location configured, nothing is filtered (single-location).
 */
function isAtLocation(obj: Square.CatalogObject): boolean {
  if (!SQUARE_LOCATION_ID) return true;
  if (obj.presentAtAllLocations) {
    return !(obj.absentAtLocationIds ?? []).includes(SQUARE_LOCATION_ID);
  }
  return (obj.presentAtLocationIds ?? []).includes(SQUARE_LOCATION_ID);
}

/**
 * Fetch the full catalog from Square and shape it into a category → item →
 * variation/modifier tree ready for display.
 */
export async function getMenu(): Promise<Menu> {
  // Pull items plus the modifier lists / images they reference. Categories are
  // fetched separately: `includeRelatedObjects` only returns an item's
  // `reporting_category`, not the categories linked via its `categories[]`
  // array, so we'd otherwise have category ids with no names.
  const [itemResult, categoryResult] = await Promise.all([
    searchAllCatalog({
      objectTypes: ["ITEM"],
      includeRelatedObjects: true,
      includeDeletedObjects: false,
    }),
    searchAllCatalog({
      objectTypes: ["CATEGORY"],
      includeDeletedObjects: false,
    }),
  ]);

  const items = itemResult.objects;
  const related = itemResult.related;

  // Index related objects by id for quick lookup. Store the narrowed variant
  // types so the type-specific `*Data` fields are accessible.
  const categoryNameById = new Map<string, string>();
  const imageUrlById = new Map<string, string>();
  const modifierListById = new Map<string, Square.CatalogModifierList>();
  for (const obj of categoryResult.objects) {
    if (obj.type === "CATEGORY" && obj.id) {
      categoryNameById.set(obj.id, obj.categoryData?.name ?? "");
    }
  }
  for (const obj of related) {
    if (obj.type === "CATEGORY" && obj.id) {
      categoryNameById.set(obj.id, obj.categoryData?.name ?? "");
    } else if (obj.type === "IMAGE" && obj.id && obj.imageData?.url) {
      imageUrlById.set(obj.id, obj.imageData.url);
    } else if (obj.type === "MODIFIER_LIST" && obj.id && obj.modifierListData) {
      modifierListById.set(obj.id, obj.modifierListData);
    }
  }

  let currency = "AUD";
  const categoryBuckets = new Map<string, MenuCategory>();

  const bucketFor = (id: string, name: string): MenuCategory => {
    let bucket = categoryBuckets.get(id);
    if (!bucket) {
      bucket = { id, name, items: [] };
      categoryBuckets.set(id, bucket);
    }
    return bucket;
  };

  for (const obj of items) {
    if (obj.type !== "ITEM" || !obj.id || !obj.itemData) continue;
    const data = obj.itemData;
    if (data.isArchived) continue;
    if (!isAtLocation(obj)) continue;

    // Variations (sizes / prices). Use a loop so the union narrows cleanly.
    const variations: MenuVariation[] = [];
    for (const v of data.variations ?? []) {
      if (v.type !== "ITEM_VARIATION" || !v.id || !v.itemVariationData) continue;
      const vd = v.itemVariationData;
      if (vd.priceMoney?.currency) currency = vd.priceMoney.currency;
      variations.push({
        id: v.id,
        name: vd.name ?? "",
        priceCents: vd.priceMoney?.amount != null ? Number(vd.priceMoney.amount) : 0,
      });
    }

    // Modifier lists (extras / options).
    const modifierLists: MenuModifierList[] = [];
    for (const info of data.modifierListInfo ?? []) {
      if (info.enabled === false) continue;
      const md = modifierListById.get(info.modifierListId);
      if (!md) continue;
      const modifiers: MenuModifier[] = [];
      for (const m of md.modifiers ?? []) {
        if (m.type !== "MODIFIER" || !m.id || !m.modifierData) continue;
        modifiers.push({
          id: m.id,
          name: m.modifierData.name ?? "",
          priceCents: m.modifierData.priceMoney?.amount
            ? Number(m.modifierData.priceMoney.amount)
            : 0,
        });
      }
      const multiple = md.selectionType === "MULTIPLE";
      modifierLists.push({
        id: info.modifierListId,
        name: md.name ?? "",
        selectionType: multiple ? "MULTIPLE" : "SINGLE",
        minSelected: info.minSelectedModifiers ?? 0,
        maxSelected: info.maxSelectedModifiers ?? (multiple ? 0 : 1),
        modifiers,
      });
    }

    // All photos on the item (in Square's order); the second one drives hover-swap.
    const imageUrls = (data.imageIds ?? [])
      .map((id) => imageUrlById.get(id))
      .filter((url): url is string => !!url);

    const item: MenuItem = {
      id: obj.id,
      name: data.name ?? "Untitled",
      description: data.description ?? "",
      imageUrl: imageUrls[0] ?? null,
      imageUrls,
      variations,
      modifierLists,
    };

    // Resolve the item's category (newer API: `reportingCategory`/`categories[]`;
    // older: `categoryId`).
    const categoryId =
      data.reportingCategory?.id ??
      data.categories?.[0]?.id ??
      data.categoryId ??
      UNCATEGORIZED;
    const categoryName =
      categoryNameById.get(categoryId) ??
      (categoryId === UNCATEGORIZED ? "Menu" : "Other");

    bucketFor(categoryId, categoryName).items.push(item);
  }

  const categories = [...categoryBuckets.values()]
    .filter((c) => c.items.length > 0 && !HIDDEN_CATEGORIES.has(c.name.trim().toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return { currency, categories };
}

/**
 * Cached menu. Served from cache until the `menu` tag is revalidated (by the
 * Square catalog webhook) or the 5-minute fallback window elapses.
 */
export const getCachedMenu = unstable_cache(getMenu, ["menu"], {
  tags: [MENU_CACHE_TAG],
  revalidate: 300,
});

export { formatPrice } from "./format";
