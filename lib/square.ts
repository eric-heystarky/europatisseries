import "server-only";
import { SquareClient, SquareEnvironment } from "square";

/**
 * Server-side Square client. Uses the secret access token, so this module
 * must never be imported into a client component ("server-only" enforces it).
 */
const environment =
  process.env.SQUARE_ENVIRONMENT === "production"
    ? SquareEnvironment.Production
    : SquareEnvironment.Sandbox;

if (!process.env.SQUARE_ACCESS_TOKEN) {
  throw new Error("SQUARE_ACCESS_TOKEN is not set — check .env.local");
}

export const square = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment,
});

export const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID!;
