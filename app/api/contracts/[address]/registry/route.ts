import { NextResponse } from "next/server";
import { getDeployedContracts } from "@/lib/api/basescan";

type RouteContext = {
  params: Promise<{ address: string }>;
};

/**
 * Enriched deployed-contract registry for the contracts page.
 * Server-only — uses BASESCAN_API_KEY via Etherscan API V2.
 */
export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const { address } = await context.params;
  const result = await getDeployedContracts(address);

  if ("error" in result) {
    const status = result.error.includes("API key") ? 503 : 502;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({
    data: result.data.map((contract) => ({
      contractName: contract.contractName,
      contractAddress: contract.contractAddress,
      description: contract.description,
      deploymentDate: contract.deploymentDate.toISOString(),
      basescanUrl: contract.basescanUrl,
    })),
  });
}
