import { nftAnalyticsResponse } from "@/lib/api/handlers/nft-analytics";

type RouteContext = {
  params: Promise<{ address: string }>;
};

/**
 * Legacy alias for NFT analytics.
 * Prefer GET /api/nft?address=0x...
 */
export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<Response> {
  const { address } = await context.params;
  return nftAnalyticsResponse(address);
}
