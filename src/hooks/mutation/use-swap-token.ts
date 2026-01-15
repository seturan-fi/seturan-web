"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { writeContract } from "wagmi/actions";
import { lendingPoolAbi } from "@/lib/abis/pool-abi";
import { config } from "@/lib/config";
import { useConnection } from "wagmi";
import { toast } from "sonner";
import { getBlockExplorerUrl } from "@/utils/block-explorer";
import { waitForTxReceipt } from "@/lib/utils/wait-for-tx";
import { isUserRejectedError } from "@/lib/utils/error.utils";
import { invalidateKeys } from "@/lib/constants/query-keys";
import { SWAP_CONFIG } from "@/lib/constants/mutation.constants";
import type { HexAddress, TxStatus, SwapParams } from "@/types/types.d";

const AMOUNT_OUT_MINIMUM = BigInt(0);
const SWAP_FEE = 1000;

export const useSwapToken = () => {
  const queryClient = useQueryClient();
  const { address } = useConnection();

  const [status, setStatus] = useState<TxStatus>("idle");
  const [txHash, setTxHash] = useState<HexAddress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async ({
      poolAddress,
      tokenIn,
      tokenOut,
      amountIn,
      tokenInDecimals,
    }: SwapParams) => {
      try {
        if (!address) {
          toast.error("Wallet not connected");
          throw new Error("Wallet not connected");
        }

        setStatus("idle");
        setError(null);

        const amountFloat = parseFloat(amountIn);
        if (isNaN(amountFloat) || amountFloat <= 0) {
          toast.error("Invalid amount");
          throw new Error("Invalid amount");
        }

        const amountInBigInt = BigInt(
          Math.floor(amountFloat * Math.pow(10, tokenInDecimals))
        );

        setStatus("loading");
        toast.loading("Processing swap...", { id: SWAP_CONFIG.toastId });

        const swapParams = {
          tokenIn: tokenIn as HexAddress,
          tokenOut: tokenOut as HexAddress,
          amountIn: amountInBigInt,
          amountOutMinimum: AMOUNT_OUT_MINIMUM,
          fee: SWAP_FEE,
        };

        const hash = await writeContract(config, {
          address: poolAddress,
          abi: lendingPoolAbi,
          functionName: "swapTokenByPosition",
          args: [swapParams],
        });
        setTxHash(hash);

        toast.dismiss(SWAP_CONFIG.toastId);
        toast.loading("Waiting for confirmation...", { id: "confirming" });

        const result = await waitForTxReceipt(hash);

        toast.dismiss("confirming");
        toast.success(SWAP_CONFIG.successMessage, {
          action: {
            label: "View Transaction",
            onClick: () => window.open(getBlockExplorerUrl(hash), "_blank"),
          },
        });

        setStatus("success");
        invalidateKeys(queryClient, "swap");

        return result;
      } catch (e) {
        const err = e as Error;
        toast.dismiss(SWAP_CONFIG.toastId);
        toast.dismiss("confirming");

        if (isUserRejectedError(err)) {
          setStatus("idle");
          toast.error("Transaction rejected");
        } else {
          setStatus("error");
          setError(err.message);
          toast.error("Swap Failed", { description: err.message });
        }

        throw e;
      }
    },
  });

  const reset = () => {
    setStatus("idle");
    setTxHash(null);
    setError(null);
    mutation.reset();
  };

  return { status, mutation, txHash, error, reset };
};

export default useSwapToken;
