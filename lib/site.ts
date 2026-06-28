/** Canonical site origin — used for metadata, sitemap, robots, and JSON-LD. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const BUSINESS = {
  name: "Euro Patisserie Armadale",
  phone: "+61 3 9822 1234",
  email: "hello@europatisserie.com",
  streetAddress: "974 High St",
  locality: "Armadale",
  region: "VIC",
  postalCode: "3143",
  country: "AU",
  lat: -37.8558,
  lon: 145.0192,
  instagram: "https://www.instagram.com/europatisseriearmadale/",
  tiktok: "https://www.tiktok.com/@europatisseriearmadale",
};

/** Bakery / LocalBusiness structured data for local SEO (Maps, knowledge panel). */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Bakery",
    "@id": `${siteUrl}/#bakery`,
    name: BUSINESS.name,
    url: siteUrl,
    image: `${siteUrl}/opengraph-image`,
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    priceRange: "$$",
    servesCuisine: "French, European pastries",
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.streetAddress,
      addressLocality: BUSINESS.locality,
      addressRegion: BUSINESS.region,
      postalCode: BUSINESS.postalCode,
      addressCountry: BUSINESS.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.lat,
      longitude: BUSINESS.lon,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "07:00",
        closes: "15:00",
      },
    ],
    sameAs: [BUSINESS.instagram, BUSINESS.tiktok],
  };
}
