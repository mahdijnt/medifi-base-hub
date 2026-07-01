import "server-only";

import {
  getAllNftsForOwner,
  type AlchemyOwnedNft,
} from "@/lib/api/nft";
import { hasAlchemyApiKey } from "@/lib/env";
import { ETH_ADDRESS_REGEX } from "@/lib/runtimeWalletRegistry";
import {
  SPAM_CONTRACT_BLACKLIST,
  SUSPICIOUS_NAME_PATTERN,
} from "@/data/nft-spam";
import type {
  NftAnalytics,
  NftAnalyticsResult,
  NftCollection,
  NftItem,
} from "@/lib/types/analytics";

const CACHE_TTL_MS = 5 * 60 * 1000;
const OPENSEA_ASSET_BASE_URL = "https://opensea.io/assets/base";
const OPENSEA_COLLECTION_BASE_URL = "https://opensea.io/assets/base";
const ZORA_ASSET_BASE_URL = "https://zora.co/collect/base";

type CacheEntry = {
  expiresAt: number;
  result: NftAnalyticsResult;
};

const analyticsCache = new Map<string, CacheEntry>();

type SpamReason =
  | "blacklisted_contract"
  | "suspicious_name"
  | "missing_metadata"
  | "invalid_token_uri"
  | "missing_image"
  | "alchemy_spam"
  | "low_volume_suspicious";

type SpamCheckResult = { spam: true; reason: SpamReason } | { spam: false };

function cacheKey(address: string): string {
  return address.trim().toLowerCase();
}

function getCached(address: string): NftAnalyticsResult | null {
  const entry = analyticsCache.get(cacheKey(address));
  if (!entry) {
    return null;
  }

  if (Date.now() > entry.expiresAt) {
    analyticsCache.delete(cacheKey(address));
    return null;
  }

  console.log(`[nft] cache hit for ${address}`);
  return entry.result;
}

function setCache(address: string, result: NftAnalyticsResult): void {
  analyticsCache.set(cacheKey(address), {
    expiresAt: Date.now() + CACHE_TTL_MS,
    result,
  });
}

