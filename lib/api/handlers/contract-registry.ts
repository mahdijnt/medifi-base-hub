import "server-only";

import { NextResponse } from "next/server";
import { getDeployedContractsRegistry } from "@/lib/services/contracts";
import { ETH_ADDRESS_REGEX } from "@/lib/runtimeWalletRegistry";

const UNAVAILABLE_MESSAGE = "Contract analytics unavailable";

/**
 * Shared deployed-contract registry response for `/api/contracts/[address]/registry`.
 */
export async function contractRegistryResponse(
  address: string,
): Promise<NextResponse> {
  try {
    const normalizedAddress = address.trim();

    if (!normalizedAddress || !ETH_ADDRESS_REGEX.test(normalizedAddress)) {
      return NextResponse.json({
        success: false,
        error: "Invalid wallet address format.",
        data: [],
      });
    }

    const result = await getDeployedContractsRegistry(normalizedAddress);

    if ("error" in result) {
      console.error("[contracts] registry error:", result.error);
      return NextResponse.json({
        success: false,
        error: UNAVAILABLE_MESSAGE,
        data: [],
      });
    }

    return NextResponse.json({
      success: true,
      data: result.data.map((contract) => ({
        contractName: contract.contractName,
        contractAddress: contract.contractAddress,
        description: contract.description,
        deploymentDate: contract.deploymentDate.toISOString(),
        basescanUrl: contract.basescanUrl,
      })),
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown contract registry error";
    console.error("[contracts] registry error:", message);
    return NextResponse.json({
      success: false,
      error: UNAVAILABLE_MESSAGE,
      data: [],
    });
  }
}
