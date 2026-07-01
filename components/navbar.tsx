"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Instagram, Search, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger, SheetTitle } from "./ui/sheet";
import { ThemeToggle } from "./ThemeToggle";
import { useCart } from "./cart-context";

const LOGO =
  "https://vibe.filesafe.space/1782359074813107391/attachments/7e2aeccd-b174-447b-90d6-578c90242df0.png";

const DOG_IMG =
  "https://vibe.filesafe.space/1782359074813107391/attachments/17124f1b-7f7c-4903-94c7-7d24968b1d60.png";

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const { count, openDrawer } = useCart();
  const isHomePage = pathname === "/";

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const primaryNavLinks = [
    { name: "PASTRIES", path: "/pre-order" },
    { name: "CATERING", path: "/catering" },
    { name: "GIFT CARDS", path: "/gift-cards" },
    { name: "ABOUT", path: "/about" },
    { name: "OUR CRAFT", path: "/our-craft" },
    { name: "FAQ", path: "/faq" },
    { name: "DOG FRIENDLY", path: "/dog-friendly" },
    { name: "JOIN THE TEAM", path: "/join-team" },
    { name: "CONTACT", path: "/contact" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 flex flex-col">
      {/* Top Marquee */}
      <div className="bg-primary text-primary-foreground flex items-center overflow-hidden border-primary-foreground/20 border-b-2">
        <div className="h-8 md:h-10 flex items-center whitespace-nowrap animate-marquee font-bold text-xs md:text-sm tracking-widest uppercase">
          {Array.from({ length: 7 }).map((_, i) => (
            <span key={i} className="flex shrink-0">
              <span className="mx-4">★ ORDER NOW ONLINE</span>
              <span className="mx-4">★ OPEN TUES-SUN 7AM-3PM</span>
            </span>
          ))}
        </div>
      </div>

      <nav
        className={`w-full transition-all duration-300 h-[70px] md:h-[80px] flex items-center ${
          isHomePage && !isScrolled
            ? "bg-transparent border-b-0 text-primary-foreground"
            : "bg-background/80 backdrop-blur-md border-b-2 border-primary text-primary"
        }`}
      >
        <div className="w-full flex items-center justify-between px-4 md:px-8 h-full relative">
          {/* Left side Menu Drawer */}
          <div className="flex items-center w-[100px] md:w-[200px]">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  className={`group hover:bg-primary hover:text-primary-foreground border-2 border-transparent hover:border-primary rounded-none ${
                    isHomePage && !isScrolled ? "text-primary-foreground" : "text-primary"
                  }`}
                >
                  <div className="flex flex-col items-start justify-center w-6 h-6 gap-[6px]">
                    <div className="w-6 h-[2px] bg-current" />
                    <div className="w-4 h-[2px] bg-current transition-all duration-300 group-hover:w-6" />
                  </div>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[85vw] sm:w-[50vw] md:max-w-[400px] border-r-2 border-primary p-0 bg-background flex flex-col overflow-y-auto"
              >
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="p-6 border-b-2 border-primary flex justify-center items-center h-[80px] shrink-0">
                  <img src={LOGO} alt="Euro Patisserie" className="h-full max-h-[40px] object-contain" />
                </div>
                <div className="flex flex-col flex-1 p-8 gap-6 items-start">
                  <div className="flex flex-col gap-4 w-full">
                    {primaryNavLinks.map((link, index) => (
                      <motion.div
                        key={link.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 + 0.1 }}
                      >
                        <SheetClose asChild>
                          <Link
                            href={link.path}
                            className={`text-lg md:text-xl font-faro uppercase tracking-widest hover:text-muted-foreground transition-colors text-left block ${
                              pathname === link.path ? "text-primary" : "text-primary/80"
                            }`}
                          >
                            {link.name}
                          </Link>
                        </SheetClose>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="w-full my-4"
                  >
                    <SheetClose asChild>
                      <Link
                        href="/dog-friendly"
                        className="group relative block aspect-square w-full overflow-hidden border-2 border-primary"
                      >
                        <img
                          src={DOG_IMG}
                          alt="We're dog friendly"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/25" />
                        <div className="absolute bottom-4 left-4">
                          <p className="text-white text-xs font-bold tracking-widest uppercase">We&apos;re</p>
                          <p className="text-white text-sm font-faro">Dog Friendly 🐾</p>
                        </div>
                      </Link>
                    </SheetClose>
                  </motion.div>

                  {/* Mobile-only social and search links */}
                  <div className="md:hidden flex gap-4 mt-auto pt-4 border-t-2 border-primary w-full">
                    <a
                      aria-label="Euro Patisserie on Instagram" href="https://www.instagram.com/europatisseriearmadale/?hl=en"
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:opacity-70 transition-opacity"
                    >
                      <Instagram className="w-6 h-6" />
                    </a>
                    <a
                      aria-label="Euro Patisserie on TikTok" href="https://www.tiktok.com/@europatisseriearmadale"
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:opacity-70 transition-opacity"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.64-5.46-.22-2.39.87-4.78 2.87-6.09 1.63-1.08 3.67-1.35 5.51-.83v4.09c-.43-.1-.88-.13-1.32-.12-.76.02-1.5.38-2.04.93-.52.54-.83 1.25-.87 1.99-.05.8.21 1.59.73 2.19.51.6 1.25.96 2.03 1.01.76.05 1.53-.18 2.14-.61.6-.43 1.01-1.07 1.15-1.8.04-.2.06-.41.06-.61V0h4.08z" />
                      </svg>
                    </a>
                    <ThemeToggle className="text-primary hover:opacity-70 transition-opacity ml-auto" />
                    <button aria-label="Search" className="text-primary hover:opacity-70 transition-opacity ml-4">
                      <Search className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo - Centered */}
          <div className="absolute left-1/2 -translate-x-1/2 h-full flex items-center py-2 z-10 pointer-events-none">
            <Link href="/" className="h-full flex items-center justify-center pointer-events-auto">
              <img
                src={LOGO}
                alt="Euro Patisserie"
                className={`h-full max-h-[45px] md:max-h-[60px] object-contain transition-all duration-300 ${
                  // Over the hero (home, not scrolled): white on the dark hero in light
                  // mode; dark in dark mode (where the hero flips light).
                  // On the solid bar: navy in light mode, white in dark mode.
                  isHomePage && !isScrolled
                    ? "brightness-0 invert dark:invert-0"
                    : "brightness-0 dark:invert"
                }`}
              />
            </Link>
          </div>

          {/* Right side navigation */}
          <div className="flex items-center justify-end gap-3 md:gap-5 w-[100px] md:w-[200px]">
            <div className="hidden md:flex items-center gap-3 md:gap-5">
              <a
                aria-label="Euro Patisserie on Instagram" href="https://www.instagram.com/europatisseriearmadale/?hl=en"
                target="_blank"
                rel="noreferrer"
                className={`hover:opacity-70 transition-opacity ${
                  isHomePage && !isScrolled ? "text-primary-foreground" : "text-primary"
                }`}
              >
                <Instagram className="w-5 h-5 md:w-6 md:h-6" />
              </a>
              <a
                aria-label="Euro Patisserie on TikTok" href="https://www.tiktok.com/@europatisseriearmadale"
                target="_blank"
                rel="noreferrer"
                className={`hover:opacity-70 transition-opacity ${
                  isHomePage && !isScrolled ? "text-primary-foreground" : "text-primary"
                }`}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.64-5.46-.22-2.39.87-4.78 2.87-6.09 1.63-1.08 3.67-1.35 5.51-.83v4.09c-.43-.1-.88-.13-1.32-.12-.76.02-1.5.38-2.04.93-.52.54-.83 1.25-.87 1.99-.05.8.21 1.59.73 2.19.51.6 1.25.96 2.03 1.01.76.05 1.53-.18 2.14-.61.6-.43 1.01-1.07 1.15-1.8.04-.2.06-.41.06-.61V0h4.08z" />
                </svg>
              </a>
              <button
                aria-label="Search"
                className={`hover:opacity-70 transition-opacity ${
                  isHomePage && !isScrolled ? "text-primary-foreground" : "text-primary"
                }`}
              >
                <Search className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
            <ThemeToggle
              className={`hover:opacity-70 transition-opacity ${
                isHomePage && !isScrolled ? "text-primary-foreground" : "text-primary"
              }`}
            />
            <button
              onClick={openDrawer}
              aria-label="Open cart"
              className={`relative hover:opacity-70 transition-opacity ${
                isHomePage && !isScrolled ? "text-primary-foreground" : "text-primary"
              }`}
            >
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.4 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 600, damping: 14 }}
                  className="absolute -right-2 -top-2 inline-flex h-4 min-w-4 items-center justify-center bg-primary px-1 text-[10px] font-bold text-primary-foreground tabular-nums"
                >
                  {count}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
