import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => [
    {
      source: "/signatures/:id.png",
      destination: "/signatures/:id",
    },
  ],
};

export default nextConfig;
