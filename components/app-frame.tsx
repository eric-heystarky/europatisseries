"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { ScrollToTopButton } from "./ScrollToTopButton";
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
      <main className={`flex-1 ${isHomePage ? "pt-[32px] md:pt-[40px]" : "pt-[102px] md:pt-[120px]"}`}>
        {children}
      </main>
      <ScrollToTopButton />
      <Footer />
    </>
  );
}
