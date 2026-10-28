import { getMenuOrSample } from "@/lib/menu-source";
import { buildShop } from "@/lib/shop";
import { getGoogleReviews } from "@/lib/google-reviews";
import { getInstagramPosts } from "@/lib/instagram";
import { Hero } from "@/components/home/hero";
import { ShopSection } from "@/components/home/shop";
import { EventsSection, LocationSection, OrderBanner } from "@/components/home/sections";
import { WhyEuroSection } from "@/components/home/story";
import { SocialSection } from "@/components/home/social";

// Live menu — render at request time (cached 5 min via getCachedMenu), never prerendered at build.
export const dynamic = "force-dynamic";

export default async function Index() {
  const [{ menu, source }, reviews, posts] = await Promise.all([
    getMenuOrSample(),
    getGoogleReviews(),
    getInstagramPosts(),
  ]);
  const shop = buildShop(menu, source);

  return (
    <div className="flex w-full flex-col bg-white">
      <Hero />
      <ShopSection shop={shop} />
      <WhyEuroSection />
      <OrderBanner />
      <EventsSection />
      <SocialSection reviews={reviews} posts={posts} />
      <LocationSection />
    </div>
  );
}
