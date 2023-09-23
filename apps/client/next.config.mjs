/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ["pub-d165b348e0754b599a9a2ce9b759e149.r2.dev"],
  },
};

export default nextConfig;
