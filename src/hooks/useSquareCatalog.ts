import { useQuery } from "@tanstack/react-query";
import { FALLBACK_PRODUCTS, type Product } from "@/lib/squareCatalog";

export type { Product };

/**
 * Loads the catalog from our own `/api/catalog` endpoint (served by the Vite dev
 * middleware locally, or a serverless function in production). The Square token lives
 * on the server, so it is never shipped to the browser and there is no CORS problem.
 */
export function useSquareCatalog() {
  return useQuery({
    queryKey: ["square-catalog"],
    queryFn: async (): Promise<Product[]> => {
      try {
        const response = await fetch("/api/catalog");

        if (!response.ok) {
          throw new Error(`Catalog endpoint responded ${response.status}`);
        }

        const products = (await response.json()) as Product[];
        return products.length > 0 ? products : FALLBACK_PRODUCTS;
      } catch (error) {
        console.warn("Catalog fetch failed. Falling back to local data.", error);
        return FALLBACK_PRODUCTS;
      }
    },
  });
}
