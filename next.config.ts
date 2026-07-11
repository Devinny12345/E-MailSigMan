import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => [
    {
      source: "/sig-image/:id.jpg",
      destination: "/sig-image/:id",
    },
  ],
};

export default nextConfig;
