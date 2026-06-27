/**
 * Client-only loader for the Google Maps JS API (Places library). Loads the
 * script once and caches the promise. Uses the public browser key
 * (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY), which must be restricted by HTTP referrer
 * in the Google Cloud console.
 *
 * Typed loosely as `any` so we don't need the @types/google.maps dependency.
 */
let mapsPromise: Promise<unknown> | null = null;

export function loadGoogleMaps(): Promise<unknown> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only load in the browser"));
  }

  const w = window as unknown as Record<string, unknown> & {
    google?: { maps?: unknown };
  };
  if (w.google?.maps) return Promise.resolve(w.google.maps);
  if (mapsPromise) return mapsPromise;

  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!key) {
    return Promise.reject(new Error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set"));
  }

  mapsPromise = new Promise((resolve, reject) => {
    const callbackName = "__onGoogleMapsLoaded";
    (w as Record<string, unknown>)[callbackName] = () => resolve(w.google!.maps);

    const script = document.createElement("script");
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}` +
      `&libraries=places&loading=async&v=weekly&callback=${callbackName}`;
    script.async = true;
    script.onerror = () => reject(new Error("Failed to load the Google Maps JS API"));
    document.head.appendChild(script);
  });

  return mapsPromise;
}
