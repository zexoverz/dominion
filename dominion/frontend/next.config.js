/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'card.yuyu-tei.jp' },
      { protocol: 'https', hostname: 'cdn.yuyu-tei.jp' },
    ],
  },
};
module.exports = nextConfig;
