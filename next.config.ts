import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Reduces initial memory footprint by not preloading all entries
    preloadEntriesOnStart: false,
    // Optimizes package imports to reduce module count
    optimizePackageImports: ["lucide-react", "react-icons"],
  },
  // Disable source maps in dev if needed to save memory
  productionBrowserSourceMaps: false,
};

export default nextConfig;

