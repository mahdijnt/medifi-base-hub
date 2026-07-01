import { contractAnalyticsResponse } from "@/lib/api/handlers/contract-analytics";

/**
 * Contract deployment analytics proxy (Etherscan API V2, server-side only).
 *
 * GET /api/basescan/contracts?address=0x...
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address") ?? "";
  return contractAnalyticsResponse(address);
}
