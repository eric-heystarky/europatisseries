"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { useCart } from "./cart-context";
import { selectShopTab } from "./home/shop-events";

/**
 * Phones only: the v4 sticky bag bar. Once you're past the hero it offers
 * "Order now"; with something in the bag it becomes "View bag · count · total".
 * (On desktop the header bag and the floating Contact button do this job.)
 */
export function MobileOrderBar() {
  const pathname = usePathname();
  const { count, subtotalCents, openDrawer, drawerOpen } = useCart();
  const [pastHero, setPastHero] = useState(false);
  const isHome = pathname === "/";
  const isMenu = pathname === "/pre-order";

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.7);
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
