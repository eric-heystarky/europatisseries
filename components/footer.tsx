"use client";

import Link from "next/link";
import { Store, Truck, CakeSlice, Lock, Instagram } from "lucide-react";
import { BUSINESS } from "@/lib/site";

const LOGO = "/images/logo/euro-patisserie.svg";

const PROMISES = [
  { icon: Store, title: "Pickup", text: "Free from 974 High St, Armadale. Open 7 days, 7am – 3pm." },
  { icon: Truck, title: "Delivery", text: "$5 per km from our shop. Free on orders over $150." },
  { icon: CakeSlice, title: "Catering", text: "Ready-made platters from $100. Order 24 hours ahead." },
  { icon: Lock, title: "Secure payment", text: "Payments processed securely by Square." },
];

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className} aria-hidden="true">
      <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M14 3c.5 2.8 2.4 4.5 5 4.8" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-euro-cream text-euro-soft">
      {/* What to expect — 2×2 on mobile, one row on large screens */}
      <div className="grid grid-cols-2 border-y border-euro-line lg:grid-cols-4">
        {PROMISES.map(({ icon: Icon, title, text }, i) => (
          <div
            key={title}
            className={`flex flex-col items-center gap-3 px-4 py-8 text-center md:py-11 ${
              i % 2 === 0 ? "border-r border-euro-line" : ""
            } ${i < 2 ? "border-b border-euro-line lg:border-b-0" : ""} ${i === 1 ? "lg:border-r" : ""}`}
          >
            <Icon className="h-6 w-6 text-euro-ink" strokeWidth={1.2} aria-hidden="true" />
            <h2 className="euro-label text-[11px] text-euro-ink md:text-[12.5px]">{title}</h2>
            <p className="max-w-[240px] text-[12.5px] leading-relaxed md:text-[13.5px]">{text}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto flex max-w-[1200px] flex-wrap gap-x-16 gap-y-12 px-6 pb-10 pt-16 md:px-12 md:pt-20">
        <div className="flex min-w-[200px] flex-1 flex-col gap-3">
          <h2 className="euro-label text-euro-ink">Our location</h2>
          <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.1em] text-euro-ink">Armadale</p>
          <p className="text-sm leading-7">
            {BUSINESS.streetAddress}, {BUSINESS.locality} {BUSINESS.region} {BUSINESS.postalCode}
            <br />
            Open 7 days, 7am – 3pm
            <br />
            <a href={`tel:${BUSINESS.phone.replace(/\s/g, "")}`} className="hover:text-euro-ink">
              (03) 9822 1234
            </a>
            <br />
            <a href={`mailto:${BUSINESS.email}`} className="hover:text-euro-ink">
              {BUSINESS.email}
            </a>
          </p>
          <a
            href="https://maps.google.com/?q=Euro+Patisserie+Armadale"
            target="_blank"
            rel="noreferrer"
            className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-euro-ink underline underline-offset-4"
          >
            View on map
          </a>
        </div>

        <div className="flex min-w-[200px] flex-1 flex-col gap-3">
          <h2 className="euro-label text-euro-ink">About</h2>
          <nav aria-label="About" className="mt-2 flex flex-col gap-2.5 text-sm">
            <Link href="/about" className="hover:text-euro-ink">Our story</Link>
            <Link href="/cafe" className="hover:text-euro-ink">The café</Link>
            <Link href="/gift-cards" className="hover:text-euro-ink">Gift cards</Link>
            <Link href="/join-team" className="hover:text-euro-ink">Join the team</Link>
            <Link href="/pre-order#faq" className="hover:text-euro-ink">FAQ</Link>
            <Link href="/contact" className="hover:text-euro-ink">Contact</Link>
          </nav>
        </div>

        <div className="flex min-w-[280px] flex-[1.4] flex-col gap-3">
          <h2 className="euro-label text-euro-ink">Newsletter</h2>
          <p className="mt-2 text-sm leading-7">
            Subscribe to the Euro Patisserie newsletter and receive an exclusive 10% promo code.*
          </p>
          <form className="flex flex-wrap gap-3" onSubmit={(e) => e.preventDefault()}>
            <label className="flex min-w-[200px] flex-1">
              <span className="sr-only">Email address</span>
              <input
                type="email"
                placeholder="E-mail"
                className="h-[46px] w-full border border-euro-line bg-white px-4 text-base text-euro-text outline-none focus:border-euro-ink"
              />
            </label>
            <button type="submit" className="btn-euro">
              Subscribe
            </button>
          </form>
          <p className="text-xs leading-relaxed">
            *From $59 of purchase, excluding delivery. By subscribing you agree to receive emails from Euro
            Patisserie and accept our Privacy Policy. You can unsubscribe at any time.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-5 px-6 pt-4">
        <img src={LOGO} alt="Euro Patisserie" className="h-14 object-contain" />
        <div className="flex gap-5 text-euro-ink">
          <a aria-label="Instagram" href={BUSINESS.instagram} target="_blank" rel="noreferrer" className="hover:opacity-70">
            <Instagram className="h-5 w-5" strokeWidth={1.5} />
          </a>
          <a aria-label="TikTok" href={BUSINESS.tiktok} target="_blank" rel="noreferrer" className="hover:opacity-70">
            <TikTokIcon className="h-5 w-5" />
          </a>
        </div>
      </div>

      <nav
        aria-label="Legal"
        className="mx-auto mt-8 flex flex-wrap justify-center gap-x-10 gap-y-2 border-b border-euro-line px-6 pb-6 text-[13px]"
      >
        <Link href="/contact" className="hover:text-euro-ink">Contact us</Link>
        <Link href="/catering" className="hover:text-euro-ink">Catering</Link>
        <Link href="/gift-cards" className="hover:text-euro-ink">Gift cards</Link>
        <Link href="/pre-order#faq" className="hover:text-euro-ink">FAQ</Link>
      </nav>
      {/* Extra bottom room on mobile so the floating chat/back-to-top buttons don't cover it */}
      <p className="px-6 pb-28 pt-6 text-center text-[12.5px] md:pb-6">
        © {new Date().getFullYear()} Euro Patisserie Armadale · Powered by{" "}
        <a href="https://heystarky.com.au" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-euro-ink">
          HeyStarky
        </a>
      </p>
    </footer>
  );
}
