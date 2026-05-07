import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  experimental: {
    // Reduces initial memory footprint by not preloading all entries
    preloadEntriesOnStart: false,
    // Optimizes package imports to reduce module count
    optimizePackageImports: ["lucide-react", "react-icons"],
  },
  // Disable source maps in dev if needed to save memory
  productionBrowserSourceMaps: false,
  // Silence Turbopack vs Webpack config error from next-pwa
  turbopack: {},
};

export default withPWA(nextConfig);
