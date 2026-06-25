"use server";

import { randomUUID } from "node:crypto";
import { square, SQUARE_LOCATION_ID } from "@/lib/square";
import {
  getDeliveryQuote,
  FREE_DELIVERY_THRESHOLD_CENTS,
  type DeliveryAddress,
} from "@/lib/delivery";
import type { Square } from "square";
import type { CartLine } from "@/components/cart-context";

export type FulfillmentType = "PICKUP" | "DELIVERY";
export type Timing = "ASAP" | "SCHEDULED";

export type CheckoutInput = {
  /** Card nonce from the Web Payments SDK (`card.tokenize()`). */
  sourceId: string;
  lines: CartLine[];
  fulfillmentType: FulfillmentType;
  timing: Timing;
  /** RFC 3339 timestamp, required when timing === "SCHEDULED". */
  scheduledAt?: string;
  customer: { name: string; phone: string; email?: string };
  /** Required when fulfillmentType === "DELIVERY". */
  address?: DeliveryAddress;
  note?: string;
};

export type CheckoutResult =
  | {
      ok: true;
      orderId: string;
      totalCents: number;
      deliveryFeeCents: number;
      currency: string;
      status: string;
    }
  | { ok: false; error: string };

/** Build Square order line items from cart lines (catalog IDs → Square prices them). */
function buildLineItems(lines: CartLine[]): Square.OrderLineItem[] {
  return lines.map((l) => ({
    quantity: String(l.quantity),
    catalogObjectId: l.variationId,
    modifiers: l.modifiers.map((m) => ({ catalogObjectId: m.id })),
  }));
}

/** Taxed total (in cents) of the items alone, via CalculateOrder (no creation). */
async function taxedItemsTotalCents(lines: CartLine[]): Promise<{ cents: number; currency: string }> {
  const res = await square.orders.calculate({
    order: { locationId: SQUARE_LOCATION_ID, lineItems: buildLineItems(lines) },
  });
  const money = res.order?.totalMoney;
  return { cents: money?.amount != null ? Number(money.amount) : 0, currency: money?.currency ?? "AUD" };
}

export type DeliveryQuoteResult =
  | {
      ok: true;
      distanceKm: number;
      billedKm: number;
      feeCents: number; // effective fee after the free-delivery waiver
      rawFeeCents: number; // fee before waiver
      waived: boolean;
      currency: string;
      resolvedAddress: string;
    }
  | { ok: false; error: string };

/**
 * Live delivery quote for the checkout UI: geocodes the address, measures the
 * driving distance, and applies the free-over-$300 waiver.
 */
export async function quoteDelivery(
  address: DeliveryAddress,
  lines: CartLine[],
): Promise<DeliveryQuoteResult> {
  try {
    const [quote, items] = await Promise.all([
      getDeliveryQuote(address),
      taxedItemsTotalCents(lines),
    ]);
    const waived = items.cents >= FREE_DELIVERY_THRESHOLD_CENTS;
    return {
      ok: true,
      distanceKm: quote.distanceKm,
      billedKm: quote.billedKm,
      feeCents: waived ? 0 : quote.feeCents,
      rawFeeCents: quote.feeCents,
      waived,
      currency: items.currency,
      resolvedAddress: quote.resolvedAddress,
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not quote delivery." };
  }
}

export async function placeOrder(input: CheckoutInput): Promise<CheckoutResult> {
  try {
    if (!input.sourceId) return { ok: false, error: "Missing card token." };
    if (input.lines.length === 0) return { ok: false, error: "Your cart is empty." };

    const lineItems = buildLineItems(input.lines);

    const recipient: Square.FulfillmentRecipient = {
      displayName: input.customer.name,
      phoneNumber: input.customer.phone,
      emailAddress: input.customer.email || undefined,
    };

    const targetAt =
      input.timing === "SCHEDULED" && input.scheduledAt
        ? input.scheduledAt
        : new Date(Date.now() + 20 * 60_000).toISOString();
    const scheduleType = input.timing === "SCHEDULED" ? "SCHEDULED" : "ASAP";

    let fulfillment: Square.Fulfillment;
    let serviceCharges: Square.OrderServiceCharge[] | undefined;

    if (input.fulfillmentType === "DELIVERY") {
      if (!input.address) return { ok: false, error: "Delivery address is required." };

      // Authoritative delivery fee — recomputed server-side, never trusted from the client.
      const quote = await getDeliveryQuote(input.address);
      const items = await taxedItemsTotalCents(input.lines);
      const waived = items.cents >= FREE_DELIVERY_THRESHOLD_CENTS;
      const feeCents = waived ? 0 : quote.feeCents;

      if (feeCents > 0) {
        serviceCharges = [
          {
            name: `Delivery (${quote.billedKm} km)`,
            amountMoney: { amount: BigInt(feeCents), currency: items.currency as Square.Currency },
            calculationPhase: "TOTAL_PHASE",
          },
        ];
      }

      fulfillment = {
        type: "DELIVERY",
        deliveryDetails: {
          recipient: {
            ...recipient,
            address: {
              addressLine1: input.address.line1,
              addressLine2: input.address.line2 || undefined,
              locality: input.address.locality,
              administrativeDistrictLevel1: input.address.region,
              postalCode: input.address.postalCode,
              country: "AU",
            },
          },
          scheduleType,
          deliverAt: targetAt,
          note: input.note || undefined,
        },
      };
    } else {
      fulfillment = {
        type: "PICKUP",
        pickupDetails: {
          recipient,
          scheduleType,
          pickupAt: targetAt,
          note: input.note || undefined,
        },
      };
    }

    // 1) Create the order — Square computes line prices, modifiers, tax, and the delivery charge.
    const orderRes = await square.orders.create({
      idempotencyKey: randomUUID(),
      order: {
        locationId: SQUARE_LOCATION_ID,
        lineItems,
        fulfillments: [fulfillment],
        serviceCharges,
      },
    });

    const order = orderRes.order;
    if (!order?.id || !order.totalMoney?.amount) {
      return { ok: false, error: "Could not create order." };
    }

    // 2) Charge the card for the total Square calculated.
    const payRes = await square.payments.create({
      sourceId: input.sourceId,
      idempotencyKey: randomUUID(),
      amountMoney: order.totalMoney,
      orderId: order.id,
      locationId: SQUARE_LOCATION_ID,
    });

    const deliveryFee = order.totalServiceChargeMoney?.amount;

    return {
      ok: true,
      orderId: order.id,
      totalCents: Number(order.totalMoney.amount),
      deliveryFeeCents: deliveryFee != null ? Number(deliveryFee) : 0,
      currency: order.totalMoney.currency ?? "AUD",
      status: payRes.payment?.status ?? "UNKNOWN",
    };
  } catch (err) {
    const message = extractSquareError(err);
    console.error("placeOrder failed:", message);
    return { ok: false, error: message };
  }
}

/** Pull a human-readable message out of a Square SDK error. */
function extractSquareError(err: unknown): string {
  if (err && typeof err === "object" && "errors" in err) {
    const errors = (err as { errors?: Array<{ detail?: string; code?: string }> }).errors;
    if (errors?.length) {
      return errors.map((e) => e.detail || e.code).filter(Boolean).join("; ");
    }
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong placing your order.";
}
