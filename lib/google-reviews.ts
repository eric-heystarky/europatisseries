import { unstable_cache } from "next/cache";

/**
 * Google reviews for the homepage.
 *
 * Reviews come from the LeadConnector reputation widget that already syncs the
 * shop's Google reviews (the same feed the current site embeds) — no key needed.
 * Its page carries the data as `window.__SSR_DATA__`; we read that and render it
 * in our own design. If GOOGLE_PLACES_API_KEY + GOOGLE_PLACE_ID are set, we also
 * pull photos from the Google listing (customer and owner uploads) — Google
 * doesn't expose the photos attached to individual reviews in any API.
 */
export type GoogleReview = {
  id: string;
  author: string;
  text: string;
  date: string; // ISO
};

export type GooglePhoto = { url: string; author: string | null };

export type GoogleReviews = {
  rating: number | null;
  count: number | null;
  reviews: GoogleReview[];
  photos: GooglePhoto[];
  readUrl: string;
  writeUrl: string;
};

const WIDGET_URL =
  process.env.REVIEWS_WIDGET_URL ?? "https://reputationhub.site/reputation/widgets/review_widget/PsjVrU6emhtFrBnTcoK1";
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Euro+Patisserie+Armadale";

type WidgetData = {
  reviews?: { id: string; reviewerName?: string; starRating?: number; comment?: string; dateAdded?: string }[];
  aggregateData?: { totalReviews?: number; totalRating?: number };
  widgetConfig?: { locationReviewLink?: string };
};

async function fromWidget(): Promise<Partial<GoogleReviews>> {
  try {
    const res = await fetch(WIDGET_URL);
    if (!res.ok) return {};
    const html = await res.text();
    const json = html.match(/window\.__SSR_DATA__\s*=\s*(\{[\s\S]*?\});\s*<\/script>/)?.[1];
    if (!json) return {};
    const data = JSON.parse(json) as WidgetData;
    return {
      rating: data.aggregateData?.totalRating ?? null,
      count: data.aggregateData?.totalReviews ?? null,
      writeUrl: data.widgetConfig?.locationReviewLink,
      // Five-star reviews with something to say, newest first.
      reviews: (data.reviews ?? [])
        .filter((r) => r.starRating === 5 && (r.comment?.trim().length ?? 0) >= 40)
        .sort((a, b) => (b.dateAdded ?? "").localeCompare(a.dateAdded ?? ""))
        .slice(0, 40)
        .map((r) => ({
          id: r.id,
          author: r.reviewerName?.trim() || "Google reviewer",
          text: r.comment!.trim(),
          date: r.dateAdded ?? "",
        })),
    };
  } catch {
    return {};
  }
}

type PlaceResponse = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  photos?: { name: string; authorAttributions?: { displayName?: string }[] }[];
};

async function fromPlaces(): Promise<Partial<GoogleReviews>> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return {};
  try {
    const headers = { "X-Goog-Api-Key": key };
    const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: { ...headers, "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,photos" },
    });
    if (!res.ok) return {};
    const place = (await res.json()) as PlaceResponse;
    // Resolve each photo to its public googleusercontent URL so the key never reaches the browser.
    const photos = await Promise.all(
      (place.photos ?? []).slice(0, 8).map(async (p) => {
        const r = await fetch(
          `https://places.googleapis.com/v1/${p.name}/media?maxWidthPx=800&skipHttpRedirect=true`,
          { headers },
        );
        const uri = r.ok ? ((await r.json()) as { photoUri?: string }).photoUri : undefined;
        return uri ? { url: uri, author: p.authorAttributions?.[0]?.displayName ?? null } : null;
      }),
    );
    return {
      rating: place.rating,
      count: place.userRatingCount,
      readUrl: place.googleMapsUri,
      writeUrl: `https://search.google.com/local/writereview?placeid=${placeId}`,
      photos: photos.filter((p): p is GooglePhoto => !!p),
    };
  } catch {
    return {};
  }
}

async function fetchReviews(): Promise<GoogleReviews> {
  const [widget, places] = await Promise.all([fromWidget(), fromPlaces()]);
  return {
    rating: places.rating ?? widget.rating ?? null,
    count: places.count ?? widget.count ?? null,
    reviews: widget.reviews ?? [],
    photos: places.photos ?? [],
    readUrl: places.readUrl ?? MAPS_URL,
    writeUrl: places.writeUrl ?? widget.writeUrl ?? MAPS_URL,
  };
}

/** Cached for six hours — reviews change slowly (and Places calls are billed). */
export const getGoogleReviews = unstable_cache(fetchReviews, ["google-reviews-v3"], { revalidate: 21600 });
