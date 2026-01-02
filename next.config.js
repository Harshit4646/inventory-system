/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Needed for Vercel serverless APIs
  experimental: {
    appDir: true
  }
};

module.exports = nextConfig;
