"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { FloatingWidgets } from "./floating-widgets";
import { MobileOrderBar } from "./mobile-order-bar";
import { LoadingScreen } from "./LoadingScreen";

/**
 * Client frame around every page: fixed navbar (transparent over the hero on the
 * home page), main content with the right top padding, scroll-to-top, and footer.
 */
export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <>
      <LoadingScreen />
      <Navbar />
      {/* Home: the header floats over the hero, so only clear the announcement line.
          Other pages: clear the announcement line + the solid header bar. */}
      <main className={`flex-1 ${isHomePage ? "pt-9" : "pt-[96px] md:pt-[104px]"}`}>
        {children}
      </main>
      <FloatingWidgets />
      <MobileOrderBar />
      <Footer />
    </>
  );
}
