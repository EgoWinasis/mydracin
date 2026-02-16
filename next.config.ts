import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.dramaboxdb.com",
      },
    ],
  },
};

export default nextConfig;
