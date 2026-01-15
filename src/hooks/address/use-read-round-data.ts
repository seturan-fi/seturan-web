"use client";

import { useReadContract } from "wagmi";
import { tokenDataAbi } from "@/lib/abis/token-data-abi";

export type HexAddress = `0x${string}`;

export const useReadOracleRoundData = (tokenAddress?: HexAddress) => {
  const {
    data: oracleRoundData,
    isLoading,
    error,
  } = useReadContract({
    address: "0x1fEAD2bdAaEbb03C2739949EA3B2145f064378F0",
    abi: tokenDataAbi,
    functionName: "latestRoundData",
    args: tokenAddress ? [tokenAddress] : undefined,
    query: {
      enabled: !!tokenAddress,
    },
  });

  return {
    oracleRoundData,
    oracleRoundDataLoading: isLoading,
    oracleRoundDataError: error,
  };
};
