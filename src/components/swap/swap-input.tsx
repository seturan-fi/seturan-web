"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { TokenSelectDialog } from "@/components/pool/token-select-dialog";
import { getTokensArray } from "@/lib/addresses/tokens";
import { Network, type TokenConfig } from "@/lib/addresses/types";

const AVAILABLE_TOKENS: TokenConfig[] = getTokensArray(Network.MANTLE);

interface SwapInputProps {
  label: string;
  token: TokenConfig | null;
  onTokenSelect: (token: TokenConfig) => void;
  amount: string;
  onAmountChange?: (value: string) => void;
  excludeAddress?: string;
  disabled?: boolean;
  readOnly?: boolean;
  estimatedValue?: string;
  balance?: string;
  onMaxClick?: () => void;
}

export const SwapInput = ({
  label,
  token,
  onTokenSelect,
  amount,
  onAmountChange,
  excludeAddress,
  disabled = false,
  readOnly = false,
  estimatedValue,
  balance,
  onMaxClick,
}: SwapInputProps) => {
  const [open, setOpen] = useState(false);

  const handleAmountChange = (value: string) => {
    if (readOnly || !onAmountChange) return;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      onAmountChange(value);
    }
  };

  return (
    <div className="rounded-none border border-neutral-800 bg-neutral-900/60 p-4 transition-all hover:border-neutral-700">
      {/* Header Row */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-500">{label}</span>
        {balance && (
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span>Balance: {balance}</span>
            {onMaxClick && (
              <button
                type="button"
                onClick={onMaxClick}
                className="rounded-none bg-primary/20 px-1.5 py-0.5 text-xs font-medium text-primary transition-colors hover:bg-primary/30"
              >
                MAX
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Input Row */}
      <div className="flex items-center gap-3">
        {/* Amount Input */}
        <div className="flex-1">
          <input
            type="text"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="0"
            disabled={disabled}
            readOnly={readOnly}
            className={`w-full bg-transparent text-3xl font-semibold text-neutral-100 outline-none placeholder:text-neutral-600 ${
              readOnly ? "cursor-default" : ""
            } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
          />
          {estimatedValue && (
            <div className="mt-1 text-sm text-neutral-500">
              ≈ ${estimatedValue}
            </div>
          )}
        </div>

        {/* Token Selector Button */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={disabled}
          className="flex min-w-[120px] shrink-0 items-center justify-between gap-2 rounded-none border border-neutral-700 bg-neutral-800 py-2 pl-2 pr-3 transition-all hover:border-neutral-600 hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {token ? (
            <div className="flex items-center gap-2">
              <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-neutral-600">
                <Image
                  src={token.logo}
                  alt={token.symbol}
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full object-cover"
                />
              </div>
              <span className="min-w-[40px] text-base font-semibold text-neutral-100">
                {token.symbol}
              </span>
            </div>
          ) : (
            <span className="px-1 text-sm font-medium text-neutral-400">
              Select token
            </span>
          )}
          <ChevronDown className="h-4 w-4 shrink-0 text-neutral-400" />
        </button>
      </div>

      <TokenSelectDialog
        open={open}
        onOpenChange={setOpen}
        tokens={AVAILABLE_TOKENS}
        onSelect={onTokenSelect}
        excludeAddress={excludeAddress}
        title={`Select ${label.toLowerCase()} token`}
      />
    </div>
  );
};
