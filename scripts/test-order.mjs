/**
 * End-to-end sandbox test of the order + payment flow that app/checkout/actions.ts
 * performs, using Square's test nonce `cnon:card-nonce-ok`. Verifies that our
 * line-item shape (catalog variation + modifier), fulfillment, order creation,
 * and payment all succeed against the real sandbox.
 *
 *   node scripts/test-order.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";
import { SquareClient, SquareEnvironment } from "square";

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = {};
for (const line of readFileSync(join(__dirname, "..", ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2];
}

const square = new SquareClient({
  token: env.SQUARE_ACCESS_TOKEN,
  environment:
    env.SQUARE_ENVIRONMENT === "production"
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox,
});
const locationId = env.SQUARE_LOCATION_ID;

// Find a Latte variation id + a milk modifier id from the catalog.
const search = await square.catalog.search({
  objectTypes: ["ITEM"],
  includeRelatedObjects: true,
});
const latte = (search.objects ?? []).find(
  (o) => o.type === "ITEM" && o.itemData?.name === "Latte",
);
const variationId = latte.itemData.variations[0].id;
const milkList = (search.relatedObjects ?? []).find(
  (o) => o.type === "MODIFIER_LIST" && o.modifierListData?.name === "Milk",
);
const oatModifierId = milkList.modifierListData.modifiers.find(
  (m) => m.modifierData?.name === "Oat",
).id;

console.log("Using variation:", variationId, "modifier (Oat):", oatModifierId);

// 1) Create order — same shape as placeOrder().
const orderRes = await square.orders.create({
  idempotencyKey: randomUUID(),
  order: {
    locationId,
    lineItems: [
      {
        quantity: "2",
        catalogObjectId: variationId,
        modifiers: [{ catalogObjectId: oatModifierId }],
      },
    ],
    fulfillments: [
      {
        type: "PICKUP",
        pickupDetails: {
          recipient: { displayName: "Test Buyer", phoneNumber: "+61400000000" },
          scheduleType: "ASAP",
          pickupAt: new Date(Date.now() + 20 * 60000).toISOString(),
        },
      },
    ],
  },
});
const order = orderRes.order;
console.log(
  "Order created:",
  order.id,
  "total:",
  order.totalMoney.amount,
  order.totalMoney.currency,
  "tax:",
  order.totalTaxMoney?.amount ?? 0n,
);

// 2) Pay with the sandbox test nonce.
const payRes = await square.payments.create({
  sourceId: "cnon:card-nonce-ok",
  idempotencyKey: randomUUID(),
  amountMoney: order.totalMoney,
  orderId: order.id,
  locationId,
});
console.log(
  "Payment:",
  payRes.payment.status,
  "amount:",
  payRes.payment.amountMoney.amount,
  payRes.payment.amountMoney.currency,
  "receipt:",
  payRes.payment.receiptUrl ?? "(none)",
);
console.log("\n✓ Order + payment succeeded end-to-end.");
