"use client";

import { useEffect, useRef } from "react";
import { loadGoogleMaps } from "@/lib/google-maps";

export type AutocompletedAddress = {
  line1: string;
  locality: string;
  region: string;
  postalCode: string;
};

/* Minimal shapes for the bits of the Maps API we touch (avoids @types/google.maps). */
type AddressComponent = { long_name: string; short_name: string; types: string[] };
type AutocompleteLike = {
  addListener: (event: string, cb: () => void) => void;
  getPlace: () => { address_components?: AddressComponent[] };
};

/**
 * A standalone "search your address" input backed by Google Places Autocomplete
 * (Australia only). On selection it parses the address and calls `onSelect` so
 * the parent can fill its structured fields. Progressive enhancement: if the key
 * is missing or Maps fails to load, this is just an inert text box and the manual
 * address fields below it still work.
 */
export function AddressAutocomplete({
  onSelect,
}: {
  onSelect: (a: AutocompletedAddress) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  // Keep the latest callback without re-binding the widget on every render.
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    let cancelled = false;

    loadGoogleMaps()
      .then(async (maps) => {
        if (cancelled || !inputRef.current) return;
        const importLibrary = (maps as { importLibrary: (n: string) => Promise<unknown> })
          .importLibrary;
        const { Autocomplete } = (await importLibrary("places")) as {
          Autocomplete: new (
            input: HTMLInputElement,
            opts: Record<string, unknown>,
          ) => AutocompleteLike;
        };

        const ac = new Autocomplete(inputRef.current, {
          componentRestrictions: { country: ["au"] },
          fields: ["address_components"],
          types: ["address"],
        });

        ac.addListener("place_changed", () => {
          const comps = ac.getPlace().address_components ?? [];
          const get = (type: string) => comps.find((c) => c.types.includes(type));
          const streetNumber = get("street_number")?.long_name ?? "";
          const route = get("route")?.long_name ?? "";

          onSelectRef.current({
            line1: `${streetNumber} ${route}`.trim(),
            locality:
              get("locality")?.long_name ??
              get("postal_town")?.long_name ??
              get("sublocality")?.long_name ??
              "",
            region: get("administrative_area_level_1")?.short_name ?? "",
            postalCode: get("postal_code")?.long_name ?? "",
          });
        });
      })
      .catch((err: unknown) => {
        // Autocomplete is optional sugar — never block checkout on it.
        console.warn(
          "Address autocomplete unavailable:",
          err instanceof Error ? err.message : err,
        );
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Start typing your address…"
      className="field-brutal"
      autoComplete="off"
    />
  );
}
