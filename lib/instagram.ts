import { unstable_cache } from "next/cache";

/**
 * Latest Instagram posts, reels first. Needs INSTAGRAM_ACCESS_TOKEN — a
 * long-lived token from the "Instagram API with Instagram Login" for the
 * @europatisseriearmadale business account. Without it the homepage falls back
 * to our own product photos (still linking to the account).
 */
export type InstagramPost = {
  id: string;
  kind: "reel" | "image";
  videoUrl: string | null;
  imageUrl: string;
  permalink: string;
  caption: string;
};

type MediaResponse = {
  data?: {
    id: string;
    media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
    media_url?: string;
    thumbnail_url?: string;
    permalink: string;
    caption?: string;
  }[];
};

async function fetchPosts(): Promise<InstagramPost[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return [];
  try {
    const fields = "id,media_type,media_url,thumbnail_url,permalink,caption";
    const res = await fetch(`https://graph.instagram.com/me/media?fields=${fields}&limit=24&access_token=${token}`);
    if (!res.ok) return [];
    const { data = [] } = (await res.json()) as MediaResponse;
    const posts = data
      .map((m): InstagramPost | null => {
        const isVideo = m.media_type === "VIDEO";
        const imageUrl = isVideo ? m.thumbnail_url : m.media_url;
        if (!imageUrl) return null;
        return {
          id: m.id,
          kind: isVideo ? "reel" : "image",
          videoUrl: isVideo ? (m.media_url ?? null) : null,
          imageUrl,
          permalink: m.permalink,
          caption: m.caption ?? "",
        };
      })
      .filter((p): p is InstagramPost => !!p);
    // Reels first, newest first within each.
    return [...posts.filter((p) => p.kind === "reel"), ...posts.filter((p) => p.kind === "image")];
  } catch {
    return [];
  }
}

/** Instagram media URLs expire, so refresh hourly. */
export const getInstagramPosts = unstable_cache(fetchPosts, ["instagram-posts"], { revalidate: 3600 });
