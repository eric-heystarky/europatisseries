"use client";

import Script from "next/script";
import { Instagram } from "lucide-react";
import { BUSINESS } from "@/lib/site";
import type { GoogleReview, GoogleReviews } from "@/lib/google-reviews";
import type { InstagramPost } from "@/lib/instagram";

/**
 * One fold, two columns: Google reviews on the left (a slow vertical scroll of
 * same-size cards, paused on hover) and Instagram on the right.
 */
export function SocialSection({ reviews, posts }: { reviews: GoogleReviews; posts: InstagramPost[] }) {
  return (
    <section
      id="reviews"
      className="grid items-start gap-14 bg-euro-tint px-6 py-16 md:px-12 lg:min-h-[calc(100svh-68px)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:content-center lg:gap-14 lg:py-14"
    >
      <Reviews data={reviews} />

      <div className="flex min-w-0 flex-col gap-6">
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-3">
            <p className="euro-eyebrow text-euro-muted">Follow along</p>
            <a
              href={BUSINESS.instagram}
              target="_blank"
              rel="noreferrer"
              className="text-[clamp(18px,1.7vw,22px)] font-light tracking-[0.04em] text-euro-ink underline-offset-[6px] hover:underline"
            >
              @europatisseriearmadale
            </a>
          </div>
          <a
            href={BUSINESS.instagram}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.18em] text-euro-ink hover:opacity-70"
          >
            <Instagram className="h-4 w-4" strokeWidth={1.4} />
            Follow
          </a>
        </div>
        {posts.length ? (
          <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {posts.slice(0, 6).map((p) => (
              <li key={p.id}>
                <PostTile post={p} />
              </li>
            ))}
          </ul>
        ) : (
          <CommonNinjaFeed />
        )}
      </div>
    </section>
  );
}

// The live Instagram feed from the current site: a Common Ninja widget that holds the
// account connection, so no token is needed here. Its look is set in the Common Ninja dashboard.
const COMMON_NINJA_FEED = "ee1f0403-91ac-4e12-b9f6-d60465fbee01";

function CommonNinjaFeed() {
  return (
    <>
      <div className={`commonninja_component pid-${COMMON_NINJA_FEED} min-h-[420px] w-full`} />
      <Script src="https://cdn.commoninja.com/sdk/latest/commonninja.js" strategy="lazyOnload" />
    </>
  );
}

function PostTile({ post }: { post: InstagramPost }) {
  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noreferrer"
      aria-label={`${post.caption.slice(0, 80) || "Post"} — on Instagram`}
      className="group relative block aspect-[4/5] overflow-hidden bg-euro-cream"
      onMouseEnter={(e) => e.currentTarget.querySelector("video")?.play().catch(() => {})}
      onMouseLeave={(e) => e.currentTarget.querySelector("video")?.pause()}
    >
      {post.videoUrl ? (
        <video src={post.videoUrl} poster={post.imageUrl} muted loop playsInline preload="none" className="h-full w-full object-cover" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.imageUrl}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      )}
      {post.kind === "reel" && (
        <svg viewBox="0 0 24 24" className="absolute right-3 top-3 h-5 w-5 text-white drop-shadow" fill="currentColor" aria-hidden="true">
          <path d="M8 5.5v13l10.5-6.5z" />
        </svg>
      )}
    </a>
  );
}

function Stars({ className }: { className: string }) {
  return (
    <span className="flex gap-[3px] text-euro-ink" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, s) => (
        <svg key={s} viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
        </svg>
      ))}
    </span>
  );
}

export function Reviews({ data }: { data: GoogleReviews }) {
  const { rating, count, reviews, readUrl, writeUrl } = data;

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="euro-eyebrow text-euro-muted">Google reviews</p>
        <div className="flex items-center gap-5">
          {rating ? <span className="text-[44px] font-extralight leading-none text-euro-ink">{rating.toFixed(1)}</span> : null}
          <span className="flex flex-col gap-2">
            <Stars className="h-4 w-4" />
            <span className="text-[12px] uppercase tracking-[0.14em] text-euro-soft">
              {count ? `${count.toLocaleString()} reviews on Google` : "Reviews on Google"}
            </span>
          </span>
        </div>
      </div>

      {reviews.length > 0 && (
        // Two copies of the list scroll upward as one loop; hover (or focus) pauses it.
        <div className="review-marquee group relative h-[420px] overflow-hidden [mask-image:linear-gradient(180deg,transparent,#000_40px,#000_calc(100%-40px),transparent)]">
          <ul
            className="review-track flex flex-col gap-3 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
            style={{ animationDuration: `${reviews.length * 6}s` }}
          >
            {[...reviews, ...reviews].map((r, n) => (
              <ReviewCard key={`${r.id}-${n}`} review={r} hidden={n >= reviews.length} />
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <a href={readUrl} target="_blank" rel="noreferrer" className="btn-euro-outline text-euro-ink hover:bg-euro-ink hover:text-white">
          Read all reviews
        </a>
        <a href={writeUrl} target="_blank" rel="noreferrer" className="btn-euro">
          Leave a review
        </a>
      </div>
      <p className="text-[10.5px] uppercase tracking-[0.16em] text-euro-muted">
        Powered by{" "}
        <a href="https://heystarky.com.au" target="_blank" rel="noreferrer" className="underline-offset-4 hover:text-euro-ink hover:underline">
          HeyStarky CRM
        </a>
      </p>
    </div>
  );
}

function ReviewCard({ review, hidden }: { review: GoogleReview; hidden: boolean }) {
  return (
    <li
      aria-hidden={hidden || undefined}
      className="flex h-[168px] flex-none flex-col justify-between border border-euro-line bg-white px-6 py-5"
    >
      <p className="line-clamp-3 text-[14px] leading-[1.7] text-euro-text">&ldquo;{review.text}&rdquo;</p>
      <span className="flex items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-euro-cream text-[11px] uppercase text-euro-ink">
            {review.author.charAt(0)}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[11.5px] font-medium uppercase tracking-[0.12em] text-euro-ink">{review.author}</span>
            <span className="block text-[11.5px] text-euro-muted">
              {review.date && new Date(review.date).toLocaleDateString("en-AU", { month: "long", year: "numeric" })}
            </span>
          </span>
        </span>
        <Stars className="h-3 w-3" />
      </span>
    </li>
  );
}
