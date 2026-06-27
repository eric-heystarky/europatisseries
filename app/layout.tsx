import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/components/cart-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";

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
      className={`${faro.variable} ${shorelines.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <CartProvider>
          <Navbar />
          <main className="flex-1 pt-[92px] md:pt-[100px]">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
