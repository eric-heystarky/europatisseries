import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/components/cart-context";
import { CartDrawer } from "@/components/cart-drawer";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { AppFrame } from "@/components/app-frame";

// The brand's own faces. Faro for body/headings, Shorelines for script display.
const faro = localFont({
  src: "./fonts/faro-display-lucky.woff2",
  variable: "--font-faro",
  display: "swap",
});
const shorelines = localFont({
  src: "./fonts/shorelines-script-bold.woff",
  variable: "--font-shorelines",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Euro Patisserie Armadale — Order Online",
  description: "Premium European pastries & catering, made in Armadale. Order pickup or delivery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${faro.variable} ${shorelines.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <CartProvider>
            <TooltipProvider>
              <AppFrame>{children}</AppFrame>
              <CartDrawer />
              <Toaster />
              <SonnerToaster />
            </TooltipProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
