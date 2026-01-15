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
import { useReadTotalBorrowAssets } from "@/hooks/balance/use-total-borrow-assets";
import { useReadTotalBorrowShares } from "@/hooks/balance/use-total-borrow-shares";
import { REPAY_CONFIG } from "@/lib/constants/mutation.constants";
import type { HexAddress, TxStatus, RepayParams } from "@/types/types.d";

interface UseRepayOptions {
  poolAddress?: HexAddress;
  decimals?: number;
}

export const useRepay = (options?: UseRepayOptions) => {
  const queryClient = useQueryClient();
  const { address } = useConnection();

  const poolAddress = options?.poolAddress;
  const decimals = options?.decimals ?? 18;

  const { totalBorrowAssets } = useReadTotalBorrowAssets(
    poolAddress || ("0x0000000000000000000000000000000000000000" as HexAddress),
    decimals
  );

  const { totalBorrowShares } = useReadTotalBorrowShares(
    poolAddress || ("0x0000000000000000000000000000000000000000" as HexAddress),
    decimals
  );

  const [status, setStatus] = useState<TxStatus>("idle");
  const [txHash, setTxHash] = useState<HexAddress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async ({
      poolAddress,
      borrowTokenAddress,
      amount,
      decimals,
      tokenInDecimals,
    }: RepayParams) => {
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

        // Amount in borrow token decimals (the amount to repay)
        const amountBigInt = BigInt(
          Math.floor(amountFloat * Math.pow(10, decimals))
        );

        // Calculate shares with proper decimal handling
        // Normalize amount to 18 decimals: (amountIn / borrowTokenDecimal) * 1e18
        // Formula: shares = (amountNormalized * totalBorrowShares) / totalBorrowAssetsNormalized
        let sharesBigInt = amountBigInt;

        if (totalBorrowAssets > BigInt(0) && totalBorrowShares > BigInt(0)) {
          const e18 = BigInt(10) ** BigInt(18);
          const borrowTokenDecimalScale = BigInt(10) ** BigInt(decimals);

          // Normalize amount to 18 decimals: (amountIn * 1e18) / borrowTokenDecimals
          const amountNormalized =
            (amountBigInt * e18) / borrowTokenDecimalScale;

          // Normalize totalBorrowAssets to 18 decimals: (totalBorrowAssets * 1e18) / borrowTokenDecimals
          const assetsNormalized =
            (totalBorrowAssets * e18) / borrowTokenDecimalScale;

          // Calculate shares: (amountNormalized * totalBorrowShares) / assetsNormalized
          sharesBigInt =
            (amountNormalized * totalBorrowShares) / assetsNormalized;
        }

        setStatus("loading");
        toast.loading("Repaying...", { id: REPAY_CONFIG.toastId });

        const hash = await writeContract(config, {
          address: poolAddress,
          abi: lendingPoolAbi,
          functionName: "repayWithSelectedToken",
          args: [
            {
              user: address as HexAddress,
              token: borrowTokenAddress,
              shares: sharesBigInt,
              amountOutMinimum: BigInt(0),
              fromPosition: true,
              fee: 1000,
            },
          ],
        });
        setTxHash(hash);

        toast.dismiss(REPAY_CONFIG.toastId);
        toast.loading("Waiting for confirmation...", { id: "confirming" });

        const result = await waitForTxReceipt(hash);

        toast.dismiss("confirming");
        toast.success(REPAY_CONFIG.successMessage, {
          action: {
            label: "View Transaction",
            onClick: () => window.open(getBlockExplorerUrl(hash), "_blank"),
          },
        });

        setStatus("success");
        invalidateKeys(queryClient, "repay");

        return result;
      } catch (e) {
        const err = e as Error;
        toast.dismiss(REPAY_CONFIG.toastId);
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

export default useRepay;
