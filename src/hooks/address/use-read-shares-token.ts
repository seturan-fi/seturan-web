"use client";

import { useReadContract } from "wagmi";
import { routerAbi } from "@/lib/abis/router-abi";
import { useRouterAddress } from "../graphql/use-position";

export type HexAddress = `0x${string}`;

export const useReadSharesToken = (
  lendingPoolAddress: HexAddress,
  initialRouterAddress?: string
) => {
  const { data: fetchedRouterAddress, isLoading: routerLoading } =
    useRouterAddress(lendingPoolAddress);

  const routerAddress = initialRouterAddress || fetchedRouterAddress;

  const {
    data: sharesTokenAddress,
    isLoading,
    error,
  } = useReadContract({
    address: routerAddress as HexAddress | undefined,
    abi: routerAbi,
    functionName: "sharesToken",
    args: [],
    query: {
      enabled: !!routerAddress,
    },
  });

  return {
    sharesTokenAddress: sharesTokenAddress as HexAddress | undefined,
    sharesTokenLoading: routerLoading || isLoading,
    sharesTokenError: error,
  };
};
