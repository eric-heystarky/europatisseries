/**
 * Replaces the sandbox catalog with Euro Patisserie Armadale's menu
 * (Pastries & Cakes + Catering Packs). Deletes prior seeded items first.
 *
 *   node scripts/seed-euro.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = {};
for (const line of readFileSync(join(__dirname, "..", ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2];
}
const token = env.SQUARE_ACCESS_TOKEN;
const base =
  env.SQUARE_ENVIRONMENT === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";
const headers = {
  "Square-Version": "2025-01-23",
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

// 1) Delete existing ITEM / CATEGORY / MODIFIER_LIST objects.
const search = await (await fetch(`${base}/v2/catalog/search`, {
  method: "POST",
  headers,
  body: JSON.stringify({ object_types: ["ITEM", "CATEGORY", "MODIFIER_LIST"] }),
})).json();
const ids = (search.objects ?? []).map((o) => o.id);
if (ids.length) {
  const del = await (await fetch(`${base}/v2/catalog/batch-delete`, {
    method: "POST",
    headers,
    body: JSON.stringify({ object_ids: ids }),
  })).json();
  console.log(`Deleted ${del.deleted_object_ids?.length ?? 0} old objects.`);
}

const money = (cents) => ({ amount: cents, currency: "AUD" });
const variation = (id, name, cents) => ({
  type: "ITEM_VARIATION",
  id: `#${id}`,
  item_variation_data: { name, pricing_type: "FIXED_PRICING", price_money: money(cents) },
});
const item = (id, name, description, categoryId, variations, modifierLists = []) => ({
  type: "ITEM",
  id: `#${id}`,
  item_data: {
    name,
    description,
    categories: [{ id: `#${categoryId}` }],
    variations,
    modifier_list_info: modifierLists.map((mlId) => ({ modifier_list_id: `#${mlId}`, enabled: true })),
  },
});

const objects = [
  { type: "CATEGORY", id: "#cat-pastries", category_data: { name: "Pastries & Cakes" } },
  { type: "CATEGORY", id: "#cat-catering", category_data: { name: "Catering Packs" } },

  // Éclair flavour choice (required single-select).
  {
    type: "MODIFIER_LIST",
    id: "#mod-eclair",
    modifier_list_data: {
      name: "Flavour",
      selection_type: "SINGLE",
      modifiers: [
        { type: "MODIFIER", id: "#ec-choc", modifier_data: { name: "Chocolate", price_money: money(0) } },
        { type: "MODIFIER", id: "#ec-coffee", modifier_data: { name: "Coffee", price_money: money(0) } },
        { type: "MODIFIER", id: "#ec-vanilla", modifier_data: { name: "Vanilla", price_money: money(0) } },
        { type: "MODIFIER", id: "#ec-pistachio", modifier_data: { name: "Pistachio", price_money: money(150) } },
      ],
    },
  },

  // Pastries & Cakes
  item("p-opera", "L'Opéra", "Layers of almond sponge, coffee buttercream & chocolate ganache.", "cat-pastries",
    [variation("opera", "Slice", 1200)]),
  item("p-citron", "Tarte au Citron", "Classic lemon tart with torched Italian meringue.", "cat-pastries",
    [variation("citron", "Each", 950)]),
  item("p-mille", "Mille-Feuille", "Caramelised puff pastry layered with vanilla crème pâtissière.", "cat-pastries",
    [variation("mille", "Each", 1100)]),
  item("p-croissant", "Croissant au Beurre", "24-hour laminated, baked golden each morning.", "cat-pastries",
    [variation("cr-plain", "Plain", 650), variation("cr-almond", "Almond", 800)]),
  item("p-eclair", "Éclair", "Choux pastry filled with silky crème, glazed to order.", "cat-pastries",
    [variation("eclair", "Each", 750)], ["mod-eclair"]),

  // Catering Packs
  item("c-grand", "Grand Catering Box", "24 miniature pastries — an assortment of the day's best.", "cat-catering",
    [variation("grand", "Serves 12", 14500)]),
  item("c-macaron", "Macaron Collection", "Hand-piped French macarons in seasonal flavours.", "cat-catering",
    [variation("mac6", "Box of 6", 2400), variation("mac12", "Box of 12", 4200)]),
  item("c-focaccia", "Focaccia Platter", "Rosemary & sea-salt focaccia, sliced for sharing.", "cat-catering",
    [variation("foc", "Serves 8", 6500)]),
  item("c-grazing", "Sweet Grazing Table", "A showpiece spread of cakes, tarts & pastries.", "cat-catering",
    [variation("graze-s", "Small (10–15 pax)", 24000), variation("graze-l", "Large (20–30 pax)", 39000)]),
];

const res = await fetch(`${base}/v2/catalog/batch-upsert`, {
  method: "POST",
  headers,
  body: JSON.stringify({ idempotency_key: `euro-${Date.now()}`, batches: [{ objects }] }),
});
const json = await res.json();
if (!res.ok) {
  console.error("Seed failed:", JSON.stringify(json, null, 2));
  process.exit(1);
}
console.log(`Seeded ${json.objects?.length ?? 0} Euro Patisserie catalog objects ✓`);
