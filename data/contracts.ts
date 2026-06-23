import { BUILDER_WALLET_ADDRESSES } from "@/lib/runtimeWalletRegistry";

/** Wallet addresses scanned for the homepage Contract Registry. */
export const CONTRACT_REGISTRY_WALLET_ADDRESSES: string[] = [
  BUILDER_WALLET_ADDRESSES.base,
  BUILDER_WALLET_ADDRESSES.farcaster,
  BUILDER_WALLET_ADDRESSES.baseapp,
].filter((address) => address.trim() !== "");
