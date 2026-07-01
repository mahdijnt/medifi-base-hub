import { NextResponse } from "next/server";
import { getContractDeploymentAnalytics } from "@/lib/services/contracts";

type RouteContext = {
  params: Promise<{ address: string }>;
};

/**
 * Contract deployment analytics proxy (Etherscan API V2, server-side only).
 *
 * On Vercel / `next start`, this route runs with BASESCAN_API_KEY.
 * Static export (GitHub Pages) cannot host API routes — the api folder is
 * temporarily disabled in CI before `output: 'export'` builds.
 */
export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const { address } = await context.params;
  const result = await getContractDeploymentAnalytics(address);

  if ("error" in result) {
    const status = result.error.includes("API key") ? 503 : 502;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({
    data: {
      total: result.data.total,
      contracts: result.data.contracts.map((contract) => ({
        address: contract.address,
        deployedAt: contract.deployedAt.toISOString(),
        transactionHash: contract.transactionHash ?? "",
      })),
    },
  });
}
