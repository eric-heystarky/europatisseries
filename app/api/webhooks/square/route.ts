import { revalidateTag } from "next/cache";
import { WebhooksHelper } from "square";
import { MENU_CACHE_TAG } from "@/lib/menu";

// Webhooks must run on the Node runtime (need the raw body + crypto).
export const runtime = "nodejs";
// Never cache the webhook response.
export const dynamic = "force-dynamic";

/**
 * Square calls this endpoint when the catalog changes. We verify the
 * signature, then invalidate the menu cache so the next visitor sees the
 * update within seconds (near-instant sync).
 *
 * Configure in Square Dashboard → Webhooks:
 *   URL:    https://<your-domain>/api/webhooks/square
 *   Events: catalog.version.updated  (add inventory.count.updated if desired)
 * Then put the subscription's Signature Key in SQUARE_WEBHOOK_SIGNATURE_KEY.
 */
export async function POST(request: Request) {
  const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  if (!signatureKey) {
    console.error("SQUARE_WEBHOOK_SIGNATURE_KEY not set");
    return new Response("Webhook not configured", { status: 500 });
  }

  // The raw body is required for signature verification — read it as text.
  const body = await request.text();
  const signature = request.headers.get("x-square-hmacsha256-signature") ?? "";

  // Square signs over the exact notification URL it was configured with.
  const notificationUrl =
    process.env.SQUARE_WEBHOOK_URL ?? new URL(request.url).toString();

  const isValid = await WebhooksHelper.verifySignature({
    requestBody: body,
    signatureHeader: signature,
    signatureKey,
    notificationUrl,
  });

  if (!isValid) {
    console.warn("Rejected Square webhook: bad signature");
    return new Response("Invalid signature", { status: 401 });
  }

  let eventType = "unknown";
  try {
    eventType = JSON.parse(body)?.type ?? "unknown";
  } catch {
    /* body already verified; ignore parse issues */
  }

  // Any catalog change → refresh the menu.
  if (eventType.startsWith("catalog")) {
    // Next 16: second arg is the cache-life profile; 'max' = stale-while-revalidate.
    revalidateTag(MENU_CACHE_TAG, "max");
    console.log(`Menu cache invalidated (event: ${eventType})`);
  }

  return new Response("ok", { status: 200 });
}
