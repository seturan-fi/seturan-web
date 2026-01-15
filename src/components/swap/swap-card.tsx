"use client";

import { useState, useMemo, useCallback } from "react";
import { ArrowDownUp, Loader2, RefreshCw } from "lucide-react";
import { usePools, type PoolWithTokens } from "@/hooks/graphql/use-pools";
import { usePositionAddress } from "@/hooks/graphql/use-position";
import { useReadUserCollateralBalance } from "@/hooks/balance/use-user-collateral-balance";
import { useSwapToken } from "@/hooks/mutation/use-swap-token";
import { useExchangeRate } from "@/hooks/use-exchange-rate";
import { getTokensArray } from "@/lib/addresses/tokens";
import { Network, type TokenConfig } from "@/lib/addresses/types";
import type { HexAddress } from "@/types/types.d";
import { ActionButton } from "@/components/card/pool-action-card/action-button";
import { PoolSelectButton } from "./pool-select-button";
import { SwapInput } from "./swap-input";

const AVAILABLE_TOKENS: TokenConfig[] = getTokensArray(Network.MANTLE);

interface SwapCardProps {
  className?: string;
}

export const SwapCard = ({ className = "" }: SwapCardProps) => {
  const [selectedPool, setSelectedPool] = useState<PoolWithTokens | null>(null);
  const [tokenIn, setTokenIn] = useState<TokenConfig | null>(null);
  const [tokenOut, setTokenOut] = useState<TokenConfig | null>(null);
  const [amountIn, setAmountIn] = useState<string>("");

  const { data: pools = [], isLoading: isLoadingPools } = usePools();
  const { status: swapStatus, mutation: swapMutation } = useSwapToken();
  const poolAddress = selectedPool?.lendingPool as HexAddress | undefined;
  const { data: positionAddress, isLoading: isLoadingPosition } =
    usePositionAddress(poolAddress);

  // Fetch token balances for the user's position
  const {
    userCollateralBalanceFormatted: tokenInBalance,
    userCollateralBalanceParsed: tokenInBalanceParsed,
  } = useReadUserCollateralBalance(
    (poolAddress || "0x0000000000000000000000000000000000000000") as HexAddress,
    (tokenIn?.address ||
      "0x0000000000000000000000000000000000000000") as HexAddress,
    tokenIn?.decimals ?? 18
  );

  const {
    rate: exchangeRate,
    formattedAmountOut,
    isLoading: isLoadingRate,
  } = useExchangeRate(
    (tokenIn?.address as HexAddress) ?? null,
    (tokenOut?.address as HexAddress) ?? null,
    amountIn || "1",
    (positionAddress as HexAddress) ?? null,
    tokenIn?.decimals ?? 18,
    tokenOut?.decimals ?? 6
  );

  const isLoading = swapStatus === "loading";
  const hasPosition = Boolean(positionAddress);

  const estimatedAmountOut = useMemo(() => {
    if (!amountIn || parseFloat(amountIn) <= 0) return "";
    if (formattedAmountOut) {
      return parseFloat(formattedAmountOut).toFixed(6);
    }
    if (!exchangeRate) return "";
    return (parseFloat(amountIn) * exchangeRate).toFixed(6);
  }, [amountIn, formattedAmountOut, exchangeRate]);

  const formattedRate = useMemo(() => {
    if (!exchangeRate) return null;
    return exchangeRate >= 1
      ? exchangeRate.toFixed(4)
      : exchangeRate.toFixed(8);
  }, [exchangeRate]);

  const isValidSwap = useMemo(() => {
    return (
      selectedPool &&
      tokenIn &&
      tokenOut &&
      amountIn &&
      parseFloat(amountIn) > 0 &&
      tokenIn.address !== tokenOut.address &&
      hasPosition
    );
  }, [selectedPool, tokenIn, tokenOut, amountIn, hasPosition]);

  const isDisabled =
    !isValidSwap || isLoading || isLoadingPools || isLoadingPosition;

  const handlePoolSelect = useCallback((pool: PoolWithTokens) => {
    setSelectedPool(pool);
    const collateralToken = AVAILABLE_TOKENS.find(
      (t) => t.address.toLowerCase() === pool.collateralToken.toLowerCase()
    );
    const borrowToken = AVAILABLE_TOKENS.find(
      (t) => t.address.toLowerCase() === pool.borrowToken.toLowerCase()
    );
    setTokenIn(collateralToken ?? null);
    setTokenOut(borrowToken ?? null);
    setAmountIn("");
  }, []);

  const handleSwapDirection = useCallback(() => {
    setTokenIn(tokenOut);
    setTokenOut(tokenIn);
    setAmountIn("");
  }, [tokenIn, tokenOut]);

  const handleMaxClick = useCallback(() => {
    if (tokenInBalanceParsed > 0) {
      setAmountIn(tokenInBalanceParsed.toString());
    }
  }, [tokenInBalanceParsed]);

  const handleSwap = useCallback(async () => {
    if (!tokenIn || !tokenOut || !amountIn || !poolAddress) return;

    try {
      await swapMutation.mutateAsync({
        poolAddress,
        tokenIn: tokenIn.address as HexAddress,
        tokenOut: tokenOut.address as HexAddress,
        amountIn,
        tokenInDecimals: tokenIn.decimals,
      });
      setAmountIn("");
    } catch {
      // Error handled by hook
    }
  }, [tokenIn, tokenOut, amountIn, poolAddress, swapMutation]);

  const buttonText = useMemo(() => {
    if (isLoadingPools) return "Loading pools...";
    if (isLoading) return "Swapping...";
    if (!selectedPool) return "Select a pool";
    if (isLoadingPosition) return "Loading position...";
    if (!hasPosition) return "No position found";
    if (!tokenIn || !tokenOut) return "Select tokens";
    if (tokenIn.address === tokenOut.address) return "Select different tokens";
    if (!amountIn || parseFloat(amountIn) <= 0) return "Enter amount";
    return "Swap";
  }, [
    isLoadingPools,
    isLoading,
    selectedPool,
    isLoadingPosition,
    hasPosition,
    tokenIn,
    tokenOut,
    amountIn,
  ]);

  return (
    <div
      className={`rounded-none border border-neutral-800 bg-neutral-950 p-5 ${className}`}
    >
      <SwapHeader />

      <div className="space-y-2">
        <PoolSelector
          pool={selectedPool}
          pools={pools}
          isLoading={isLoadingPools}
          onSelect={handlePoolSelect}
        />

        <SwapInput
          label="You pay"
          token={tokenIn}
          onTokenSelect={setTokenIn}
          amount={amountIn}
          onAmountChange={setAmountIn}
          excludeAddress={tokenOut?.address}
          disabled={isLoading || !selectedPool}
          balance={hasPosition && tokenIn ? tokenInBalance : undefined}
          onMaxClick={
            hasPosition && tokenInBalanceParsed > 0 ? handleMaxClick : undefined
          }
        />

        <SwapDirectionButton
          onClick={handleSwapDirection}
          disabled={!tokenIn || !tokenOut || isLoading || !selectedPool}
        />

        <SwapInput
          label="You receive"
          token={tokenOut}
          onTokenSelect={setTokenOut}
          amount={estimatedAmountOut}
          excludeAddress={tokenIn?.address}
          disabled={isLoading || !selectedPool}
          readOnly
        />

        {tokenIn && tokenOut && (
          <SwapDetails
            tokenIn={tokenIn}
            tokenOut={tokenOut}
            rate={formattedRate}
            exchangeRate={exchangeRate}
            isLoadingRate={isLoadingRate}
          />
        )}

        <div className="mt-4">
          <ActionButton
            label={buttonText}
            onClick={handleSwap}
            disabled={isDisabled}
            isLoading={isLoading || isLoadingPools}
          />
        </div>
      </div>
    </div>
  );
};

