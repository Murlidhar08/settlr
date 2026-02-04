import type { NextConfig } from "next";
import withPWA from '@ducanh2912/next-pwa';

const withPWAConfig = withPWA({
  dest: 'public',                              // where to output SW file (in public/)
  disable: process.env.NODE_ENV === 'development', // disable in dev
  register: true,                              // auto-register SW
  // skipWaiting: true,                           // activate SW immediately
  // (you can add workboxOptions, runtimeCaching, fallbacks, etc. here)
});

const nextConfig: NextConfig = {
  // output: process.platform === "win32" ? undefined : "standalone",
  reactStrictMode: true,
  output: "standalone",
  typedRoutes: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    // ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      // Google
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },

      // Discord
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
    ],
  }
};

export default withPWAConfig(nextConfig);
