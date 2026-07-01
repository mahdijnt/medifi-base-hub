import "server-only";

import { NextResponse } from "next/server";
import { getNftAnalytics } from "@/lib/services/nft";
import { ETH_ADDRESS_REGEX } from "@/lib/runtimeWalletRegistry";

const EMPTY_NFT_DATA = {
  total: 0,
  collections: [] as const,
  items: [] as const,
};

const UNAVAILABLE_MESSAGE = "NFT analytics unavailable";

/**
 * Shared NFT analytics response for `/api/nft` and the legacy
 * `/api/nft/[address]` alias.
 */
export async function nftAnalyticsResponse(
  address: string,
): Promise<NextResponse> {
  try {
    const normalizedAddress = address.trim();

    if (!normalizedAddress || !ETH_ADDRESS_REGEX.test(normalizedAddress)) {
      return NextResponse.json({
        success: false,
        error: "Invalid wallet address format.",
        data: EMPTY_NFT_DATA,
      });
    }

    const result = await getNftAnalytics(normalizedAddress);

    if ("error" in result) {
      console.error("[nft] error:", result.error);
      return NextResponse.json({
        success: false,
        error: UNAVAILABLE_MESSAGE,
        data: EMPTY_NFT_DATA,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        total: result.data.total,
        collections: result.data.collections,
        items: result.data.items ?? [],
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown NFT analytics error";
    console.error("[nft] error:", message);
    return NextResponse.json({
      success: false,
      error: UNAVAILABLE_MESSAGE,
      data: EMPTY_NFT_DATA,
    });
  }
}
