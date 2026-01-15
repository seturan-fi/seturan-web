"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useConnection } from "wagmi";
import { readContract } from "wagmi/actions";
import { config } from "@/lib/config";
import { formatUnits } from "viem/utils";
import { erc20Abi } from "viem";
import { TOKENS } from "@/lib/addresses/tokens";
import { Network, TokenSymbol, type TokenConfig } from "@/lib/addresses/types";
import { FAUCET_TOKENS } from "@/lib/constants/faucet.constants";

export type HexAddress = `0x${string}`;

export interface FaucetTokenBalance {
  token: TokenConfig;
  symbol: TokenSymbol;
  rawBalance: bigint;
  formattedBalance: string;
}

export const faucetBalanceKeys = {
  all: ["faucetBalances"] as const,
  user: (userAddress: string | undefined) =>
    [...faucetBalanceKeys.all, userAddress] as const,
};

const getDisplayDecimals = (decimals: number): number => {
  if (decimals >= 18) return 4;
  if (decimals >= 8) return 6;
  if (decimals >= 6) return 2;
  return decimals;
};

export const useFaucetTokenBalances = () => {
  const { address } = useConnection();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: faucetBalanceKeys.user(address),
    queryFn: async (): Promise<FaucetTokenBalance[]> => {
      if (!address) return [];

      const tokens = TOKENS[Network.ARBITRUM];
      const balances: FaucetTokenBalance[] = [];

      for (const symbol of FAUCET_TOKENS) {
        const token = tokens[symbol];
        if (!token) continue;

        try {
          const rawBalance = await readContract(config, {
            abi: erc20Abi,
            address: token.address as HexAddress,
            functionName: "balanceOf",
            args: [address],
          });

          const formattedBalance = parseFloat(
            formatUnits(rawBalance, token.decimals)
          ).toFixed(getDisplayDecimals(token.decimals));

          balances.push({
            token,
            symbol,
            rawBalance,
            formattedBalance,
          });
        } catch {
          balances.push({
            token,
            symbol,
            rawBalance: BigInt(0),
            formattedBalance: "0",
          });
        }
      }

      return balances;
    },
    enabled: !!address,
    staleTime: 10000,
    refetchInterval: 30000,
  });

  const invalidateBalances = () => {
    queryClient.invalidateQueries({ queryKey: faucetBalanceKeys.all });
  };

  return {
    balances: data ?? [],
    isLoading,
    error,
    refetch,
    invalidateBalances,
  };
};
