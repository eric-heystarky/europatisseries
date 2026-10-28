import { NextResponse } from "next/server";
import { getMenuOrSample } from "@/lib/menu-source";
import { buildShop } from "@/lib/shop";

export const dynamic = "force-dynamic";

export type SearchEntry = {
  id: string;
  name: string;
  /** Shop tab the item lives in (opens /pre-order?tab=…&item=…). */
  tab: string;
  tabName: string;
  fromCents: number;
  imageUrl: string | null;
};

/**
 * The whole menu as a small flat index for the header search. The dialog loads it
 * once when opened and filters as you type, so typing never waits on the network.
 */
export async function GET() {
  const { menu, source } = await getMenuOrSample();
  const shop = buildShop(menu, source);
  const items: SearchEntry[] = [...shop.core, ...shop.more].flatMap((t) =>
    t.items.map((i) => ({
      id: i.id,
      name: i.name,
      tab: t.id,
      tabName: t.name,
      fromCents: i.fromCents,
      imageUrl: i.imageUrl,
    })),
  );
  return NextResponse.json({ currency: shop.currency, items });
}
