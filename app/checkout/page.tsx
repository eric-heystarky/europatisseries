import type { Metadata } from "next";
import { getMenuOrSample } from "@/lib/menu-source";
import { Checkout } from "@/components/checkout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const { currency } = (await getMenuOrSample()).menu;
  return <Checkout currency={currency} />;
}
