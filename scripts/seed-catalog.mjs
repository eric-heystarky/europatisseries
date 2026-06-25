/**
 * Seeds the Square SANDBOX catalog with a sample café menu so the site has
 * something to render. Safe to re-run — it upserts by temporary id.
 *
 *   node scripts/seed-catalog.mjs
 *
 * Reads SQUARE_ACCESS_TOKEN + SQUARE_ENVIRONMENT from .env.local.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Minimal .env.local loader (no dependency on dotenv).
const env = {};
try {
  const raw = readFileSync(join(__dirname, "..", ".env.local"), "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2];
  }
} catch {
  console.error("Could not read .env.local");
  process.exit(1);
}

const token = env.SQUARE_ACCESS_TOKEN;
const base =
  env.SQUARE_ENVIRONMENT === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";

if (!token) {
  console.error("SQUARE_ACCESS_TOKEN missing in .env.local");
  process.exit(1);
}

const money = (cents) => ({ amount: cents, currency: "AUD" });

const variation = (id, name, cents) => ({
  type: "ITEM_VARIATION",
  id: `#${id}`,
  item_variation_data: {
    name,
    pricing_type: "FIXED_PRICING",
    price_money: money(cents),
  },
});

const objects = [
  // ── Categories ─────────────────────────────────────────────
  { type: "CATEGORY", id: "#cat-coffee", category_data: { name: "Coffee" } },
  { type: "CATEGORY", id: "#cat-food", category_data: { name: "Food" } },

  // ── Modifier list: milk options (single-select) ────────────
  {
    type: "MODIFIER_LIST",
    id: "#mod-milk",
    modifier_list_data: {
      name: "Milk",
      selection_type: "SINGLE",
      modifiers: [
        { type: "MODIFIER", id: "#milk-full", modifier_data: { name: "Full cream", price_money: money(0) } },
        { type: "MODIFIER", id: "#milk-skim", modifier_data: { name: "Skim", price_money: money(0) } },
        { type: "MODIFIER", id: "#milk-oat", modifier_data: { name: "Oat", price_money: money(80) } },
        { type: "MODIFIER", id: "#milk-soy", modifier_data: { name: "Soy", price_money: money(80) } },
      ],
    },
  },
  // ── Modifier list: extras (multi-select) ───────────────────
  {
    type: "MODIFIER_LIST",
    id: "#mod-extras",
    modifier_list_data: {
      name: "Extras",
      selection_type: "MULTIPLE",
      modifiers: [
        { type: "MODIFIER", id: "#x-shot", modifier_data: { name: "Extra shot", price_money: money(60) } },
        { type: "MODIFIER", id: "#x-decaf", modifier_data: { name: "Decaf", price_money: money(0) } },
        { type: "MODIFIER", id: "#x-syrup", modifier_data: { name: "Vanilla syrup", price_money: money(70) } },
      ],
    },
  },

  // ── Items ──────────────────────────────────────────────────
  {
    type: "ITEM",
    id: "#item-latte",
    item_data: {
      name: "Latte",
      description: "Silky steamed milk over a double shot.",
      categories: [{ id: "#cat-coffee" }],
      modifier_list_info: [
        { modifier_list_id: "#mod-milk", enabled: true, min_selected_modifiers: 1, max_selected_modifiers: 1 },
        { modifier_list_id: "#mod-extras", enabled: true },
      ],
      variations: [variation("latte-reg", "Regular", 450), variation("latte-lg", "Large", 520)],
    },
  },
  {
    type: "ITEM",
    id: "#item-flatwhite",
    item_data: {
      name: "Flat White",
      description: "Velvety microfoam, double ristretto.",
      categories: [{ id: "#cat-coffee" }],
      modifier_list_info: [
        { modifier_list_id: "#mod-milk", enabled: true, min_selected_modifiers: 1, max_selected_modifiers: 1 },
        { modifier_list_id: "#mod-extras", enabled: true },
      ],
      variations: [variation("fw-reg", "Regular", 450)],
    },
  },
  {
    type: "ITEM",
    id: "#item-cold-brew",
    item_data: {
      name: "Cold Brew",
      description: "18-hour steeped, served over ice.",
      categories: [{ id: "#cat-coffee" }],
      modifier_list_info: [{ modifier_list_id: "#mod-extras", enabled: true }],
      variations: [variation("cb-reg", "Regular", 550)],
    },
  },
  {
    type: "ITEM",
    id: "#item-banana-bread",
    item_data: {
      name: "Banana Bread",
      description: "Toasted, with whipped butter.",
      categories: [{ id: "#cat-food" }],
      variations: [variation("bb-slice", "Slice", 650)],
    },
  },
  {
    type: "ITEM",
    id: "#item-toastie",
    item_data: {
      name: "Ham & Cheese Toastie",
      description: "Sourdough, leg ham, aged cheddar.",
      categories: [{ id: "#cat-food" }],
      variations: [variation("toastie", "Each", 1100)],
    },
  },
];

const body = {
  idempotency_key: `seed-${Date.now()}`,
  batches: [{ objects }],
};

const res = await fetch(`${base}/v2/catalog/batch-upsert`, {
  method: "POST",
  headers: {
    "Square-Version": "2025-01-23",
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

const json = await res.json();
if (!res.ok) {
  console.error("Seed failed:", JSON.stringify(json, null, 2));
  process.exit(1);
}
console.log(`Seeded ${json.objects?.length ?? 0} catalog objects ✓`);