const SwapHeader = () => (
  <div className="mb-5">
    <h2 className="text-lg font-semibold text-neutral-100">Swap</h2>
  </div>
);

const PoolSelector = ({
  pool,
  pools,
  isLoading,
  onSelect,
}: {
  pool: PoolWithTokens | null;
  pools: PoolWithTokens[];
  isLoading: boolean;
  onSelect: (pool: PoolWithTokens) => void;
}) => (
  <div className="mb-4 space-y-2">
    <label className="text-xs font-medium text-neutral-500">Select Pool</label>
    <PoolSelectButton
      pool={pool}
      onSelect={onSelect}
      pools={pools}
      isLoading={isLoading}
    />
  </div>
);

const SwapDirectionButton = ({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) => (
  <div className="relative flex justify-center py-1">
    <div className="absolute left-0 right-0 top-1/2 border-t border-neutral-800" />
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="relative z-10 rounded-none border border-neutral-700 bg-neutral-900 p-2.5 shadow-lg transition-all hover:border-neutral-600 hover:bg-neutral-800 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
    >
      <ArrowDownUp className="h-4 w-4 text-neutral-300" />
    </button>
  </div>
);

interface SwapDetailsProps {
  tokenIn: TokenConfig;
  tokenOut: TokenConfig;
  rate: string | null;
  exchangeRate: number | null;
  isLoadingRate: boolean;
}

const SwapDetails = ({
  tokenIn,
  tokenOut,
  rate,
  exchangeRate,
  isLoadingRate,
}: SwapDetailsProps) => (
  <div className="mt-4 rounded-none border border-neutral-800 bg-neutral-900/50 p-3">
    <RateDisplay
      tokenIn={tokenIn}
      tokenOut={tokenOut}
      rate={rate}
      isLoading={isLoadingRate}
    />

    {rate && exchangeRate && (
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="text-neutral-500">Inverse</span>
        <span className="text-neutral-400">
          1 {tokenOut.symbol} ≈{" "}
          {(1 / exchangeRate).toFixed(exchangeRate >= 1 ? 8 : 4)}{" "}
          {tokenIn.symbol}
        </span>
      </div>
    )}

    <div className="mt-2 flex items-center justify-between text-sm">
      <span className="text-neutral-500">Fee</span>
      <span className="text-neutral-300">0.001</span>
    </div>
  </div>
);

const RateDisplay = ({
  tokenIn,
  tokenOut,
  rate,
  isLoading,
}: {
  tokenIn: TokenConfig;
  tokenOut: TokenConfig;
  rate: string | null;
  isLoading: boolean;
}) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2 text-neutral-500">
      <span>Rate</span>
      {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
    </div>
    <div className="flex items-center gap-2">
      {rate ? (
        <span className="text-neutral-300">
          1 {tokenIn.symbol} ≈ {rate} {tokenOut.symbol}
        </span>
      ) : (
        <span className="text-neutral-500">--</span>
      )}
      <RefreshCw
        className={`h-3 w-3 text-neutral-500 ${
          isLoading ? "animate-spin" : ""
        }`}
      />
    </div>
  </div>
);

export default SwapCard;
