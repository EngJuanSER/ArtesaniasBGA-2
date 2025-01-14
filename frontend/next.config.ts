import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    serverActions: {
      allowedOrigins: [
        process.env.NEXT_PUBLIC_BACKEND_URL || "",
        "localhost:3000",
        "https://potential-waffle-jj4qpxxjjgpgh5r5q-3000.app.github.dev"
      ],
    }
  }
};

export default nextConfig;
