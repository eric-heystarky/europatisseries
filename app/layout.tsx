import type { Metadata } from "next";
import { Karla, Fraunces, Parisienne } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";

// Stand-ins for the site's custom faces (Faro / Shorelines) until the real
// woff2 files are supplied: Karla ≈ Faro (body), Parisienne ≈ Shorelines (script).
const faro = Karla({ variable: "--font-faro", subsets: ["latin"], weight: ["400", "700", "800"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });
const shorelines = Parisienne({ variable: "--font-shorelines", subsets: ["latin"], weight: "400" });

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
      className={`${faro.variable} ${fraunces.variable} ${shorelines.variable} h-full antialiased`}
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
