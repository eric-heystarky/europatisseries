# Euro Patisserie Armadale — Online Ordering

A Next.js storefront whose menu syncs live from **Square**, with full online
ordering: cart, item options/modifiers, card payments (Square Web Payments SDK),
pickup **and** distance-based delivery, and ASAP or scheduled fulfilment.

## Stack

- **Next.js 16** (App Router) · TypeScript · Tailwind CSS v4
- **Square SDK v44** — Catalog, Orders, Payments, Webhooks
- Square **Web Payments SDK** for in-browser card tokenisation

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your Square keys
npm run dev                  # http://localhost:3000
```

### Environment (`.env.local`)

| Variable | Notes |
| --- | --- |
| `SQUARE_ACCESS_TOKEN` | Server-side secret. **Never commit.** |
| `SQUARE_ENVIRONMENT` | `sandbox` or `production` |
| `SQUARE_LOCATION_ID` | The Square location orders belong to |
| `SQUARE_WEBHOOK_SIGNATURE_KEY` | From the Square webhook subscription |
| `NEXT_PUBLIC_SQUARE_APPLICATION_ID` | Public — used by the Web Payments SDK |
| `NEXT_PUBLIC_SQUARE_LOCATION_ID` | Public |
| `NEXT_PUBLIC_SQUARE_ENVIRONMENT` | `sandbox` or `production` |

> Use **sandbox** credentials for development. Production keys go in the host's
> environment variables (e.g. Vercel) — never in git.

## How it works

- `lib/menu.ts` — fetches the Square catalog and shapes it into a category →
  item → variation/modifier tree, cached with a `menu` tag.
- `app/api/webhooks/square/route.ts` — verifies Square's signature and
  revalidates the menu cache on catalog changes (near-instant sync).
- `app/checkout/actions.ts` — builds the Order from catalog IDs (so **Square**
  prices and taxes it), adds the delivery fee, and takes the payment.
- `lib/delivery.ts` — geocodes the customer address (OpenStreetMap) and measures
  driving distance (OSRM); **$5/km** rounded up, free over **$300**.

## Scripts

```bash
node scripts/seed-euro.mjs      # seed the sandbox catalog with the menu
node scripts/test-order.mjs     # end-to-end pickup order + payment (test nonce)
node scripts/test-delivery.mjs  # end-to-end delivery order with distance fee
```

## Sandbox test card

`4111 1111 1111 1111` · any future expiry · CVV `111` · postcode `12345`
