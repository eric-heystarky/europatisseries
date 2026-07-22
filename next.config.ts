import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Consolidated pages — keep old URLs alive for SEO & bookmarks.
      { source: "/our-craft", destination: "/about", permanent: true },
      { source: "/dog-friendly", destination: "/cafe", permanent: true },
      { source: "/faq", destination: "/contact", permanent: true },
    ];
  },
};

export default nextConfig;
