"use client";

import Link from "next/link";
import { Bike, Store, MapPin, Lock, Instagram } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const LOGO =
  "https://vibe.filesafe.space/1782359074813107391/attachments/7e2aeccd-b174-447b-90d6-578c90242df0.png";

export function Footer() {
  return (
    <footer className="border-t-2 border-primary bg-background text-primary">
      {/* Features Section — 2x2 on mobile, single row on large screens */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border-b-2 border-primary">
        <div className="flex flex-col items-center text-center p-6 md:p-12 border-r-2 border-b-2 lg:border-b-0 border-primary">
          <Bike className="w-7 h-7 md:w-8 md:h-8 mb-4 md:mb-6" strokeWidth={1} />
          <h4 className="font-bold tracking-widest uppercase mb-2 md:mb-4 text-xs md:text-sm">DELIVERY (D+1)</h4>
          <p className="text-xs md:text-sm font-medium opacity-80">By courier</p>
        </div>
        <div className="flex flex-col items-center text-center p-6 md:p-12 border-b-2 lg:border-b-0 lg:border-r-2 border-primary">
          <Store className="w-7 h-7 md:w-8 md:h-8 mb-4 md:mb-6" strokeWidth={1} />
          <h4 className="font-bold tracking-widest uppercase mb-2 md:mb-4 text-xs md:text-sm">IN-STORE PURCHASE</h4>
          <p className="text-xs md:text-sm font-medium opacity-80">Tues-Sun 7AM - 3PM</p>
        </div>
        <div className="flex flex-col items-center text-center p-6 md:p-12 border-r-2 border-primary">
          <MapPin className="w-7 h-7 md:w-8 md:h-8 mb-4 md:mb-6" strokeWidth={1} />
          <h4 className="font-bold tracking-widest uppercase mb-2 md:mb-4 text-xs md:text-sm">CLICK & COLLECT</h4>
          <p className="text-xs md:text-sm font-medium opacity-80">Order today before 8PM and collect tomorrow from 10AM</p>
        </div>
        <div className="flex flex-col items-center text-center p-6 md:p-12">
          <Lock className="w-7 h-7 md:w-8 md:h-8 mb-4 md:mb-6" strokeWidth={1} />
          <h4 className="font-bold tracking-widest uppercase mb-2 md:mb-4 text-xs md:text-sm">SECURE PAYMENT</h4>
          <p className="text-xs md:text-sm font-medium opacity-80">Protected payments ensuring a secure experience.</p>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Addresses */}
          <div>
            <h4 className="font-bold uppercase tracking-widest mb-8 text-sm">OUR LOCATIONS</h4>
            <div className="flex flex-col gap-4 text-sm font-medium opacity-80">
              <Link href="/contact" className="hover:opacity-100 transition-opacity">
                Armadale
              </Link>
              <a
                href="https://maps.google.com/?q=Euro+Patisserie+Armadale"
                target="_blank"
                rel="noreferrer"
                className="mt-2 text-xs font-bold underline underline-offset-4 hover:opacity-70 transition-opacity"
              >
                VIEW ON MAP
              </a>
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="font-bold uppercase tracking-widest mb-8 text-sm">ABOUT</h4>

            <div className="mb-8">
              <h5 className="font-bold uppercase tracking-widest mb-4 text-xs">JOIN US</h5>
              <p className="text-sm font-medium opacity-80 mb-2">Want to join our team? Apply on</p>
              <Link
                href="/join-team"
                className="text-sm font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
              >
                careers@europatisserie.com.au
              </Link>
            </div>

            <div>
              <h5 className="font-bold uppercase tracking-widest mb-4 text-xs">FOLLOW US</h5>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/europatisseriearmadale/?hl=en"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:opacity-70 transition-opacity"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://www.tiktok.com/@europatisseriearmadale"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:opacity-70 transition-opacity"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.64-5.46-.22-2.39.87-4.78 2.87-6.09 1.63-1.08 3.67-1.35 5.51-.83v4.09c-.43-.1-.88-.13-1.32-.12-.76.02-1.5.38-2.04.93-.52.54-.83 1.25-.87 1.99-.05.8.21 1.59.73 2.19.51.6 1.25.96 2.03 1.01.76.05 1.53-.18 2.14-.61.6-.43 1.01-1.07 1.15-1.8.04-.2.06-.41.06-.61V0h4.08z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold uppercase tracking-widest mb-8 text-sm">NEWSLETTER</h4>
            <p className="text-sm font-medium opacity-80 mb-6 leading-relaxed">
              Subscribe to the Euro Patisserie newsletter and receive immediately an exclusive -10% promo code*
            </p>

            <form className="flex gap-4 mb-6" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="E-mail"
                className="rounded-none border-2 border-primary bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-primary/50"
              />
              <Button
                type="submit"
                className="rounded-none border-2 border-primary bg-primary text-primary-foreground hover:bg-transparent hover:text-primary px-8 font-bold tracking-widest uppercase text-xs"
              >
                SUBSCRIBE
              </Button>
            </form>

            <p className="text-xs font-bold mb-2">*from $59 of purchase excluding delivery</p>
            <p className="text-xs font-medium opacity-60 leading-relaxed">
              By clicking on subscribe, I wish to subscribe to the newsletter and receive by email the latest
              creations, promotions and news of Euro Patisserie and I accept the Privacy Policy and acknowledge I can
              unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center pb-16 gap-6">
        <img src={LOGO} alt="Euro Patisserie" className="h-16 object-contain opacity-50" />
        <p className="text-xs font-medium opacity-60 uppercase tracking-widest">
          Powered by{" "}
          <a
            href="https://heystarky.com.au"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:opacity-100 transition-opacity"
          >
            HeyStarky AU
          </a>
        </p>
      </div>
    </footer>
  );
}
