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
        process.env.FRONTEND_URL || "",
      ],
    }
  }
};

export default nextConfig;
