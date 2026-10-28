"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { useCart } from "./cart-context";
import { selectShopTab } from "./home/shop-events";

/**
 * Phones only: the v4 sticky bag bar. Once you're past the hero it offers
 * "Order now"; with something in the bag it becomes "View bag · count · total".
 * A back-to-top arrow rides just above it once you're well down a long page.
 * (On desktop the header bag and the floating buttons do this job.)
 */
export function MobileOrderBar() {
  const pathname = usePathname();
  const { count, subtotalCents, openDrawer, drawerOpen } = useCart();
  const [pastHero, setPastHero] = useState(false);
  const [farDown, setFarDown] = useState(false);
  const isHome = pathname === "/";
  const isMenu = pathname === "/pre-order";

  useEffect(() => {
    const onScroll = () => {
      setPastHero(window.scrollY > window.innerHeight * 0.7);
      setFarDown(window.scrollY > window.innerHeight * 1.5);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Never at checkout or over the open bag; on the homepage only after the hero's own Order now.
  const hidden = pathname.startsWith("/checkout") || drawerOpen || (isHome && !pastHero && count === 0);

  return (
    <div
      aria-hidden={hidden || undefined}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-euro-line bg-white px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 transition-transform duration-300 md:hidden ${
        hidden ? "pointer-events-none translate-y-full" : "translate-y-0"
      }`}
    >
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        tabIndex={!hidden && farDown ? 0 : -1}
        className={`absolute -top-14 right-4 flex h-11 w-11 items-center justify-center border border-euro-line bg-white/95 text-euro-ink shadow-[0_6px_18px_rgba(5,9,48,0.1)] backdrop-blur transition-opacity duration-300 ${
          farDown ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <ArrowUp className="h-4 w-4" strokeWidth={1.4} />
      </button>

      {count > 0 ? (
        <button type="button" onClick={openDrawer} tabIndex={hidden ? -1 : 0} className="btn-euro w-full justify-between">
          <span>View bag · {count}</span>
          <span className="tabular-nums">{formatPrice(subtotalCents, "AUD")}</span>
        </button>
      ) : isHome ? (
        <a href="#shop" onClick={() => selectShopTab("viennoiserie")} tabIndex={hidden ? -1 : 0} className="btn-euro w-full">
          Order now
        </a>
      ) : isMenu ? (
        // Already on the menu: back up to the products (e.g. from the FAQ).
        <a href="#shop" tabIndex={hidden ? -1 : 0} className="btn-euro w-full">
          Order now
        </a>
      ) : (
        <Link href="/pre-order" tabIndex={hidden ? -1 : 0} className="btn-euro w-full">
          Order now
        </Link>
      )}
    </div>
  );
}
