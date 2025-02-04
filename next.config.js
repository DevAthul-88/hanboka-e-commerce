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
    outputFileTracingRoot: undefined,
    outputFileTracingIncludes: {
      "/": ["node_modules/sharp/**/*"],
    },
  },
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        sharp: "commonjs sharp",
        "secure-password": "commonjs secure-password",
      })
    }
    return config
  },
  env: {
    TINYMC_KEY: process.env.BLITZ_PUBLIC_TINYMC_API_KEY,
    CLOUDINARY_CLOUD_NAME: process.env.BLITZ_PUBLIC_TCLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.BLITZ_PUBLIC_TCLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.BLITZ_PUBLIC_TCLOUDINARY_API_SECRET,
    STRIPE_PUBLISHABLE_KEY: process.env.BLITZ_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.BLITZ_PUBLIC_STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.BLITZ_PUBLIC_STRIPE_WEBHOOK_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    SHADOW_DATABASE_URL: process.env.SHADOW_DATABASE_URL,
  },
}

module.exports = withBlitz(nextConfig)
