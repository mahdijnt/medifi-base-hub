import { alchemyNftRequest } from "@/lib/api/alchemy";
import { hasAlchemyApiKey } from "@/lib/env";
import type { NftAnalytics, NftAnalyticsResult } from "@/lib/types/analytics";

const PAGE_SIZE = "100";

type NftContract = {
  address?: string;
  name?: string;
};

type OwnedNft = {
  contract?: NftContract;
  collection?: { name?: string };
  contractMetadata?: { name?: string };
};

type GetNftsForOwnerResponse = {
  ownedNfts?: OwnedNft[];
  pageKey?: string;
};

function shortenAddress(address: string): string {
  if (address.length < 10) {
    return address;
  }

  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function getCollectionName(nft: OwnedNft): string {
  const name =
    nft.contract?.name?.trim() ||
    nft.collection?.name?.trim() ||
    nft.contractMetadata?.name?.trim();

  if (name) {
    return name;
  }

  const address = nft.contract?.address?.trim();
  if (address) {
    return shortenAddress(address);
  }

  return "Unknown Collection";
}

async function fetchAllOwnedNfts(owner: string): Promise<OwnedNft[]> {
  const nfts: OwnedNft[] = [];
  let pageKey: string | undefined;

  do {
    const params: Record<string, string> = {
      owner,
      withMetadata: "true",
      pageSize: PAGE_SIZE,
      ...(pageKey ? { pageKey } : {}),
    };

    const page = await alchemyNftRequest<GetNftsForOwnerResponse>(
      "getNFTsForOwner",
      params,
    );

    nfts.push(...(page.ownedNfts ?? []));
    pageKey = page.pageKey;
  } while (pageKey);

  return nfts;
}

function computeNftAnalytics(nfts: OwnedNft[]): NftAnalytics {
  const collectionNames = new Set<string>();

  for (const nft of nfts) {
    collectionNames.add(getCollectionName(nft));
  }

  return {
    total: nfts.length,
    collections: [...collectionNames].sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" }),
    ),
  };
}

/**
 * Fetches all NFTs owned by a wallet and derives collection analytics.
 */
export async function getNftAnalytics(
  address: string,
): Promise<NftAnalyticsResult> {
  const normalizedAddress = address.trim();

  if (!normalizedAddress) {
    return { error: "Wallet address is required." };
  }

  if (!hasAlchemyApiKey()) {
    return {
      error:
        "Missing NEXT_PUBLIC_ALCHEMY_API_KEY. Add it to .env.local to load NFT analytics.",
    };
  }

  try {
    const ownedNfts = await fetchAllOwnedNfts(normalizedAddress);
    return { data: computeNftAnalytics(ownedNfts) };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch NFT analytics.";

    return { error: message };
  }
}
