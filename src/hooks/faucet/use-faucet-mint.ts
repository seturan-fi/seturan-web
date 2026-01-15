"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { writeContract } from "wagmi/actions";
import { parseUnits } from "viem/utils";
import { mockErc20Abi } from "@/lib/abis/mock-erc20-abi";
import { config } from "@/lib/config";
import { useConnection } from "wagmi";
import { toast } from "sonner";
import { getBlockExplorerUrl } from "@/utils/block-explorer";
import { waitForTxReceipt } from "@/lib/utils/wait-for-tx";
import { isUserRejectedError } from "@/lib/utils/error.utils";
import {
  FAUCET_CLAIM_AMOUNTS,
  FAUCET_TOAST_ID,
} from "@/lib/constants/faucet.constants";
import { useFaucetTokenBalances } from "./use-faucet-token-balances";
import type { TokenConfig, TokenSymbol } from "@/lib/addresses/types";
import type { HexAddress, TxStatus } from "@/types/types.d";

export interface FaucetMintParams {
  token: TokenConfig;
  symbol: TokenSymbol;
}

export const useFaucetMint = () => {
  const { address } = useConnection();
  const { invalidateBalances } = useFaucetTokenBalances();

  const [status, setStatus] = useState<TxStatus>("idle");
  const [txHash, setTxHash] = useState<HexAddress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async ({ token, symbol }: FaucetMintParams) => {
      try {
        if (!address) {
          toast.error("Wallet not connected");
          throw new Error("Wallet not connected");
        }

        const claimAmount = FAUCET_CLAIM_AMOUNTS[symbol];
        if (!claimAmount || claimAmount <= 0) {
          toast.error("This token cannot be claimed from faucet");
          throw new Error("Invalid claim amount");
        }

        setStatus("idle");
        setError(null);

        // Convert to BigInt with proper decimals
        const amountBigInt = parseUnits(claimAmount.toString(), token.decimals);

        setStatus("loading");
        toast.loading(`Claiming ${claimAmount} ${token.symbol}...`, {
          id: FAUCET_TOAST_ID,
        });

        const hash = await writeContract(config, {
          address: token.address as HexAddress,
          abi: mockErc20Abi,
          functionName: "mint",
          args: [address as HexAddress, amountBigInt],
        });
        setTxHash(hash);

        toast.dismiss(FAUCET_TOAST_ID);
        toast.loading("Waiting for confirmation...", { id: "confirming" });

        const result = await waitForTxReceipt(hash);

        toast.dismiss("confirming");
        toast.success(`Successfully claimed ${claimAmount} ${token.symbol}`, {
          action: {
            label: "View Transaction",
            onClick: () => window.open(getBlockExplorerUrl(hash), "_blank"),
          },
        });

        setStatus("success");
        invalidateBalances();

        return result;
      } catch (e) {
        const err = e as Error;
        toast.dismiss(FAUCET_TOAST_ID);
        toast.dismiss("confirming");

        if (isUserRejectedError(err)) {
          setStatus("idle");
          toast.error("Transaction rejected");
        } else {
          setStatus("error");
          setError(err.message);
          toast.error("Claim Failed", { description: err.message });
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
    claim: mutation.mutate,
    isPending: mutation.isPending,
  };
};
