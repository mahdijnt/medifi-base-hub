import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Dual deployment:
 * - Vercel (VERCEL=1): server mode — `/api/contracts/*` route handlers + BASESCAN_API_KEY
 * - GitHub Pages: static export — API routes disabled via scripts/toggle-api-routes.mjs in CI
 */
const nextConfig: NextConfig = {
  basePath,
  assetPrefix: basePath ? `${basePath}/` : "",
  output: process.env.VERCEL ? undefined : "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
