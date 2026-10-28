"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { Instagram, Search, ShoppingBag } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTrigger, SheetTitle } from "./ui/sheet";
import { useCart } from "./cart-context";

const LOGO = "/images/logo/euro-patisserie.svg";

const DOG_IMG =
  "https://vibe.filesafe.space/1782359074813107391/attachments/17124f1b-7f7c-4903-94c7-7d24968b1d60.png";

const INSTAGRAM = "https://www.instagram.com/europatisseriearmadale/?hl=en";
const TIKTOK = "https://www.tiktok.com/@europatisseriearmadale";

const LEFT_LINKS = [
  { name: "Menu", path: "/pre-order" },
  { name: "Catering", path: "/catering" },
  { name: "Gift Cards", path: "/gift-cards" },
];

const DRAWER_LINKS = [
  { name: "Menu", path: "/pre-order" },
  { name: "Catering & Events", path: "/catering" },
  { name: "The Café", path: "/cafe" },
  { name: "Gift Cards", path: "/gift-cards" },
  { name: "Our Story", path: "/about" },
  { name: "Join the Team", path: "/join-team" },
  { name: "FAQ", path: "/pre-order#faq" },
  { name: "Contact", path: "/contact" },
];

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className={className} aria-hidden="true">
      <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M14 3c.5 2.8 2.4 4.5 5 4.8" />
    </svg>
  );
}

/**
 * Site header. On the homepage it sits transparent over the hero photo; once the
 * visitor scrolls (or on any other page) it becomes a slim, solid sticky bar so the
 * menu, logo and bag are always one tap away.
 */
