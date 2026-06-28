import { getCachedMenu } from "@/lib/menu";
import { Checkout } from "@/components/checkout";

export const dynamic = "force-dynamic";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const { currency } = await getCachedMenu();
  return <Checkout currency={currency} />;
}
