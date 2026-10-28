import type { Metadata } from "next";
import localFont from "next/font/local";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-context";
import { CartDrawer } from "@/components/cart-drawer";
import { OrderProvider } from "@/components/order-context";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { AppFrame } from "@/components/app-frame";
import { siteUrl, localBusinessJsonLd } from "@/lib/site";

// Redesign face: Jost (light, widely spaced caps for headings; regular for body).
const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

// Display serif for the order confirmation ("Merci, Name").
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

// The brand's previous faces, still referenced by pages not yet redesigned.
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
  metadataBase: new URL(siteUrl),
  // Preview deploys (NOINDEX=1) stay out of search results so they never compete with the live site.
  ...(process.env.NOINDEX === "1" ? { robots: { index: false, follow: false } } : {}),
  title: {
    default: "Euro Patisserie Armadale — European Pastries, Cakes & Catering",
    template: "%s | Euro Patisserie Armadale",
  },
  description:
    "Premium European pastries, cakes & catering, freshly made in Armadale. Order online for pickup or delivery.",
  keywords: [
    "Euro Patisserie",
    "Armadale bakery",
    "patisserie Melbourne",
    "cakes Armadale",
    "croissants Armadale",
    "catering Armadale",
    "order pastries online",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Euro Patisserie Armadale",
    locale: "en_AU",
    url: siteUrl,
    title: "Euro Patisserie Armadale — European Pastries, Cakes & Catering",
    description: "Freshly made European pastries, cakes & catering in Armadale. Order online for pickup or delivery.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Euro Patisserie Armadale",
    description: "European pastries, cakes & catering in Armadale. Order online.",
  },
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
      className={`${jost.variable} ${cormorant.variable} ${faro.variable} ${shorelines.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Local-business structured data (Bakery) for local SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
        />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <CartProvider>
            <OrderProvider>
              <TooltipProvider>
                <AppFrame>{children}</AppFrame>
                <CartDrawer />
                <Toaster />
                {/* Phones: sit above the sticky order bar */}
                <SonnerToaster mobileOffset={{ bottom: 88 }} />
              </TooltipProvider>
            </OrderProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
