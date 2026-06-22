"use client";

import { useState, type ChangeEvent } from "react";
import { FadeIn } from "@/components/ui/fade-in";
import type { WalletAddresses } from "@/types/wallet";
import { cn } from "@/lib/utils";
import { SectionBadge } from "./section-badge";
import {
  glassGradientBorder,
  glassInnerSurface,
  glassRadialGlow,
} from "./glass-styles";

const STAGGER_MS = 120;

const ETH_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

export type { WalletAddresses };

type WalletField = keyof WalletAddresses;

type WalletAddressPanelProps = {
  addresses: WalletAddresses;
  onChange: (addresses: WalletAddresses) => void;
};

const FIELDS: Array<{
  key: WalletField;
  label: string;
  placeholder: string;
}> = [
  {
    key: "base",
    label: "Main Base Wallet Address",
    placeholder: "0x...",
  },
  {
    key: "farcaster",
    label: "Farcaster Wallet Address",
    placeholder: "0x...",
  },
  {
    key: "baseapp",
    label: "Base App Wallet Address",
    placeholder: "0x...",
  },
];

function isValidEthAddress(value: string): boolean {
  return value.trim() === "" || ETH_ADDRESS_REGEX.test(value.trim());
}

export function WalletAddressPanel({
  addresses,
  onChange,
}: WalletAddressPanelProps) {
  const [touched, setTouched] = useState<Partial<Record<WalletField, boolean>>>(
    {},
  );

  function handleChange(key: WalletField) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      onChange({ ...addresses, [key]: event.target.value });
    };
  }

  function handleBlur(key: WalletField) {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }

  return (
    <section aria-labelledby="wallet-address-heading" className="space-y-6">
      <FadeIn delay={STAGGER_MS * 3} duration={500}>
        <SectionBadge badge="WA" label="Addresses" />
      </FadeIn>

      <FadeIn delay={STAGGER_MS * 4} duration={500}>
        <h2
          id="wallet-address-heading"
          className="text-lg font-semibold tracking-tight text-foreground sm:text-xl"
        >
          Wallet Addresses
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Paste or edit each address individually. All three fields can be
          filled at once.
        </p>
      </FadeIn>

      <FadeIn delay={STAGGER_MS * 5} duration={500}>
        <div className={glassGradientBorder}>
          <div className={cn(glassInnerSurface, "p-6 sm:p-7")}>
            <div
              className={cn(glassRadialGlow, "opacity-40")}
              aria-hidden="true"
            />

            <div className="relative space-y-5">
              {FIELDS.map((field) => {
                const value = addresses[field.key];
                const showError =
                  touched[field.key] && !isValidEthAddress(value);

                return (
                  <div key={field.key} className="space-y-2">
                    <label
                      htmlFor={`wallet-${field.key}`}
                      className="block text-sm font-medium text-foreground/90"
                    >
                      {field.label}
                    </label>
                    <input
                      id={`wallet-${field.key}`}
                      type="text"
                      inputMode="text"
                      autoComplete="off"
                      spellCheck={false}
                      placeholder={field.placeholder}
                      value={value}
                      onChange={handleChange(field.key)}
                      onBlur={() => handleBlur(field.key)}
                      aria-invalid={showError}
                      aria-describedby={
                        showError ? `wallet-${field.key}-error` : undefined
                      }
                      className={cn(
                        "w-full rounded-lg border bg-background/50 px-4 py-2.5",
                        "font-mono text-sm text-foreground placeholder:text-muted/50",
                        "backdrop-blur-sm transition-colors duration-200",
                        "focus:outline-none focus:ring-2 focus:ring-foreground/10",
                        showError
                          ? "border-red-500/50 focus:border-red-500/60"
                          : "border-border focus:border-foreground/20",
                      )}
                    />
                    {showError ? (
                      <p
                        id={`wallet-${field.key}-error`}
                        className="text-xs text-red-400/90"
                        role="status"
                      >
                        Enter a valid Ethereum address (0x + 40 hex characters).
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
