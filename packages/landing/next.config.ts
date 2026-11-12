import type { NextConfig } from 'next';

const NODE_ENV = process.env.NODE_ENV ?? 'development';

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
      },
    },
  },

  output: 'export',
  trailingSlash: true,
  // GitHub Pages project site lives under //fr55/
  basePath: NODE_ENV === 'production' ? '/fr55' : '',
  assetPrefix: NODE_ENV === 'production' ? '/fr55' : '',
  images: { unoptimized: true },
};

export default nextConfig;
