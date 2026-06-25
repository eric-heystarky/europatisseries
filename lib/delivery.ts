import "server-only";

/**
 * Distance-based delivery pricing.
 *  - Origin: the shop. Customer address is geocoded, then a driving distance is
 *    measured from the shop.
 *  - Fee: $5 per km, rounded UP to the whole km.
 *  - Free delivery once the taxed order total (excluding delivery) reaches $300
 *    — that waiver is applied by the checkout action, not here.
 *
 * Uses free, keyless services (OpenStreetMap Nominatim + OSRM). Fine for low
 * volume; swap in a paid provider (Google/Mapbox) before heavy traffic.
 */

export const SHOP_ORIGIN = {
  // Verified via Nominatim: "1, Wiarando Court, Doncaster East, Victoria, 3109".
  lat: -37.7732655,
  lon: 145.1702448,
  label: "1 Wiarando Court, Doncaster East VIC 3109",
};

export const PER_KM_CENTS = 500; // $5 per km
export const FREE_DELIVERY_THRESHOLD_CENTS = 30_000; // $300 taxed total

// A descriptive User-Agent is required by the Nominatim usage policy.
const UA = "square-menu-site/1.0 (hello@heystarky.com.au)";

export type DeliveryAddress = {
  line1: string;
  line2?: string;
  locality: string;
  region: string;
  postalCode: string;
};

export type DeliveryQuote = {
  distanceKm: number;
  billedKm: number;
  feeCents: number;
  resolvedAddress: string;
};

function addressToQuery(a: DeliveryAddress): string {
  return [a.line1, a.locality, a.region, a.postalCode, "Australia"]
    .filter(Boolean)
    .join(", ");
}

async function fetchJson(url: string, timeoutMs = 7000): Promise<unknown> {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/json" },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) {
    if (res.status === 429 || res.status === 403 || res.status >= 500) {
      throw new Error("The address service is busy right now. Please try again in a moment.");
    }
    throw new Error(`Address lookup failed (${res.status}).`);
  }
  return res.json();
}

type NominatimHit = { lat: string; lon: string; display_name: string };

async function nominatimSearch(query: string): Promise<NominatimHit | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    query,
  )}&format=json&limit=1&countrycodes=au`;
  const data = (await fetchJson(url)) as NominatimHit[];
  return data?.length ? data[0] : null;
}

/**
 * Geocode an Australian address to coordinates, or null if genuinely not found.
 * Nominatim is keyless and rate-limited, so we try the full address, then fall
 * back to a looser query (street + suburb), with one retry for transient blanks.
 */
export async function geocode(
  address: DeliveryAddress,
): Promise<{ lat: number; lon: number; displayName: string } | null> {
  const full = addressToQuery(address);
  const loose = [address.line1, address.locality, "Australia"].filter(Boolean).join(", ");
  const queries = full === loose ? [full] : [full, loose];

  for (let attempt = 0; attempt < 2; attempt++) {
    for (const q of queries) {
      const hit = await nominatimSearch(q);
      if (hit) {
        return {
          lat: Number(hit.lat),
          lon: Number(hit.lon),
          displayName: hit.display_name,
        };
      }
    }
    // Brief backoff before a single retry to dodge transient rate-limits.
    if (attempt === 0) await new Promise((r) => setTimeout(r, 1100));
  }
  return null;
}

/** Driving distance in km from the shop to a destination, or null on failure. */
export async function drivingDistanceKm(dest: {
  lat: number;
  lon: number;
}): Promise<number | null> {
  const coords = `${SHOP_ORIGIN.lon},${SHOP_ORIGIN.lat};${dest.lon},${dest.lat}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=false`;
  const data = (await fetchJson(url)) as {
    code: string;
    routes?: Array<{ distance: number }>;
  };
  if (data.code !== "Ok" || !data.routes?.length) return null;
  return data.routes[0].distance / 1000;
}

/** $5 per km, rounded up to the whole km. */
export function deliveryFeeForKm(km: number): { billedKm: number; feeCents: number } {
  const billedKm = Math.max(1, Math.ceil(km));
  return { billedKm, feeCents: billedKm * PER_KM_CENTS };
}

/**
 * Full quote for an address: geocode → driving distance → fee. Throws a
 * user-friendly Error if the address can't be located or routed.
 */
export async function getDeliveryQuote(address: DeliveryAddress): Promise<DeliveryQuote> {
  const geo = await geocode(address);
  if (!geo) {
    throw new Error("We couldn't find that address. Please check it and try again.");
  }
  const km = await drivingDistanceKm(geo);
  if (km == null) {
    throw new Error("We couldn't calculate a delivery distance for that address.");
  }
  const { billedKm, feeCents } = deliveryFeeForKm(km);
  return {
    distanceKm: Math.round(km * 100) / 100,
    billedKm,
    feeCents,
    resolvedAddress: geo.displayName,
  };
}
