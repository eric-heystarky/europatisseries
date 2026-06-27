import { getCachedMenu } from "@/lib/menu";
import { MenuClient } from "@/components/menu-client";

export default async function PreOrderPage() {
  const menu = await getCachedMenu();
  return <MenuClient menu={menu} />;
}
