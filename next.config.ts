import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A fully static export lets the same optimized build run on GitHub Pages.
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
