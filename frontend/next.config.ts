import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ['image/avif','image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vkuserphoto.ru',
      },
      {
        protocol: 'https',
        hostname: '**.userapi.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.steamstatic.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh4.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh5.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh6.googleusercontent.com',
      },
    ],
  },
  reactStrictMode: false,
};

export default withNextIntl(nextConfig);
