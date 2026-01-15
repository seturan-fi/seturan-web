"use client";

import { useQuery } from "@tanstack/react-query";
import { readContract } from "wagmi/actions";
import { config } from "@/lib/config";
import { helperAbi } from "@/lib/abis/helper-abi";
import { Address, pad } from "viem";

// Type definitions matching the ABI structure
export type SendParam = {
  readonly dstEid: number;
  readonly to: `0x${string}`; // bytes32 format
  readonly amountLD: bigint;
  readonly minAmountLD: bigint;
  readonly extraOptions: `0x${string}`;
  readonly composeMsg: `0x${string}`;
  readonly oftCmd: `0x${string}`;
};

export type MessagingFee = {
  readonly nativeFee: bigint;
  readonly lzTokenFee: bigint;
};

export type BorrowParams = {
  readonly sendParam: SendParam;
  readonly fee: MessagingFee;
  readonly amount: bigint;
  readonly chainId: bigint;
  readonly addExecutorLzReceiveOption: bigint;
};

interface UseGetFeeParams {
  helperAddress: Address;
  lendingPool: Address;
  userAddress: Address;
  amount: bigint;
  destEid: number;
  destChainId: bigint;
  payInLzToken?: boolean;
  addExecutorLzReceiveOption?: bigint;
  enabled?: boolean;
}

// Query keys with BigInt converted to string for serialization
export const getFeeKeys = {
  all: ["getFee"] as const,
  fee: (params: {
    helperAddress: string;
    lendingPool: string;
    userAddress: string;
    amount: string; // BigInt as string
    destEid: number;
    destChainId: string; // BigInt as string
    payInLzToken: boolean;
    addExecutorLzReceiveOption: string; // BigInt as string
  }) => [...getFeeKeys.all, params] as const,
};

export function useGetFee({
  helperAddress,
  lendingPool,
  userAddress,
  amount,
  destEid,
  destChainId,
  payInLzToken = false,
  addExecutorLzReceiveOption = BigInt(0),
  enabled = true,
}: UseGetFeeParams) {
  // Build borrowParams using the actual BigInt values
  const buildBorrowParams = (): BorrowParams => ({
    sendParam: {
      dstEid: destEid,
      to: pad(userAddress, { size: 32 }), // Convert address to bytes32
      amountLD: amount,
      minAmountLD: amount, // Can be adjusted for slippage
      extraOptions: "0x" as const,
      composeMsg: "0x" as const,
      oftCmd: "0x" as const,
    },
    fee: {
      nativeFee: BigInt(0),
      lzTokenFee: BigInt(0),
    },
    amount,
    chainId: destChainId,
    addExecutorLzReceiveOption,
  });

  const isEnabled =
    enabled &&
    !!helperAddress &&
    !!lendingPool &&
    !!userAddress &&
    amount > BigInt(0);

  // Debug logging
  console.log("[useGetFee] Params check:", {
    enabled,
    helperAddress,
    lendingPool,
    userAddress,
    amount: amount.toString(),
    destEid,
    destChainId: destChainId.toString(),
    isEnabled,
  });

  const { data, isLoading, isError, error, refetch, status, fetchStatus } =
    useQuery({
      // Convert BigInt to string in query key for serialization
      queryKey: getFeeKeys.fee({
        helperAddress,
        lendingPool,
        userAddress,
        amount: amount.toString(),
        destEid,
        destChainId: destChainId.toString(),
        payInLzToken,
        addExecutorLzReceiveOption: addExecutorLzReceiveOption.toString(),
      }),
      queryFn: async () => {
        const borrowParams = buildBorrowParams();

        console.log("[useGetFee] Calling getFee with:", {
          borrowParams,
          lendingPool,
          payInLzToken,
        });

        try {
          const result = await readContract(config, {
            address: "0x034cf520e48C7e87763466949058965F7a5A3181",
            abi: helperAbi,
            functionName: "getFee",
            args: [borrowParams, lendingPool, payInLzToken],
          });

          console.log("[useGetFee] Result:", result);

          return result;
        } catch (err) {
          console.error("[useGetFee] Contract call error:", err);
          throw err;
        }
      },
      enabled: isEnabled,
      staleTime: 0, // Always fetch fresh data
      gcTime: 0, // Don't cache
      refetchOnMount: true,
      retry: false, // Don't retry, show error immediately
    });

  // Debug query status
  console.log("[useGetFee] Query status:", {
    status,
    fetchStatus,
    isLoading,
    isError,
    error: error?.message || error,
    data,
    nativeFee: data?.[0]?.toString(),
    lzTokenFee: data?.[1]?.toString(),
  });

  // Build borrowParams for export (to be used in mutations)
  const borrowParams = buildBorrowParams();

  return {
    nativeFee: data?.[0] ?? BigInt(0),
    lzTokenFee: data?.[1] ?? BigInt(0),
    borrowParams, // Export for use in the mutation
    isLoading,
    isError,
    error,
    refetch,
  };
}
