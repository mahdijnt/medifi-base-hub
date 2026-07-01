/**
 * Configurable NFT spam detection data.
 * Extend SPAM_CONTRACT_BLACKLIST with known spam contract addresses (lowercase).
 */
export const SPAM_CONTRACT_BLACKLIST: string[] = [];

/** Case-insensitive keywords matched against collection / NFT names. */
export const SPAM_NAME_KEYWORDS = [
  "test",
  "airdrop",
  "free mint",
  "scam",
  "claim",
  "reward",
] as const;

export const SUSPICIOUS_NAME_PATTERN = new RegExp(
  SPAM_NAME_KEYWORDS.map((keyword) =>
    keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+"),
  ).join("|"),
  "i",
);
