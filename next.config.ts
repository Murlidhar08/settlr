import type { NextConfig } from "next";
import withPWA from '@ducanh2912/next-pwa';
import nextBundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = nextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withPWAConfig = withPWA({
  dest: 'public',                              // where to output SW file (in public/)
  disable: process.env.NODE_ENV === 'development', // disable in dev
  register: true,                              // auto-register SW
  // skipWaiting: true,                           // activate SW immediately
  // (you can add workboxOptions, runtimeCaching, fallbacks, etc. here)
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  compress: true, // Enable Gzip/Brotli compression
  typedRoutes: true,
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "date-fns",
      "framer-motion",
      "@base-ui/react",
    ],
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
    ],
  }
};

export default withBundleAnalyzer(withPWAConfig(nextConfig));
