import type { Metadata } from "next";
import { getCachedMenu } from "@/lib/menu";
import { MenuClient } from "@/components/menu-client";

// Live menu — render at request time (cached 5 min via getCachedMenu), never prerendered at build.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Menu — Order Pastries & Cakes Online",
  description:
    "Browse the full Euro Patisserie menu — croissants, cakes, tarts, quiches, macarons & more. Order online for pickup or delivery in Armadale.",
  alternates: { canonical: "/pre-order" },
};

export default async function PreOrderPage() {
  const menu = await getCachedMenu();

  // ItemList of Products for richer search results.
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Euro Patisserie Menu",
    itemListElement: menu.categories
      .flatMap((c) => c.items)
      .map((item, i) => {
        const min = item.variations.length ? Math.min(...item.variations.map((v) => v.priceCents)) : 0;
        return {
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Product",
            name: item.name,
            ...(item.description ? { description: item.description } : {}),
            ...(item.imageUrl ? { image: item.imageUrl } : {}),
            offers: {
              "@type": "Offer",
              price: (min / 100).toFixed(2),
              priceCurrency: menu.currency,
              availability: "https://schema.org/InStock",
            },
          },
        };
      }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <MenuClient menu={menu} />
    </>
  );
}
