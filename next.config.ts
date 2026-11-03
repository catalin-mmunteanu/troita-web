import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Partial Prefetching stays off: with it, an unknown year or month is served
  // as a 200 app shell before notFound() runs, which Search Console reports as
  // a soft 404. Every real page here is prerendered anyway.
  cacheLife: {
    // Pages that show "today": rebuilt in the background every 15 minutes,
    // so the day turns over shortly after midnight in Romania.
    today: { stale: 300, revalidate: 900, expire: 86400 },
  },
  images: { formats: ["image/avif", "image/webp"] },
  async redirects() {
    return [
      // Common misspellings and the plain-word path people may type.
      { source: "/calendar", destination: "/calendar-ortodox", permanent: true },
      { source: "/sfantul-zilei", destination: "/azi", permanent: true },
      { source: "/confidentialitate.html", destination: "/confidentialitate", permanent: true },
      { source: "/privacy", destination: "/confidentialitate", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
