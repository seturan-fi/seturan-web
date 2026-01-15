"use client";

import { TokenSymbol } from "@/lib/addresses/types";

// Fixed claim amounts for each token (in human-readable format)
export const FAUCET_CLAIM_AMOUNTS: Record<TokenSymbol, number> = {
  [TokenSymbol.WETH]: 0.5,
  [TokenSymbol.WBTC]: 0.1,
  [TokenSymbol.USDT]: 100,
  [TokenSymbol.USDC]: 100,
  [TokenSymbol.ARB]: 10,
  [TokenSymbol.ETH]: 0, // ETH cannot be minted
};

// Tokens available for faucet (excluding native ETH)
export const FAUCET_TOKENS: TokenSymbol[] = [
  TokenSymbol.WETH,
  TokenSymbol.WBTC,
  TokenSymbol.USDT,
  TokenSymbol.USDC,
  TokenSymbol.ARB,
];

export const FAUCET_TOAST_ID = "faucet-claim";
