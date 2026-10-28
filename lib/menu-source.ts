import "server-only";
import { getCachedMenu, type Menu } from "./menu";
import sampleMenu from "./sample-menu.json";

export type MenuSource = { menu: Menu; source: "square" | "sample" };

/**
 * The live Square menu, or — when Square isn't configured (e.g. local dev
 * without sandbox keys) — a snapshot of the live menu so every page still
 * renders. Ordering against the sample can't be checked out.
 */
export async function getMenuOrSample(): Promise<MenuSource> {
  if (!process.env.SQUARE_ACCESS_TOKEN || process.env.USE_SAMPLE_MENU === "1") {
    return { menu: sampleMenu as Menu, source: "sample" };
  }
  try {
    return { menu: await getCachedMenu(), source: "square" };
  } catch (err) {
    console.error("[menu] Square unavailable, using the sample menu:", err);
    return { menu: sampleMenu as Menu, source: "sample" };
  }
}
