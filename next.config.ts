import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['mongoose', 'cloudinary', 'bcryptjs'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
