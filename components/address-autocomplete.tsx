"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "@/lib/google-maps";

export type AutocompletedAddress = {
  line1: string;
  locality: string;
  region: string;
  postalCode: string;
  /** Exact coordinates of the picked place, used to skip geocoding downstream. */
  coords?: { lat: number; lon: number };
};

/* Minimal shapes for the bits of the new Places API we touch (avoids @types). */
type AddressComponent = { longText: string | null; shortText: string | null; types: string[] };
type Place = {
  fetchFields: (opts: { fields: string[] }) => Promise<unknown>;
  addressComponents?: AddressComponent[];
  location?: { lat: () => number; lng: () => number } | null;
  formattedAddress?: string | null;
};
type Prediction = { text: { text: string }; toPlace: () => Place };
type Suggestion = { placePrediction: Prediction | null };
type PlacesLib = {
  AutocompleteSuggestion: {
    fetchAutocompleteSuggestions: (req: Record<string, unknown>) => Promise<{ suggestions: Suggestion[] }>;
  };
  AutocompleteSessionToken: new () => object;
};

/**
 * "Search your address" input backed by Google's current Places Autocomplete
 * (`AutocompleteSuggestion` data API — works on new Google accounts, unlike the
 * legacy widget). Renders a custom, brand-styled dropdown; on selection it
 * parses the address + coordinates and calls `onSelect` so the parent fills its
 * structured fields. Progressive enhancement: if the key is missing or Maps
 * fails to load, it's just a text box and the manual fields below still work.
 */
export function AddressAutocomplete({
  onSelect,
}: {
  onSelect: (a: AutocompletedAddress) => void;
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);

  const libRef = useRef<PlacesLib | null>(null);
  const tokenRef = useRef<object | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // Load the Places library once (best-effort — never blocks the manual fields).
  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps()
      .then(async (maps) => {
        if (cancelled) return;
        const importLibrary = (maps as { importLibrary: (n: string) => Promise<unknown> }).importLibrary;
        libRef.current = (await importLibrary("places")) as PlacesLib;
        tokenRef.current = new libRef.current.AutocompleteSessionToken();
      })
      .catch((err: unknown) => {
        console.warn("Address autocomplete unavailable:", err instanceof Error ? err.message : err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Close the dropdown on outside click.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // Debounced suggestion fetch as the user types.
  useEffect(() => {
    const lib = libRef.current;
    if (!lib || query.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    const handle = setTimeout(async () => {
      try {
        setLoading(true);
        const { suggestions } = await lib.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: query,
          sessionToken: tokenRef.current ?? undefined,
          includedRegionCodes: ["au"],
        });
        setSuggestions(suggestions.filter((s) => s.placePrediction));
        setOpen(true);
        setActive(-1);
      } catch (err) {
        console.warn("Address suggestion fetch failed:", err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(handle);
  }, [query]);

  const choose = useCallback(async (s: Suggestion) => {
    const pred = s.placePrediction;
    const lib = libRef.current;
    if (!pred) return;
    setOpen(false);
    setQuery(pred.text.text);
    try {
      const place = pred.toPlace();
      await place.fetchFields({ fields: ["addressComponents", "location", "formattedAddress"] });
      const comps = place.addressComponents ?? [];
      const get = (type: string) => comps.find((c) => c.types.includes(type));
      const streetNumber = get("street_number")?.longText ?? "";
      const route = get("route")?.longText ?? "";
      const loc = place.location;
      onSelectRef.current({
        line1: `${streetNumber} ${route}`.trim(),
        locality:
          get("locality")?.longText ??
          get("postal_town")?.longText ??
          get("sublocality")?.longText ??
          "",
        region: get("administrative_area_level_1")?.shortText ?? "",
        postalCode: get("postal_code")?.longText ?? "",
        coords: loc ? { lat: loc.lat(), lon: loc.lng() } : undefined,
      });
      if (place.formattedAddress) setQuery(place.formattedAddress);
    } catch (err) {
      console.warn("Address details lookup failed:", err);
    } finally {
      // Start a fresh billing session for the next search.
      if (lib) tokenRef.current = new lib.AutocompleteSessionToken();
    }
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      void choose(suggestions[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={boxRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Start typing your address…"
        className="field-brutal"
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute z-30 mt-1 max-h-64 w-full overflow-auto border-2 border-border bg-background shadow-[4px_4px_0_0_hsl(var(--primary))]">
          {suggestions.map((s, i) => (
            <li key={i}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => void choose(s)}
                className={`block w-full px-3 py-2 text-left text-sm ${
                  i === active ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                }`}
              >
                {s.placePrediction?.text.text}
              </button>
            </li>
          ))}
        </ul>
      )}
      {loading && (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          …
        </span>
      )}
    </div>
  );
}
