import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ScrollToTopButton } from "./ScrollToTopButton";

import { useLocation } from "react-router-dom";

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <div className="min-h-screen bg-background font-sans flex flex-col selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <main className={`flex-1 ${isHomePage ? 'pt-[32px] md:pt-[40px]' : 'pt-[102px] md:pt-[120px]'}`}>
        {children}
      </main>
      <ScrollToTopButton />
      <Footer />
    </div>
  );
}
