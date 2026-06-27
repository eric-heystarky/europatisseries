"use client";

import { useEffect, useState } from "react";

/**
 * Shared, cached loader for the menu photo pool (from /api/menu-images).
 * One fetch is shared across every tile that calls the hook.
 */
let cache: string[] | null = null;
let inflight: Promise<string[]> | null = null;

function load(): Promise<string[]> {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = fetch("/api/menu-images")
      .then((r) => r.json())
      .then((d: { images?: string[] }) => {
        const arr = Array.isArray(d.images) ? [...d.images].sort(() => Math.random() - 0.5) : [];
        cache = arr;
        return arr;
      })
      .catch(() => {
        cache = [];
        return [];
      });
  }
  return inflight;
}

export function useMenuImages(): string[] {
  const [images, setImages] = useState<string[]>(cache ?? []);
  useEffect(() => {
    let active = true;
    load().then((a) => {
      if (active) setImages(a);
    });
    return () => {
      active = false;
    };
  }, []);
  return images;
}
