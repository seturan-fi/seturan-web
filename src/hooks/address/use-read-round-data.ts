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
    address: "0x10FD0d8280E94D0DbC3013b778Ef26d47105Ea7b",
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
