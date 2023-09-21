/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ["pbs.twimg.com", "i.imgur.com"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
