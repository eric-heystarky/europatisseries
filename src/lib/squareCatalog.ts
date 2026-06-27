/**
 * Shared Square catalog logic.
 *
 * The mapping helpers here are pure and safe to import from the browser (they carry
 * no secrets). The actual API call (`fetchSquareCatalog`) takes the access token as an
 * argument and is only ever invoked server-side (Vite dev middleware / serverless fn),
 * so the token never ends up in the client bundle.
 */

export type ProductCategory = "pastries" | "catering";

export interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
}

export const DEFAULT_PRODUCT_IMAGE =
  "https://vibe.filesafe.space/1782359074813107391/assets/47d00d8c-7d12-4f85-b948-60c4b85d0247.png";

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "L'Opéra",
    description: "Layers of almond sponge, espresso syrup, French buttercream, and chocolate ganache.",
    price: 12.0,
    image: DEFAULT_PRODUCT_IMAGE,
    category: "pastries",
  },
  {
    id: 2,
    name: "Tarte au Citron",
    description: "Classic lemon tart with a buttery shortbread crust and torched meringue.",
    price: 9.5,
    image: DEFAULT_PRODUCT_IMAGE,
    category: "pastries",
  },
  {
    id: 3,
    name: "Mille-Feuille",
    description: "Caramelized puff pastry layered with vanilla bean diplomat cream.",
    price: 11.0,
    image: DEFAULT_PRODUCT_IMAGE,
    category: "pastries",
  },
  {
    id: 4,
    name: "Grand Catering Box",
    description: "An assortment of 24 miniature pastries, perfect for corporate events and gatherings.",
    price: 145.0,
    image: "https://vibe.filesafe.space/1782359074813107391/assets/d6f84bdb-d0b7-4088-b4e0-eede3feb4e6c.png",
    category: "catering",
  },
  {
    id: 5,
    name: "Macaron Collection",
    description: "Box of 12 assorted seasonal macarons.",
    price: 42.0,
    image: "https://vibe.filesafe.space/1782359074813107391/assets/d6f84bdb-d0b7-4088-b4e0-eede3feb4e6c.png",
    category: "catering",
  },
];

/* ---- Minimal typings for the subset of the Square Catalog API we consume ---- */

interface SquareMoney {
  amount?: number;
  currency?: string;
}

interface SquareItemVariation {
  item_variation_data?: { price_money?: SquareMoney };
}

interface SquareItemData {
  name?: string;
  description?: string;
  variations?: SquareItemVariation[];
  image_ids?: string[];
  /** Legacy single-category field. */
  category_id?: string;
  /** Current multi-category field. */
  categories?: { id: string }[];
}

interface SquareCatalogObject {
  type: string;
  id: string;
  item_data?: SquareItemData;
  category_data?: { name?: string };
  image_data?: { url?: string };
}

export interface SquareCatalogResponse {
  objects?: SquareCatalogObject[];
}

const SQUARE_VERSION = "2024-01-18";

/** A Square category whose name mentions catering maps to our "catering" bucket. */
function classifyCategory(categoryName: string | undefined): ProductCategory {
  return categoryName?.toLowerCase().includes("cater") ? "catering" : "pastries";
}

/**
 * Convert a raw Square `/v2/catalog/list` response into our flat `Product[]`.
 * Pure and side-effect free so it can be unit-tested in isolation.
 */
export function mapSquareCatalog(data: SquareCatalogResponse): Product[] {
  const objects = data.objects ?? [];

  const imageUrlById = new Map<string, string>();
  const categoryNameById = new Map<string, string>();

  for (const obj of objects) {
    if (obj.type === "IMAGE" && obj.image_data?.url) {
      imageUrlById.set(obj.id, obj.image_data.url);
    } else if (obj.type === "CATEGORY" && obj.category_data?.name) {
      categoryNameById.set(obj.id, obj.category_data.name);
    }
  }

  return objects
    .filter((obj) => obj.type === "ITEM" && obj.item_data)
    .map((obj) => {
      const item = obj.item_data as SquareItemData;

      const amount = item.variations?.[0]?.item_variation_data?.price_money?.amount;
      const price = typeof amount === "number" ? amount / 100 : 0;

      const categoryId = item.categories?.[0]?.id ?? item.category_id;
      const category = classifyCategory(categoryId ? categoryNameById.get(categoryId) : undefined);

      const imageId = item.image_ids?.[0];
      const image = (imageId && imageUrlById.get(imageId)) || DEFAULT_PRODUCT_IMAGE;

      return {
        id: obj.id,
        name: item.name || "Unnamed Item",
        description: item.description || "",
        price,
        image,
        category,
      } satisfies Product;
    });
}

/**
 * Server-side fetch of the live Square catalog. Throws on a non-OK response so the
 * caller can decide whether to fall back to {@link FALLBACK_PRODUCTS}.
 */
export async function fetchSquareCatalog(token: string, apiBase: string): Promise<Product[]> {
  const url = `${apiBase}/v2/catalog/list?types=ITEM,IMAGE,CATEGORY`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Square-Version": SQUARE_VERSION,
    },
  });

  if (!response.ok) {
    throw new Error(`Square API responded ${response.status}`);
  }

  const data = (await response.json()) as SquareCatalogResponse;
  return mapSquareCatalog(data);
}
