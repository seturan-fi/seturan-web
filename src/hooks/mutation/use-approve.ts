"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { writeContract } from "wagmi/actions";
import { erc20Abi } from "viem";
import { config } from "@/lib/config";
import { useConnection } from "wagmi";
import { toast } from "sonner";
import { getBlockExplorerUrl } from "@/utils/block-explorer";
import { waitForTxReceipt } from "@/lib/utils/wait-for-tx";
import { isUserRejectedError } from "@/lib/utils/error.utils";
import { APPROVE_CONFIG } from "@/lib/constants/mutation.constants";
import type { HexAddress, TxStatus, ApproveParams } from "@/types/types.d";

type ApproveType = "default" | "liquidity" | "collateral";

export const useApprove = (type: ApproveType = "default") => {
  const cfg = APPROVE_CONFIG[type];
  const { address } = useConnection();

  const [status, setStatus] = useState<TxStatus>("idle");
  const [txHash, setTxHash] = useState<HexAddress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async ({
      tokenAddress,
      spenderAddress,
      amount,
      decimals,
      bufferPercent = 0,
    }: ApproveParams) => {
      try {
        if (!address) {
          toast.error("Wallet not connected");
          throw new Error("Wallet not connected");
        }

        setStatus("idle");
        setError(null);

        const amountFloat = parseFloat(amount);
        if (isNaN(amountFloat) || amountFloat <= 0) {
          toast.error("Invalid amount");
          throw new Error("Invalid amount");
        }

        let amountBigInt = BigInt(
          Math.floor(amountFloat * Math.pow(10, decimals))
        );

        if (bufferPercent > 0) {
          const bufferMultiplier = BigInt(100 + bufferPercent);
          amountBigInt = (amountBigInt * bufferMultiplier) / BigInt(100);
        }

        setStatus("loading");
        toast.loading("Approving token...", { id: cfg.toastId });

        const hash = await writeContract(config, {
          address: tokenAddress,
          abi: erc20Abi,
          functionName: "approve",
          args: [spenderAddress, amountBigInt],
        });
        setTxHash(hash);

        toast.dismiss(cfg.toastId);
        toast.loading("Waiting for confirmation...", { id: "confirming" });

        const result = await waitForTxReceipt(hash);

        toast.dismiss("confirming");
        toast.success(cfg.successMessage, {
          action: {
            label: "View Transaction",
            onClick: () => window.open(getBlockExplorerUrl(hash), "_blank"),
          },
        });

        setStatus("success");

        return result;
      } catch (e) {
        const err = e as Error;
        toast.dismiss(cfg.toastId);
        toast.dismiss("confirming");

        if (isUserRejectedError(err)) {
          setStatus("idle");
          toast.error("Approval rejected");
        } else {
          setStatus("error");
          setError(err.message);
          toast.error("Approval Failed", { description: err.message });
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

  return {
    status,
    mutation,
    txHash,
    error,
    reset,
    isSuccess: status === "success",
  };
};

export const useApproveLiquidity = () => useApprove("liquidity");
export const useApproveCollateral = () => useApprove("collateral");

export default useApprove;
