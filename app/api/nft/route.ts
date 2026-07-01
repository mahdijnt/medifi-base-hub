import { nftAnalyticsResponse } from "@/lib/api/handlers/nft-analytics";

/**
 * NFT analytics proxy (Alchemy NFT API v3, server-side only).
 *
 * GET /api/nft?address=0x...
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address") ?? "";
  return nftAnalyticsResponse(address);
}
