import type { WalletAddresses } from "@/types/wallet";
import type { Wallet, WalletCategory } from "@/types/wallet";

export const ETH_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

export const BUILDER_WALLET_ADDRESSES: WalletAddresses = {
  base: "0x46Eee482F09f242Be431948d077070ea27Ff5336",
  farcaster: "0xd3a08079a4bf3e07a682de3ae4390f21c5c0e40a",
  baseapp: "0x4fc9455ce62a0b4bb7a39986ee65d5c932dd0361",
};

const WALLET_FIELD_CONFIG: Array<{
  key: keyof WalletAddresses;
  id: string;
  name: string;
  category: WalletCategory;
}> = [
  {
    key: "base",
    id: "base-main",
    name: "Main Base Wallet",
    category: "base",
  },
  {
    key: "farcaster",
    id: "farcaster",
    name: "Farcaster Wallet",
    category: "farcaster",
  },
  {
    key: "baseapp",
    id: "baseapp",
    name: "Base App Wallet",
    category: "baseapp",
  },
];

export function isValidEthAddress(value: string): boolean {
  return ETH_ADDRESS_REGEX.test(value.trim());
}

/**
 * Builds a runtime wallet list from user-entered addresses.
 * Only includes fields with non-empty trimmed values.
 */
export function buildRuntimeWalletRegistry(
  addresses: WalletAddresses,
): Wallet[] {
  return WALLET_FIELD_CONFIG.filter(
    (field) => addresses[field.key].trim() !== "",
  ).map((field) => ({
    id: field.id,
    name: field.name,
    address: addresses[field.key].trim(),
    category: field.category,
  }));
}

export type AddressValidationResult =
  | { ok: true; wallets: Wallet[] }
  | { ok: false; error: string };

/**
 * Validates that at least one address is provided and all non-empty
 * values are valid Ethereum addresses.
 */
export function validateAddressesForAnalyze(
  addresses: WalletAddresses,
): AddressValidationResult {
  const filled = WALLET_FIELD_CONFIG.filter(
    (field) => addresses[field.key].trim() !== "",
  );

  if (filled.length === 0) {
    return {
      ok: false,
      error: "Enter at least one wallet address to analyze.",
    };
  }

  for (const field of filled) {
    if (!isValidEthAddress(addresses[field.key])) {
      return {
        ok: false,
        error: `Invalid address for ${field.name}. Use 0x plus 40 hex characters.`,
      };
    }
  }

  return { ok: true, wallets: buildRuntimeWalletRegistry(addresses) };
}
