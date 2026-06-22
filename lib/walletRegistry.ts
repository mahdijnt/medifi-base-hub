import type { Wallet, WalletCategory } from "@/types/wallet";

/**
 * In-memory wallet registry for builder profiles.
 * Mutable: `addWallet` appends to this array in place.
 * Future analytics in `lib/api/` can consume wallets via the helpers below.
 */
const wallets: Wallet[] = [
  {
    id: "base-main",
    name: "Main Base Wallet",
    address: "0x0000000000000000000000000000000000000001",
    category: "base",
  },
  {
    id: "farcaster",
    name: "Farcaster Wallet",
    address: "0x0000000000000000000000000000000000000002",
    category: "farcaster",
  },
  {
    id: "baseapp",
    name: "Base App Wallet",
    address: "0x0000000000000000000000000000000000000003",
    category: "baseapp",
  },
];

export function getAllWallets(): Wallet[] {
  return [...wallets];
}

export function getWalletById(id: string): Wallet | undefined {
  return wallets.find((wallet) => wallet.id === id);
}

export function getWalletsByCategory(category: WalletCategory): Wallet[] {
  return wallets.filter((wallet) => wallet.category === category);
}

/** Appends a wallet to the registry (mutates the internal array). */
export function addWallet(wallet: Wallet): void {
  wallets.push(wallet);
}
