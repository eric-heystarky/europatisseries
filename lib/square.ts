import "server-only";
import { SquareClient, SquareEnvironment } from "square";

/**
 * Server-side Square client. Uses the secret access token, so this module
 * must never be imported into a client component ("server-only" enforces it).
 *
 * The client is created lazily the first time it's used — importing this module
 * never throws, so `next build` can collect page data even when env vars aren't
 * present at build time (e.g. on a host before they're configured).
 */
const environment =
  process.env.SQUARE_ENVIRONMENT === "production"
    ? SquareEnvironment.Production
    : SquareEnvironment.Sandbox;

let client: SquareClient | null = null;

function getClient(): SquareClient {
  if (!client) {
    const token = process.env.SQUARE_ACCESS_TOKEN;
    if (!token) {
      throw new Error(
        "SQUARE_ACCESS_TOKEN is not set — add it to your environment variables (.env.local locally, or your host's project settings).",
      );
    }
    client = new SquareClient({ token, environment });
  }
  return client;
}

/** Lazy proxy so calls like `square.catalog.search(...)` work, but no token is required until used. */
export const square = new Proxy({} as SquareClient, {
  get(_target, prop) {
    return getClient()[prop as keyof SquareClient];
  },
});

export const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID ?? "";
