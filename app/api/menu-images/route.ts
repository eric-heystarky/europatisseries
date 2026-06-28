import { NextResponse } from "next/server";
import { getCachedMenu } from "@/lib/menu";

export const dynamic = "force-dynamic";

/**
 * Flat list of menu item photo URLs, used by the homepage's rotating showcase.
 * Cached alongside the menu (revalidated by the same `menu` tag).
 */
export async function GET() {
  try {
    const menu = await getCachedMenu();
    const images = menu.categories
      .flatMap((c) => c.items.map((i) => i.imageUrl))
      .filter((url): url is string => Boolean(url));
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] });
  }
}
