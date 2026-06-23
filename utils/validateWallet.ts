const ETH_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

export function isValidEthereumAddress(address: string): boolean {
  return ETH_ADDRESS_REGEX.test(address.trim());
}

export function validateWalletField(address: string): {
  valid: boolean;
  error?: string;
} {
  const trimmed = address.trim();

  if (trimmed === "") {
    return { valid: true };
  }

  if (!isValidEthereumAddress(trimmed)) {
    return { valid: false, error: "Invalid wallet address" };
  }

  return { valid: true };
}

export type WalletFormAddresses = {
  main: string;
  farcaster: string;
  baseApp: string;
};

export type WalletFormFieldErrors = {
  main?: string;
  farcaster?: string;
  baseApp?: string;
};

export function validateWalletForm(addresses: WalletFormAddresses): {
  valid: boolean;
  formError?: string;
  fieldErrors?: WalletFormFieldErrors;
} {
  const fields: Array<{ key: keyof WalletFormAddresses; value: string }> = [
    { key: "main", value: addresses.main },
    { key: "farcaster", value: addresses.farcaster },
    { key: "baseApp", value: addresses.baseApp },
  ];

  const nonEmpty = fields.filter(({ value }) => value.trim() !== "");

  if (nonEmpty.length === 0) {
    return { valid: false, formError: "Please provide at least one wallet" };
  }

  const fieldErrors: WalletFormFieldErrors = {};

  for (const { key, value } of nonEmpty) {
    const result = validateWalletField(value);
    if (!result.valid) {
      fieldErrors[key] = result.error;
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { valid: false, fieldErrors };
  }

  return { valid: true };
}
