import { contractRegistryResponse } from "@/lib/api/handlers/contract-registry";

type RouteContext = {
  params: Promise<{ address: string }>;
};

/**
 * Enriched deployed-contract registry for the contracts page.
 * Server-only — dual-provider BaseScan + Blockscout Pro.
 */
export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<Response> {
  const { address } = await context.params;
  return contractRegistryResponse(address);
}
