import { withBasePath } from "@/lib/base-path";
import type { NftAnalytics, NftAnalyticsResult } from "@/lib/types/analytics";

type SerializedNftCollection = {
  name: string;
  contractAddress?: string;
  count: number;
  marketplaceUrl?: string;
};

type SerializedNftItem = {
  contractAddress: string;
  tokenId: string;
  name: string;
  imageUrl?: string;
  collectionName: string;
  marketplaceUrl: string;
};

type NftAnalyticsApiPayload = {
  total: number;
  collections: SerializedNftCollection[];
  items?: SerializedNftItem[];
};

type NftAnalyticsApiResponse = {
  success?: boolean;
  error?: string;
  data?: NftAnalyticsApiPayload;
};

const STATIC_EXPORT_HINT =
  "NFT analytics requires a server deployment (e.g. Vercel). Static export / GitHub Pages cannot run API routes.";

async function readJsonResponse<T>(
  response: Response,
): Promise<T | { error: string }> {
  if (response.status === 404) {
    return { error: STATIC_EXPORT_HINT };
  }

  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) {
        detail = body.error;
      }
    } catch {
      // ignore parse errors
    }
    return { error: detail };
  }

  return (await response.json()) as T;
}

function parseNftAnalyticsResponse(
  body: NftAnalyticsApiResponse,
): NftAnalyticsResult {
  if (body.success === false || body.error) {
    return { error: body.error ?? "NFT analytics unavailable" };
  }

  if (!body.data) {
    return { error: "NFT analytics unavailable" };
  }

  return {
    data: {
      total: body.data.total,
      collections: body.data.collections,
      items: body.data.items ?? [],
    } satisfies NftAnalytics,
  };
}

/**
 * Client-side fetch for NFT analytics via `/api/nft?address=0x...`.
 * Never calls Alchemy directly — API key stays server-side.
 */
export async function fetchNftAnalytics(
  address: string,
): Promise<NftAnalyticsResult> {
  const normalizedAddress = address.trim();

  if (!normalizedAddress) {
    return { error: "Wallet address is required." };
  }

  try {
    const response = await fetch(
      withBasePath(
        `/api/nft?address=${encodeURIComponent(normalizedAddress)}`,
      ),
      { cache: "no-store" },
    );

    const body = await readJsonResponse<NftAnalyticsApiResponse>(response);
    if ("error" in body && !("data" in body)) {
      return { error: body.error ?? "NFT analytics unavailable" };
    }

    return parseNftAnalyticsResponse(body as NftAnalyticsApiResponse);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch NFT analytics.";

    return { error: message };
  }
}

/** @deprecated Use fetchNftAnalytics — kept for gradual migration. */
export const getNftAnalytics = fetchNftAnalytics;
