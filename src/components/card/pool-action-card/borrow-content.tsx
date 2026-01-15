import { useState, useMemo } from "react";
import { useBorrow } from "@/hooks/mutation/use-borrow";
import { useBorrowCrossChain } from "@/hooks/mutation/use-borrow-crosschain";
import { useGetFee } from "@/hooks/use-get-fee";
import type { ContentProps } from "./types";
import { AmountSection } from "./amount-section";
import { StatsSection } from "./stats-section";
import { ActionButton } from "./action-button";
import type { HexAddress } from "@/types/types.d";
import { ChainSelect } from "@/components/chain/chain-select";
import {
  DEFAULT_CHAIN,
  type CrossChainConfig,
} from "@/lib/constants/chains";
import { useConnection } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { useReadContract } from "wagmi";
import { helperAbi } from "@/lib/abis/helper-abi";

const HELPER_ADDRESS =
  "0x6c454d20F4CB5f69e2D66693fA8deE931D7432dF" as HexAddress;
const MANTLE_SEPOLIA_CHAIN_ID = 5003;

export const BorrowContent = ({
  poolAddress,
  borrowTokenAddress,
  borrowSymbol,
  borrowLogoUrl,
  borrowTokenDecimals,
  ltv,
}: ContentProps) => {
  const [amount, setAmount] = useState("");
  const [selectedChain, setSelectedChain] = useState<CrossChainConfig | null>(
    DEFAULT_CHAIN
  );

  const { address } = useConnection();
  const borrow = useBorrow();
  const borrowCrossChain = useBorrowCrossChain();

  // Automatically determine if cross-chain based on selected chain
  const isCrossChain = useMemo(() => {
    if (!selectedChain) return false;
    return Number(selectedChain.chainId) !== MANTLE_SEPOLIA_CHAIN_ID;
  }, [selectedChain]);

  // Get max borrow amount from Helper contract
  const { data: maxBorrowAmount } = useReadContract({
    address: HELPER_ADDRESS,
    abi: helperAbi,
    functionName: "getMaxBorrowAmount",
    args: [
      poolAddress as HexAddress,
      address || "0x0000000000000000000000000000000000000000",
    ],
    query: { enabled: !!address },
  });

  const amountBigInt =
    amount && parseFloat(amount) > 0
      ? parseUnits(amount, borrowTokenDecimals)
      : BigInt(0);
  const {
    nativeFee,
    borrowParams,
    isLoading: isFeeLoading,
  } = useGetFee({
    helperAddress: HELPER_ADDRESS,
    lendingPool: poolAddress as HexAddress,
    userAddress: (address ||
      "0x0000000000000000000000000000000000000000") as HexAddress,
    amount: amountBigInt,
    destEid: selectedChain?.destEid || DEFAULT_CHAIN.destEid,
    destChainId: selectedChain?.chainId || DEFAULT_CHAIN.chainId,
    enabled: isCrossChain && !!address && amountBigInt > BigInt(0),
  });

  const handleAction = () => {
    if (!amount || parseFloat(amount) <= 0) return;

    if (isCrossChain) {
      borrowCrossChain.mutation.mutate(
        {
          poolAddress: poolAddress as HexAddress,
          borrowParams,
          nativeFee,
        },
        {
          onSuccess: () => {
            setAmount("");
          },
        }
      );
    } else {
      borrow.mutation.mutate(
        {
          poolAddress: poolAddress as HexAddress,
          amount,
          decimals: borrowTokenDecimals,
        },
        {
          onSuccess: () => {
            setAmount("");
          },
        }
      );
    }
  };

  const getButtonLabel = () => {
    const isLoading =
      borrow.status === "loading" || borrowCrossChain.status === "loading";

    if (isLoading) {
      return isCrossChain ? "Borrowing Cross-Chain..." : "Borrowing...";
    }

    return isCrossChain ? "Borrow Cross-Chain" : "Borrow";
  };

  const errorMessage = borrow.error || borrowCrossChain.error;
  const isLoading =
    borrow.status === "loading" || borrowCrossChain.status === "loading";

  const maxBorrowFormatted = maxBorrowAmount
    ? parseFloat(
        formatUnits(BigInt(maxBorrowAmount.toString()), borrowTokenDecimals)
      ).toFixed(6)
    : "0";

  return (
    <div className="space-y-3">
      <AmountSection
        actionLabel="Borrow"
        assetSymbol={borrowSymbol ?? "Borrow"}
        assetLogoUrl={borrowLogoUrl}
        amount={amount}
        onAmountChange={setAmount}
        tokenAddress={borrowTokenAddress as HexAddress}
        decimals={borrowTokenDecimals}
      />

      {/* Chain selector */}
      <ChainSelect
        label="Destination Chain"
        selected={selectedChain}
        onSelect={setSelectedChain}
      />

      {/* Show cross-chain indicator and fee */}
      {isCrossChain && selectedChain && (
        <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-700/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <p className="text-xs font-medium text-blue-300">
              Cross-Chain Borrow
            </p>
          </div>
          {nativeFee > BigInt(0) && !isFeeLoading && (
            <p className="text-xs text-gray-400">
              LayerZero Fee:{" "}
              <span className="font-medium text-blue-200">
                {formatUnits(nativeFee, 18)} MNT
              </span>
            </p>
          )}
        </div>
      )}

      {/* Show same chain indicator */}
      {selectedChain && !isCrossChain && (
        <div className="p-2 rounded bg-green-900/20 border border-green-700/30">
          <p className="text-xs text-green-300">
            ✓ Same chain borrow (no additional fees)
          </p>
        </div>
      )}

      <StatsSection 
        poolAddress={poolAddress} 
        ltv={ltv} 
        mode="borrow"
        maxBorrowAmount={maxBorrowFormatted}
        borrowSymbol={borrowSymbol}
        borrowTokenDecimals={borrowTokenDecimals}
      />

      {errorMessage && (
        <div className="p-3 rounded-lg bg-red-900/20 border border-red-700/30">
          <p className="text-red-300 text-sm">{errorMessage}</p>
        </div>
      )}

      <ActionButton
        label={getButtonLabel()}
        onClick={handleAction}
        disabled={
          !amount ||
          parseFloat(amount) <= 0 ||
          isLoading ||
          !selectedChain ||
          (isCrossChain && isFeeLoading)
        }
        isLoading={isLoading}
      />
    </div>
  );
};
