export type WalletCategory = "base" | "farcaster" | "baseapp" | "custom";

export interface Wallet {
  id: string;
  name: string;
  address: string;
  category: WalletCategory;
}
