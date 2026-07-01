import "server-only";

import { alchemyNftRequest } from "@/lib/api/alchemy";

export const NFT_PAGE_SIZE = "100";

export type NftImage = {
  cachedUrl?: string;
  originalUrl?: string;
  thumbnailUrl?: string;
};

export type NftContract = {
  address?: string;
  name?: string;
  openSeaMetadata?: {
    floorPrice?: number;
    totalVolume?: number;
  };
};

export type NftSpamInfo = {
  isSpam?: boolean;
  classifications?: string[];
};

export type AlchemyOwnedNft = {
  contract?: NftContract;
  collection?: { name?: string };
  contractMetadata?: { name?: string };
  spamInfo?: NftSpamInfo;
  name?: string;
  title?: string;
  tokenId?: string;
  tokenUri?: string;
  image?: NftImage;
  media?: Array<{ gateway?: string; raw?: string }>;
};

export type GetNftsForOwnerResponse = {
  ownedNfts?: AlchemyOwnedNft[];
  pageKey?: string;
};

export type GetNftsForOwnerOptions = {
  owner: string;
  pageKey?: string;
  excludeSpam?: boolean;
};

/**
 * Fetches a single page of NFTs owned by an address via Alchemy NFT API v3.
 */
export async function getNftsForOwnerPage(
  options: GetNftsForOwnerOptions,
): Promise<GetNftsForOwnerResponse> {
  const params: Record<string, string> = {
    owner: options.owner,
    withMetadata: "true",
    pageSize: NFT_PAGE_SIZE,
    // Alchemy v3 expects the array-style param name: excludeFilters[]=SPAM
    ...(options.excludeSpam !== false ? { "excludeFilters[]": "SPAM" } : {}),
    ...(options.pageKey ? { pageKey: options.pageKey } : {}),
  };

  return alchemyNftRequest<GetNftsForOwnerResponse>("getNFTsForOwner", params);
}

/** True for HTTP 4xx failures raised by alchemyNftRequest. */
function isClientRequestError(error: unknown): boolean {
  return (
    error instanceof Error && /\(4\d\d\s/.test(error.message)
  );
}

async function fetchAllNftPages(
  owner: string,
  excludeSpam: boolean,
): Promise<AlchemyOwnedNft[]> {
  const nfts: AlchemyOwnedNft[] = [];
  let pageKey: string | undefined;

  do {
    const page = await getNftsForOwnerPage({ owner, pageKey, excludeSpam });
    nfts.push(...(page.ownedNfts ?? []));
    pageKey = page.pageKey;
  } while (pageKey);

  return nfts;
}

/**
 * Fetches all pages of NFTs owned by an address. The SPAM exclude filter is
 * paid-tier only; if Alchemy rejects it (4xx), retry without it and rely on
 * the local spam heuristics in lib/services/nft.ts.
 */
export async function getAllNftsForOwner(owner: string): Promise<AlchemyOwnedNft[]> {
  try {
    return await fetchAllNftPages(owner, true);
  } catch (error) {
    if (!isClientRequestError(error)) {
      throw error;
    }

    console.warn(
      "[nft] excludeFilters[]=SPAM rejected by Alchemy, retrying without it",
    );
    return fetchAllNftPages(owner, false);
  }
}
