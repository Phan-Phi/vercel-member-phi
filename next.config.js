// @ts-check

/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["member-api.t-solution.vn"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    modularizeImports: {
      lodash: {
        transform: "lodash/{{member}}",
      },
      "date-fns": {
        transform: "date-fns/{{member}}",
      },
    },
  },
};

module.exports = nextConfig;
