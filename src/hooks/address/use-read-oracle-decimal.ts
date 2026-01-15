"use client";

import { useReadContract } from "wagmi";
import { tokenDataAbi } from "@/lib/abis/token-data-abi";

export type HexAddress = `0x${string}`;

const oracleAddress = "0x1fEAD2bdAaEbb03C2739949EA3B2145f064378F0";

export const useReadOracleDecimal = (tokenAddress?: HexAddress) => {
  const {
    data: oracleDecimal,
    isLoading,
    error,
  } = useReadContract({
    address: oracleAddress,
    abi: tokenDataAbi,
    functionName: "decimals",
    args: tokenAddress ? [tokenAddress] : undefined,
    query: {
      enabled: !!tokenAddress,
    },
  });

  return {
    oracleDecimal,
    oracleDecimalLoading: isLoading,
    oracleDecimalError: error,
  };
};
