import { contractAnalyticsResponse } from "@/lib/api/handlers/contract-analytics";

type RouteContext = {
  params: Promise<{ address: string }>;
};

/**
 * Legacy alias for contract deployment analytics.
 * Prefer GET /api/basescan/contracts?address=0x...
 */
export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<Response> {
  const { address } = await context.params;
  return contractAnalyticsResponse(address);
}
