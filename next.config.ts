import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dnii6hfj3d61y.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
