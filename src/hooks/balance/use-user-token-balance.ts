"use client";

import { useQuery } from "@tanstack/react-query";
import { useConnection } from "wagmi";
import { readContract } from "wagmi/actions";
import { config } from "@/lib/config";
import { formatUnits } from "viem/utils";
import { erc20Abi } from "viem";

export type HexAddress = `0x${string}`;

export const tokenBalanceKeys = {
  all: ["tokenBalance"] as const,
  token: (tokenAddress: string, userAddress: string | undefined) =>
    [...tokenBalanceKeys.all, tokenAddress, userAddress] as const,
};

const getDisplayDecimals = (decimals: number): number => {
  if (decimals >= 18) return 4;
  if (decimals >= 6) return 2;
  return decimals;
};

export const useUserWalletBalance = (
  tokenAddress: HexAddress,
  decimals: number
) => {
  const { address } = useConnection();

  const {
    data: rawBalance,
    isLoading,
    error,
  } = useQuery({
    queryKey: tokenBalanceKeys.token(tokenAddress, address),
    queryFn: async () => {
      if (!address || !tokenAddress) return BigInt(0);
      try {
        const result = await readContract(config, {
          abi: erc20Abi,
          address: tokenAddress,
          functionName: "balanceOf",
          args: [address],
        });
        return result;
      } catch (err) {
        return BigInt(0);
      }
    },
    enabled: !!address && !!tokenAddress,
    staleTime: 5000,
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
    userWalletBalanceFormatted: formatted,
    userWalletBalanceParsed: parsed,
    walletBalanceLoading: isLoading,
    walletBalanceError: error,
  };
};
