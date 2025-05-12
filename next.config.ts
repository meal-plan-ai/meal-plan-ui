import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['www.meal-plan.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.meal-plan.app',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
