/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    // domains: ['pub-5b8c8880a977485aa114f08d809019fb.r2.dev'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    BASE_IMAGE_URL: process.env.NEXT_PUBLIC_STORAGE_ACCESS_ENDPOINT,
  },
};

module.exports = nextConfig;