export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const { count, openDrawer } = useCart();
  const isHomePage = pathname === "/";

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 60);
  });

  const overHero = isHomePage && !isScrolled;
  const tone = overHero ? "text-white" : "text-euro-ink";

  return (
    <header className="fixed top-0 z-50 w-full">
      {/* Announcement — pinned above the header as you scroll; the clearest way in to ordering.
          Phones: two short lines (ordering, then store details) in the same 36px height. */}
      <Link
        href="/pre-order"
        className="group flex h-9 items-center justify-center gap-2 bg-euro-cream px-4 text-center font-medium uppercase text-euro-ink transition-colors hover:bg-euro-line"
      >
        <span className="flex flex-col text-[9.5px] leading-[1.35] tracking-[0.1em] md:block md:text-[11px] md:leading-normal md:tracking-[0.14em]">
          <span>
            <span className="underline-offset-4 group-hover:underline">Order online any time</span> · Pickup or delivery
          </span>
          <span className="text-euro-soft md:text-euro-ink">
            <span className="hidden md:inline"> · </span>Open 7 days, 7am – 3pm · 974 High St
            <span className="hidden min-[375px]:inline">, Armadale</span>
          </span>
        </span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
          <path d="m9 6 6 6-6 6" />
        </svg>
      </Link>

      <nav
        aria-label="Main"
        className={`w-full transition-all duration-300 ${
          overHero
            ? "bg-transparent"
            : "border-b border-euro-line bg-white/95 shadow-[0_6px_24px_rgba(0,0,0,0.05)] backdrop-blur"
        }`}
      >
        <div
          className={`relative grid grid-cols-[1fr_auto_1fr] items-center px-4 transition-all duration-300 md:px-12 ${
            overHero ? "h-[84px] md:h-[104px]" : "h-[60px] md:h-[68px]"
          }`}
        >
          {/* Left: menu drawer + primary links */}
          <div className={`flex items-center gap-6 ${tone}`}>
            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="flex h-11 w-8 items-center transition-opacity hover:opacity-70"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="h-5 w-5" aria-hidden="true">
                    <path d="M3 9h18M3 15h12" />
                  </svg>
                </button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="flex w-[85vw] flex-col overflow-y-auto border-r border-euro-line bg-white p-0 sm:w-[50vw] md:max-w-[400px]"
              >
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="flex h-[76px] shrink-0 items-center justify-center border-b border-euro-line px-6">
                  <img src={LOGO} alt="Euro Patisserie" className="max-h-[40px] object-contain" />
                </div>
                <div className="flex flex-1 flex-col gap-8 p-8">
                  <nav aria-label="Site" className="flex flex-col gap-5">
                    {DRAWER_LINKS.map((link) => (
                      <SheetClose asChild key={link.path}>
                        <Link
                          href={link.path}
                          className={`text-[15px] font-light uppercase tracking-[0.16em] transition-colors hover:text-euro-ink ${
                            pathname === link.path ? "text-euro-ink" : "text-euro-soft"
                          }`}
                        >
                          {link.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>

                  <SheetClose asChild>
                    <Link href="/cafe" className="group relative block aspect-square w-full overflow-hidden">
                      <img
                        src={DOG_IMG}
                        alt="A dachshund in the café courtyard"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />
                      <span className="absolute bottom-4 left-4 text-white">
                        <span className="block text-[11px] font-medium uppercase tracking-[0.16em]">We&apos;re</span>
                        <span className="block text-sm font-light uppercase tracking-[0.14em]">Dog friendly</span>
                      </span>
                    </Link>
                  </SheetClose>

                  <div className="mt-auto flex items-center gap-5 border-t border-euro-line pt-5 text-euro-ink">
                    <a aria-label="Euro Patisserie on Instagram" href={INSTAGRAM} target="_blank" rel="noreferrer" className="hover:opacity-70">
                      <Instagram className="h-5 w-5" strokeWidth={1.4} />
                    </a>
                    <a aria-label="Euro Patisserie on TikTok" href={TIKTOK} target="_blank" rel="noreferrer" className="hover:opacity-70">
                      <TikTokIcon className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div className="hidden items-center gap-7 lg:flex">
              {LEFT_LINKS.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="text-[12.5px] font-medium uppercase tracking-[0.1em] transition-opacity hover:opacity-70"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Centre: logo */}
          <Link href="/" className="justify-self-center" aria-label="Euro Patisserie — home">
            <img
              src={LOGO}
              alt="Euro Patisserie"
              className={`object-contain transition-all duration-300 ${
                overHero ? "h-[52px] brightness-0 invert md:h-[70px]" : "h-[40px] md:h-[46px]"
              }`}
            />
          </Link>

          {/* Right: café, socials, search, bag */}
          <div className={`flex items-center justify-end gap-4 md:gap-5 ${tone}`}>
            <Link
              href="/cafe"
              className="hidden text-[12.5px] font-medium uppercase tracking-[0.1em] transition-opacity hover:opacity-70 lg:block"
            >
              The Café
            </Link>
            <a
              aria-label="Euro Patisserie on Instagram"
              href={INSTAGRAM}
              target="_blank"
              rel="noreferrer"
              className="hidden transition-opacity hover:opacity-70 md:block"
            >
              <Instagram className="h-[19px] w-[19px]" strokeWidth={1.4} />
            </a>
            <a
              aria-label="Euro Patisserie on TikTok"
              href={TIKTOK}
              target="_blank"
              rel="noreferrer"
              className="hidden transition-opacity hover:opacity-70 md:block"
            >
              <TikTokIcon className="h-[18px] w-[18px]" />
            </a>
            <button type="button" aria-label="Search" className="hidden transition-opacity hover:opacity-70 md:block">
              <Search className="h-[19px] w-[19px]" strokeWidth={1.4} />
            </button>
            <button
              type="button"
              onClick={openDrawer}
              aria-label={`Bag, ${count} ${count === 1 ? "item" : "items"}`}
              className="relative flex h-11 w-9 items-center justify-center transition-opacity hover:opacity-70"
            >
              <ShoppingBag className="h-[20px] w-[20px]" strokeWidth={1.4} />
              {count > 0 && (
                <span
                  key={count}
                  className={`absolute right-0 top-1.5 inline-flex h-4 min-w-4 animate-[bag-pop_0.5s_ease] items-center justify-center rounded-full px-1 text-[10px] font-medium tabular-nums ${
                    overHero ? "bg-white text-euro-ink" : "bg-euro-ink text-white"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
