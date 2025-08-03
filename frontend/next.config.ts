import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  reactStrictMode: false,
};

export default withNextIntl(nextConfig);
