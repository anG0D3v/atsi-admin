/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    AUTH_SECRET: process.env.NEXT_PUBLIC_AUTH_SECRET,
  },
};

module.exports = nextConfig;
