import { describe, it, expect } from "vitest";
import { mapSquareCatalog, type SquareCatalogResponse } from "./squareCatalog";

const SAMPLE: SquareCatalogResponse = {
  objects: [
    { type: "CATEGORY", id: "cat_pastry", category_data: { name: "Pastries & Cakes" } },
    { type: "CATEGORY", id: "cat_catering", category_data: { name: "Catering Packs" } },
    { type: "IMAGE", id: "img_1", image_data: { url: "https://example.test/opera.png" } },
    {
      type: "ITEM",
      id: "item_opera",
      item_data: {
        name: "L'Opéra",
        description: "Almond sponge cake.",
        image_ids: ["img_1"],
        categories: [{ id: "cat_pastry" }],
        variations: [{ item_variation_data: { price_money: { amount: 1200, currency: "AUD" } } }],
      },
    },
    {
      type: "ITEM",
      id: "item_box",
      item_data: {
        name: "Grand Catering Box",
        description: "24 pastries.",
        categories: [{ id: "cat_catering" }],
        variations: [{ item_variation_data: { price_money: { amount: 14500, currency: "AUD" } } }],
      },
    },
  ],
};

describe("mapSquareCatalog", () => {
  it("maps items, converts cents to dollars, and resolves images", () => {
    const products = mapSquareCatalog(SAMPLE);
    expect(products).toHaveLength(2);

    const opera = products.find((p) => p.id === "item_opera");
    expect(opera).toMatchObject({
      name: "L'Opéra",
      price: 12,
      image: "https://example.test/opera.png",
      category: "pastries",
    });
  });

  it("classifies a category whose name mentions catering as 'catering'", () => {
    const products = mapSquareCatalog(SAMPLE);
    expect(products.find((p) => p.id === "item_box")?.category).toBe("catering");
  });

  it("falls back to the default image when an item has no image", () => {
    const products = mapSquareCatalog(SAMPLE);
    const box = products.find((p) => p.id === "item_box");
    expect(box?.image).toContain("vibe.filesafe.space");
  });

  it("returns an empty array for an empty response", () => {
    expect(mapSquareCatalog({})).toEqual([]);
  });
});
