const { withBlitz } = require("@blitzjs/next")

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    typedRoutes: true,
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
  env: {
    TINYMC_KEY: process.env.BLITZ_PUBLIC_TINYMC_API_KEY,
    CLOUDINARY_CLOUD_NAME: process.env.BLITZ_PUBLIC_TCLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.BLITZ_PUBLIC_TCLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.BLITZ_PUBLIC_TCLOUDINARY_API_SECRET,
    STRIPE_PUBLISHABLE_KEY: process.env.BLITZ_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.BLITZ_PUBLIC_STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.BLITZ_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    DATABASE_URL: process.env.BLITZ_PUBLIC_DATABASE_URL,
    SHADOW_DATABASE_URL: process.env.BLITZ_PUBLIC_SHADOW_DATABASE_URL,
  },
}

module.exports = withBlitz(nextConfig)
