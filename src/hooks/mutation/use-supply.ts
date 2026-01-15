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
import { SUPPLY_CONFIG } from "@/lib/constants/mutation.constants";
import type { HexAddress, TxStatus, SupplyParams } from "@/types/types.d";

export type SupplyType = "liquidity" | "collateral";

interface UseSupplyOptions {
  type: SupplyType;
}

export const useSupply = ({ type }: UseSupplyOptions) => {
  const queryClient = useQueryClient();
  const { address } = useConnection();
  const cfg = SUPPLY_CONFIG[type];

  const [status, setStatus] = useState<TxStatus>("idle");
  const [txHash, setTxHash] = useState<HexAddress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async ({ poolAddress, amount, decimals }: SupplyParams) => {
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

        const amountBigInt = BigInt(
          Math.floor(amountFloat * Math.pow(10, decimals))
        );

        setStatus("loading");
        toast.loading("Processing...", { id: cfg.toastId });

        const hash = await writeContract(config, {
          address: poolAddress,
          abi: lendingPoolAbi,
          functionName: cfg.functionName,
          args: [address as HexAddress, amountBigInt],
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
        invalidateKeys(queryClient, "supply");

        return result;
      } catch (e) {
        const err = e as Error;
        toast.dismiss(cfg.toastId);
        toast.dismiss("confirming");

        if (isUserRejectedError(err)) {
          setStatus("idle");
          toast.error("Transaction rejected");
        } else {
          setStatus("error");
          setError(err.message);
          toast.error("Transaction Failed", { description: err.message });
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

export const useSupplyLiquidity = () => useSupply({ type: "liquidity" });
export const useSupplyCollateral = () => useSupply({ type: "collateral" });

export default useSupply;
