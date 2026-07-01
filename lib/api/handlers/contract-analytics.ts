import "server-only";

import { NextResponse } from "next/server";
import { getContractDeploymentAnalytics } from "@/lib/services/contracts";
import { ETH_ADDRESS_REGEX } from "@/lib/runtimeWalletRegistry";

const EMPTY_CONTRACT_DATA = {
  total: 0,
  contracts: [] as const,
};

const UNAVAILABLE_MESSAGE = "Contract analytics unavailable";

/**
 * Shared contract deployment analytics response for `/api/basescan/contracts`
 * and the legacy `/api/contracts/[address]` alias.
 */
export async function contractAnalyticsResponse(
  address: string,
): Promise<NextResponse> {
  try {
    const normalizedAddress = address.trim();

    if (!normalizedAddress || !ETH_ADDRESS_REGEX.test(normalizedAddress)) {
      return NextResponse.json({
        success: false,
        error: "Invalid wallet address format.",
        data: EMPTY_CONTRACT_DATA,
      });
    }

    const result = await getContractDeploymentAnalytics(normalizedAddress);

    if ("error" in result) {
      console.warn("[contracts] error:", result.error);
      return NextResponse.json({
        success: false,
        error: UNAVAILABLE_MESSAGE,
        data: EMPTY_CONTRACT_DATA,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        total: result.data.total,
        contracts: result.data.contracts.map((contract) => ({
          address: contract.address,
          deployedAt: contract.deployedAt.toISOString(),
          transactionHash: contract.transactionHash ?? "",
        })),
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown contract analytics error";
    console.error("[contracts] error:", message);
    return NextResponse.json({
      success: false,
      error: UNAVAILABLE_MESSAGE,
      data: EMPTY_CONTRACT_DATA,
    });
  }
}
