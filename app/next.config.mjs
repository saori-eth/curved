/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["pbs.twimg.com", "i.imgur.com"],
  },
};

export default nextConfig;
