/**
 * Production catalog endpoint (Vercel / Node serverless style).
 *
 * Mirrors the Vite dev middleware so the deployed site has a same-origin `/api/catalog`
 * with the Square token kept server-side. Adjust the export signature to match your host
 * (Netlify Functions, Cloudflare Workers, Express, etc.) if you are not on Vercel.
 */
import { fetchSquareCatalog, FALLBACK_PRODUCTS } from "../src/lib/squareCatalog";

interface ResponseLike {
  setHeader(name: string, value: string): void;
  status(code: number): ResponseLike;
  json(body: unknown): void;
}

export default async function handler(_req: unknown, res: ResponseLike) {
  res.setHeader("Content-Type", "application/json");
  // Cache at the CDN for a minute to avoid hammering Square on every page view.
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");

  const token = process.env.SQUARE_ACCESS_TOKEN ?? "";
  const apiBase = process.env.SQUARE_API_BASE || "https://connect.squareupsandbox.com";

  try {
    if (!token) throw new Error("SQUARE_ACCESS_TOKEN is not set");
    const products = await fetchSquareCatalog(token, apiBase);
    res.status(200).json(products.length > 0 ? products : FALLBACK_PRODUCTS);
  } catch (error) {
    console.warn("[square] catalog fetch failed, serving fallback:", error);
    res.status(200).json(FALLBACK_PRODUCTS);
  }
}
