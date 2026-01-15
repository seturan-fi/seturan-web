"use client";

import { useReadContract } from "wagmi";
import { tokenDataAbi } from "@/lib/abis/token-data-abi";

export type HexAddress = `0x${string}`;

const oracleAddress = "0x10FD0d8280E94D0DbC3013b778Ef26d47105Ea7b";

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
