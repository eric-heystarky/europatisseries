import { getCachedMenu } from "@/lib/menu";
import { MenuClient } from "@/components/menu-client";

// Live menu — render at request time (cached 5 min via getCachedMenu), never prerendered at build.
export const dynamic = "force-dynamic";

export default async function PreOrderPage() {
  const menu = await getCachedMenu();
  return <MenuClient menu={menu} />;
}
