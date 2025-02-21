import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.module.rules.push({
      test: /\.ttf$/i,
      type: "asset/resource",
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bfcujebvtxcnkjyhrgjf.supabase.co",
        port: "",
        pathname: "/storage/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
