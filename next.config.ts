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
      // The ways people ask about weddings and baptisms, positive and negative,
      // all land on the one page that answers both.
      ...["cand-se-fac-nunti", "cand-nu-se-fac-nunti", "nunta", "zile-nunti"].flatMap((p) => [
        { source: `/${p}`, destination: "/nunti", permanent: true },
        { source: `/${p}-:an(\\d{4})`, destination: "/nunti/:an", permanent: true },
      ]),
      ...["cand-se-face-botez", "cand-nu-se-face-botez", "cand-se-fac-botezuri", "cand-nu-se-fac-botezuri", "botezuri"].flatMap((p) => [
        { source: `/${p}`, destination: "/botez", permanent: true },
        { source: `/${p}-:an(\\d{4})`, destination: "/botez/:an", permanent: true },
      ]),
      { source: "/onomastica", destination: "/zile-de-nume", permanent: true },
      ...["evanghelia-de-azi", "evanghelia", "apostolul-zilei", "evanghelia-duminicii"].map((p) => ({
        source: `/${p}`, destination: "/evanghelia-zilei", permanent: true,
      })),
      { source: "/zile-onomastice", destination: "/zile-de-nume", permanent: true },
      { source: "/ziua-numelui/:nume", destination: "/zile-de-nume/:nume", permanent: true },
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
