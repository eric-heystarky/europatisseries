import type { Metadata } from "next";
import { getCachedMenu } from "@/lib/menu";
import CateringView from "./catering-view";
import { FaqSection } from "@/components/faq-section";

// Catering packs are priced live from the Square menu — render at request time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catering & Events",
  description:
    "Catering & events for any occasion in Armadale — best-seller platters, build-your-own packs, wedding cakes and cocktail pieces. Order online with volume discounts up to 11% off.",
  alternates: { canonical: "/catering" },
};

export default async function Page() {
  const menu = await getCachedMenu();
  return (
    <>
      <CateringView menu={menu} />
      <FaqSection />
    </>
  );
}
