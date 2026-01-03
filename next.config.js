/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // required if using /app folder structure
  },
};

module.exports = nextConfig;
