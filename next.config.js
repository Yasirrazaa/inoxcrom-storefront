const checkEnvVariables = require("./check-env-variables");

checkEnvVariables();

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NODE_ENV === "production" ? "https://inoxcrom-backend-production-7f9c.up.railway.app" : "https://inoxcrom-backend-staging-7f9c.up.railway.app",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "inoxcrom.es",
      },
      {
        // MinIO service pattern
        protocol: "https",
        hostname: process.env.MINIO_ENDPOINT?.replace(/^https?:\/\//, '') || '',
      },
    ],
  },

  // ✅ Ensure Next.js picks up the correct Medusa backend URL
  env: {
    NEXT_PUBLIC_MEDUSA_BACKEND_URL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
  },
};

module.exports = nextConfig;
