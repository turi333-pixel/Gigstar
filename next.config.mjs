/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 's1.ticketm.net' },
      { protocol: 'https', hostname: 's2.ticketm.net' },
      { protocol: 'https', hostname: 's3.ticketm.net' },
      { protocol: 'https', hostname: 's4.ticketm.net' },
    ],
  },
};

export default nextConfig;
