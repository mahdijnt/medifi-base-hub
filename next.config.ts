import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Static export only for production GitHub Pages builds (no VERCEL).
 * Dev and Vercel use server mode so `/api/*` route handlers work.
 */
const isStaticExport =
  !process.env.VERCEL && process.env.NODE_ENV === "production";

/**
 * Dual deployment:
 * - Vercel (VERCEL=1): server mode — `/api/basescan/contracts`, `/api/nft`, `/api/github/commits`
 * - GitHub Pages: static export — API routes disabled via scripts/toggle-api-routes.mjs in CI
 */
const nextConfig: NextConfig = {
  basePath,
  assetPrefix: basePath ? `${basePath}/` : "",
  output: isStaticExport ? "export" : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
