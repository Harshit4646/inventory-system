/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // REQUIRED so API routes are not prerendered at build time
  output: "standalone",

  experimental: {
    appDir: true
  }
};

module.exports = nextConfig;