function shortenAddress(address: string): string {
  if (address.length < 10) {
    return address;
  }

  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function getNftDisplayName(nft: AlchemyOwnedNft): string | undefined {
  return nft.name?.trim() || nft.title?.trim() || undefined;
}

function getCollectionName(
  nft: AlchemyOwnedNft,
  contractAddress?: string,
): string {
  const name =
    nft.contract?.name?.trim() ||
    nft.collection?.name?.trim() ||
    nft.contractMetadata?.name?.trim();

  if (name) {
    return name;
  }

  if (contractAddress) {
    return shortenAddress(contractAddress);
  }

  return "Unknown Collection";
}

function getImageUrl(nft: AlchemyOwnedNft): string | undefined {
  const fromImage =
    nft.image?.cachedUrl?.trim() ||
    nft.image?.originalUrl?.trim() ||
    nft.image?.thumbnailUrl?.trim();

  if (fromImage) {
    return fromImage;
  }

  const fromMedia = nft.media?.find(
    (entry) => entry.gateway?.trim() || entry.raw?.trim(),
  );

  return fromMedia?.gateway?.trim() || fromMedia?.raw?.trim() || undefined;
}

function isBlacklistedContract(contractAddress: string | undefined): boolean {
  if (!contractAddress) {
    return false;
  }

  const normalized = contractAddress.trim().toLowerCase();
  return SPAM_CONTRACT_BLACKLIST.some(
    (entry) => entry.trim().toLowerCase() === normalized,
  );
}

function hasSuspiciousName(nft: AlchemyOwnedNft): boolean {
  const candidates = [
    getNftDisplayName(nft),
    nft.contract?.name,
    nft.collection?.name,
    nft.contractMetadata?.name,
  ];

  return candidates.some((value) => {
    const text = value?.trim();
    return text ? SUSPICIOUS_NAME_PATTERN.test(text) : false;
  });
}

function hasBrokenMetadata(nft: AlchemyOwnedNft): boolean {
  const hasName = Boolean(getNftDisplayName(nft));
  const hasCollection = Boolean(
    nft.contract?.name?.trim() ||
      nft.collection?.name?.trim() ||
      nft.contractMetadata?.name?.trim(),
  );
  const hasImage = Boolean(getImageUrl(nft));

  return !hasName && !hasCollection && !hasImage;
}

function hasInvalidTokenUri(nft: AlchemyOwnedNft): boolean {
  const tokenUri = nft.tokenUri?.trim();
  if (!tokenUri) {
    return false;
  }

  try {
    const parsed = new URL(tokenUri);
    return parsed.protocol !== "http:" && parsed.protocol !== "https:";
  } catch {
    return true;
  }
}

function isAlchemySpam(nft: AlchemyOwnedNft): boolean {
  if (nft.spamInfo?.isSpam === true) {
    return true;
  }

  return (
    nft.spamInfo?.classifications?.some(
      (classification) => classification.toUpperCase() === "SPAM",
    ) ?? false
  );
}

function isLowVolumeSuspicious(nft: AlchemyOwnedNft): boolean {
  if (!hasSuspiciousName(nft)) {
    return false;
  }

  const floorPrice = nft.contract?.openSeaMetadata?.floorPrice;
  const totalVolume = nft.contract?.openSeaMetadata?.totalVolume;

  if (floorPrice === undefined && totalVolume === undefined) {
    return false;
  }

  return (floorPrice ?? 0) === 0 && (totalVolume ?? 0) === 0;
}

function checkSpamNFT(nft: AlchemyOwnedNft): SpamCheckResult {
  const contractAddress = nft.contract?.address?.trim() ?? "";

  if (isBlacklistedContract(contractAddress)) {
    return { spam: true, reason: "blacklisted_contract" };
  }

  if (isAlchemySpam(nft)) {
    return { spam: true, reason: "alchemy_spam" };
  }

  if (hasSuspiciousName(nft)) {
    return { spam: true, reason: "suspicious_name" };
  }

  if (hasBrokenMetadata(nft)) {
    return { spam: true, reason: "missing_metadata" };
  }

  if (hasInvalidTokenUri(nft)) {
    return { spam: true, reason: "invalid_token_uri" };
  }

  if (!getImageUrl(nft)) {
    return { spam: true, reason: "missing_image" };
  }

  if (isLowVolumeSuspicious(nft)) {
    return { spam: true, reason: "low_volume_suspicious" };
  }

  return { spam: false };
}

/** Returns true when an NFT should be excluded from analytics. */
export function isSpamNFT(nft: AlchemyOwnedNft | null | undefined): boolean {
  try {
    if (!nft || typeof nft !== "object") {
      return true;
    }

    const result = checkSpamNFT(nft);
    if (!result.spam) {
      return false;
    }

    const contract = nft.contract?.address?.trim() ?? "unknown";
    console.log(`[nft] filtered spam: ${contract} ${result.reason}`);
    return true;
  } catch {
    return true;
  }
}

export function buildOpenSeaAssetUrl(
  contractAddress: string,
  tokenId: string,
): string {
  return `${OPENSEA_ASSET_BASE_URL}/${contractAddress}/${tokenId}`;
}

export function buildZoraAssetUrl(
  contractAddress: string,
  tokenId: string,
): string {
  return `${ZORA_ASSET_BASE_URL}:${contractAddress}/${tokenId}`;
}

function buildMarketplaceUrl(
  contractAddress: string,
  tokenId: string,
): string {
  if (!contractAddress.trim() || !tokenId.trim()) {
    console.warn(
      `[nft] marketplace URL generation failed: missing contract (${contractAddress}) or tokenId (${tokenId})`,
    );
    return "";
  }

  try {
    return buildOpenSeaAssetUrl(contractAddress.trim(), tokenId.trim());
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "unknown error";
    console.warn(
      `[nft] marketplace URL generation failed for ${contractAddress}/${tokenId}: ${message}`,
    );
    return "";
  }
}

function buildOpenSeaCollectionUrl(contractAddress: string): string {
  return `${OPENSEA_COLLECTION_BASE_URL}/${contractAddress}`;
}

function toNftItem(nft: AlchemyOwnedNft): NftItem {
  const contractAddress = nft.contract?.address?.trim() ?? "";
  const tokenId = nft.tokenId?.trim() ?? "";
  const name = getNftDisplayName(nft) ?? (tokenId ? `Token #${tokenId}` : "Unnamed NFT");
  const imageUrl = getImageUrl(nft);
  const collectionName = getCollectionName(nft, contractAddress);
  const marketplaceUrl = buildMarketplaceUrl(contractAddress, tokenId);

  return {
    contractAddress,
    tokenId,
    name,
    ...(imageUrl ? { imageUrl } : {}),
    collectionName,
    marketplaceUrl,
  };
}

function computeNftAnalytics(nfts: AlchemyOwnedNft[]): NftAnalytics {
  const collectionMap = new Map<string, NftCollection>();
  const items: NftItem[] = [];

  for (const nft of nfts) {
    const contractAddress = nft.contract?.address?.trim().toLowerCase();
    const key = contractAddress || getCollectionName(nft);

    const existing = collectionMap.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      collectionMap.set(key, {
        name: getCollectionName(nft, contractAddress),
        ...(contractAddress
          ? {
              contractAddress,
              marketplaceUrl: buildOpenSeaCollectionUrl(contractAddress),
            }
          : {}),
        count: 1,
      });
    }

    items.push(toNftItem(nft));
  }

  const collections = [...collectionMap.values()].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );

  items.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

  return {
    total: nfts.length,
    collections,
    items,
  };
}

async function fetchFilteredOwnedNfts(owner: string): Promise<AlchemyOwnedNft[]> {
  const ownedNfts = await getAllNftsForOwner(owner);
  return ownedNfts.filter((nft) => {
    try {
      return nft != null && !isSpamNFT(nft);
    } catch {
      return false;
    }
  });
}

/**
 * Server-only: fetches NFT analytics via Alchemy NFT API v3 with spam filtering.
 * Results are cached in memory for 5 minutes per address.
 */
export async function getNftAnalytics(
  address: string,
): Promise<NftAnalyticsResult> {
  const normalizedAddress = address.trim();

  if (!normalizedAddress) {
    return { error: "Wallet address is required." };
  }

  if (!ETH_ADDRESS_REGEX.test(normalizedAddress)) {
    return { error: "Invalid wallet address format." };
  }

  const cached = getCached(normalizedAddress);
  if (cached) {
    return cached;
  }

  if (!hasAlchemyApiKey()) {
    return {
      error:
        "Missing NEXT_PUBLIC_ALCHEMY_API_KEY. Add it to .env.local to load NFT analytics.",
    };
  }

  try {
    const ownedNfts = await fetchFilteredOwnedNfts(normalizedAddress);
    const result: NftAnalyticsResult = {
      data: computeNftAnalytics(ownedNfts),
    };
    setCache(normalizedAddress, result);
    return result;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch NFT analytics.";

    return { error: message };
  }
}
