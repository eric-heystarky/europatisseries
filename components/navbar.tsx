"use client";

import Link from "next/link";
import { useCart } from "./cart-context";

const MARQUEE = "★ ORDER NOW ONLINE ★ OPEN TUES–SUN 7AM–3PM ";

const NAV_LINKS = [
  { name: "Pastries", href: "/#pastries-and-cakes" },
  { name: "Catering", href: "/#catering-packs" },
  { name: "Contact", href: "/#contact" },
];

export function Navbar() {
  const { count, openDrawer } = useCart();

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Scrolling marquee strip */}
      <div className="overflow-hidden border-b-2 border-border bg-primary text-primary-foreground">
        <div className="flex w-max animate-marquee whitespace-nowrap py-1.5 text-xs font-bold tracking-[0.2em]">
          <span>{MARQUEE.repeat(8)}</span>
          <span aria-hidden>{MARQUEE.repeat(8)}</span>
        </div>
      </div>

      {/* Main bar */}
      <nav className="flex items-center justify-between border-b-2 border-border bg-background px-4 py-3 md:px-8">
        <div className="hidden flex-1 items-center gap-6 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.name}
              href={l.href}
              className="text-xs font-bold uppercase tracking-[0.18em] hover:underline"
            >
              {l.name}
            </Link>
          ))}
        </div>

        <Link href="/" className="flex flex-1 flex-col items-center leading-none">
          <span className="text-lg font-extrabold uppercase tracking-[0.25em] md:text-xl">
            Euro Patisserie
          </span>
          <span className="mt-0.5 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
            Armadale
          </span>
        </Link>

        <div className="flex flex-1 items-center justify-end">
          <button
            onClick={openDrawer}
            className="relative flex items-center gap-2 border-2 border-border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] transition hover:bg-primary hover:text-primary-foreground"
            aria-label="Open cart"
          >
            <BagIcon />
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center bg-primary px-1 text-[11px] text-primary-foreground tabular-nums">
                {count}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}

function BagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
