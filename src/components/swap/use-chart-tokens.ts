import { useState } from "react";
import { getTokensArray } from "@/lib/addresses/tokens";
import { Network, type TokenConfig } from "@/lib/addresses/types";

const AVAILABLE_TOKENS: TokenConfig[] = getTokensArray(Network.MANTLE);

const getInitialTokens = (): {
  base: TokenConfig | null;
  quote: TokenConfig | null;
} => {
  if (AVAILABLE_TOKENS.length === 0) return { base: null, quote: null };
  if (AVAILABLE_TOKENS.length === 1)
    return { base: AVAILABLE_TOKENS[0], quote: null };
  return { base: AVAILABLE_TOKENS[0], quote: AVAILABLE_TOKENS[1] };
};

export const useChartTokens = () => {
  const initial = getInitialTokens();
  const [baseToken, setBaseToken] = useState<TokenConfig | null>(initial.base);
  const [quoteToken, setQuoteToken] = useState<TokenConfig | null>(
    initial.quote
  );

  return {
    baseToken,
    quoteToken,
    setBaseToken,
    setQuoteToken,
  };
};
