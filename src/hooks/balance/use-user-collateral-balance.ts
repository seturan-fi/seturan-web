"use client";

import { useQuery } from "@tanstack/react-query";
import { readContract } from "wagmi/actions";
import { config } from "@/lib/config";
import { erc20Abi, formatUnits } from "viem";
import { usePositionAddress } from "../graphql/use-position";

export type HexAddress = `0x${string}`;

export const collateralBalanceKeys = {
  all: ["collateralBalance"] as const,
  balance: (
    lendingPoolAddress: string,
    tokenAddress: string,
    userPosition: string | undefined
  ) =>
    [
      ...collateralBalanceKeys.all,
      lendingPoolAddress,
      tokenAddress,
      userPosition,
    ] as const,
};

const getDisplayDecimals = (decimals: number): number => {
  if (decimals >= 18) return 4;
  if (decimals >= 6) return 2;
  return decimals;
};

export const useReadUserCollateralBalance = (
  lendingPoolAddress: HexAddress,
  tokenAddress: HexAddress,
  decimals: number
) => {
  const {
    data: userPosition,
    isLoading: userPositionLoading,
    error: userPositionError,
  } = usePositionAddress(lendingPoolAddress);

  const hasValidPosition =
    userPosition &&
    userPosition !== "0x0000000000000000000000000000000000000000" &&
    userPosition !== "0x0000000000000000000000000000000000000001";

  const {
    data: rawBalance,
    isLoading,
    error,
  } = useQuery({
    queryKey: collateralBalanceKeys.balance(lendingPoolAddress, tokenAddress, userPosition || undefined),
    queryFn: async () => {
      if (!hasValidPosition || !tokenAddress || !lendingPoolAddress) return BigInt(0);
      try {
        const result = await readContract(config, {
          address: tokenAddress,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [
            (userPosition ||
              "0x0000000000000000000000000000000000000000") as `0x${string}`,
          ],
        });
        return result;
      } catch (err) {
        return BigInt(0);
      }
    },
    enabled: Boolean(
      hasValidPosition &&
        !userPositionLoading &&
        !userPositionError &&
        tokenAddress &&
        tokenAddress !== "0x0000000000000000000000000000000000000000" &&
        lendingPoolAddress &&
        lendingPoolAddress !== "0x0000000000000000000000000000000000000000"
    ),
    staleTime: 10000,
    gcTime: 30000,
    retry: 2,
    retryDelay: 400,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  const formatted = rawBalance
    ? parseFloat(formatUnits(rawBalance as bigint, decimals)).toFixed(
        getDisplayDecimals(decimals)
      )
    : "0";

  const parsed = rawBalance
    ? parseFloat(formatUnits(rawBalance as bigint, decimals))
    : 0;

  return {
    userCollateralBalance: rawBalance || BigInt(0),
    userCollateralBalanceFormatted: formatted,
    userCollateralBalanceParsed: parsed,
    userCollateralBalanceLoading: userPositionLoading || isLoading,
    userCollateralBalanceError: userPositionError || error,

    hasValidPosition,
  };
};
