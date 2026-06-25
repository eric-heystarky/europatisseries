import "server-only";
import { unstable_cache } from "next/cache";
import { square } from "./square";
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
 * Fetch the full catalog from Square and shape it into a category → item →
 * variation/modifier tree ready for display.
 */
export async function getMenu(): Promise<Menu> {
  // Pull items plus the modifier lists / images they reference. Categories are
  // fetched separately: `includeRelatedObjects` only returns an item's
  // `reporting_category`, not the categories linked via its `categories[]`
  // array, so we'd otherwise have category ids with no names.
  const [response, categoryResponse] = await Promise.all([
    square.catalog.search({
      objectTypes: ["ITEM"],
      includeRelatedObjects: true,
      includeDeletedObjects: false,
    }),
    square.catalog.search({
      objectTypes: ["CATEGORY"],
      includeDeletedObjects: false,
    }),
  ]);

  const items = response.objects ?? [];
  const related = response.relatedObjects ?? [];

  // Index related objects by id for quick lookup. Store the narrowed variant
  // types so the type-specific `*Data` fields are accessible.
  const categoryNameById = new Map<string, string>();
  const imageUrlById = new Map<string, string>();
  const modifierListById = new Map<string, Square.CatalogModifierList>();
  for (const obj of categoryResponse.objects ?? []) {
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

    const imageId = data.imageIds?.[0];
    const imageUrl = (imageId && imageUrlById.get(imageId)) || null;

    const item: MenuItem = {
      id: obj.id,
      name: data.name ?? "Untitled",
      description: data.description ?? "",
      imageUrl,
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
    .filter((c) => c.items.length > 0)
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
