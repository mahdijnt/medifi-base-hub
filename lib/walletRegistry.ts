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
    address: "0x46Eee482F09f242Be431948d077070ea27Ff5336",
    category: "base",
  },
  {
    id: "farcaster",
    name: "Farcaster Wallet",
    address: "0xd3a08079a4bf3e07a682de3ae4390f21c5c0e40a",
    category: "farcaster",
  },
  {
    id: "baseapp",
    name: "Base App Wallet",
    address: "0x4fc9455ce62a0b4bb7a39986ee65d5c932dd0361",
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
