import type { Metadata } from "next";
import { getCachedMenu } from "@/lib/menu";
import { Checkout } from "@/components/checkout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const { currency } = await getCachedMenu();
  return <Checkout currency={currency} />;
}
