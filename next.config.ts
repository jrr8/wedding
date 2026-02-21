import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.1.195", "localhost"],
  cacheComponents: true,
  images: {
    qualities: [50, 75]
  }
};

export default nextConfig;
