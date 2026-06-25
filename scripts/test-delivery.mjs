/**
 * End-to-end sandbox test of a DELIVERY order: geocode → driving distance →
 * $5/km (round up) delivery service charge → order → payment (test nonce).
 *
 *   node scripts/test-delivery.mjs
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
  environment: SquareEnvironment.Sandbox,
});
const locationId = env.SQUARE_LOCATION_ID;
const UA = "square-menu-site/1.0 (hello@heystarky.com.au)";
const ORIGIN = { lat: -37.7732655, lon: 145.1702448 };

// 1) Geocode a nearby test address.
const testAddress = "5 Tunstall Square, Doncaster East VIC, Australia";
const geo = await (await fetch(
  `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(testAddress)}&format=json&limit=1&countrycodes=au`,
  { headers: { "User-Agent": UA } },
)).json();
const dest = { lat: Number(geo[0].lat), lon: Number(geo[0].lon) };
console.log("Geocoded:", geo[0].display_name);

// 2) Driving distance + fee.
const route = await (await fetch(
  `https://router.project-osrm.org/route/v1/driving/${ORIGIN.lon},${ORIGIN.lat};${dest.lon},${dest.lat}?overview=false`,
  { headers: { "User-Agent": UA } },
)).json();
const km = route.routes[0].distance / 1000;
const billedKm = Math.max(1, Math.ceil(km));
const feeCents = billedKm * 500;
console.log(`Distance: ${km.toFixed(2)} km → billed ${billedKm} km → fee $${feeCents / 100}`);

// 3) A line item (Latte).
const search = await square.catalog.search({ objectTypes: ["ITEM"] });
const latte = search.objects.find((o) => o.itemData?.name === "Latte");
const variationId = latte.itemData.variations[0].id;

// 4) Create the delivery order with the fee as a TOTAL_PHASE service charge.
const orderRes = await square.orders.create({
  idempotencyKey: randomUUID(),
  order: {
    locationId,
    lineItems: [{ quantity: "1", catalogObjectId: variationId }],
    fulfillments: [
      {
        type: "DELIVERY",
        deliveryDetails: {
          recipient: {
            displayName: "Test Buyer",
            phoneNumber: "+61400000000",
            address: {
              addressLine1: "5 Tunstall Square",
              locality: "Doncaster East",
              administrativeDistrictLevel1: "VIC",
              postalCode: "3109",
              country: "AU",
            },
          },
          scheduleType: "ASAP",
          deliverAt: new Date(Date.now() + 20 * 60000).toISOString(),
        },
      },
    ],
    serviceCharges: [
      {
        name: `Delivery (${billedKm} km)`,
        amountMoney: { amount: BigInt(feeCents), currency: "AUD" },
        calculationPhase: "TOTAL_PHASE",
      },
    ],
  },
});
const order = orderRes.order;
console.log(
  `Order total: $${Number(order.totalMoney.amount) / 100} ` +
    `(items $4.50 + delivery $${feeCents / 100} = $${(450 + feeCents) / 100}) ` +
    `service charge: $${Number(order.totalServiceChargeMoney?.amount ?? 0n) / 100}`,
);

// 5) Pay.
const pay = await square.payments.create({
  sourceId: "cnon:card-nonce-ok",
  idempotencyKey: randomUUID(),
  amountMoney: order.totalMoney,
  orderId: order.id,
  locationId,
});
console.log(`Payment: ${pay.payment.status} for $${Number(pay.payment.amountMoney.amount) / 100}`);
console.log("\n✓ Delivery order with distance fee succeeded end-to-end.");
