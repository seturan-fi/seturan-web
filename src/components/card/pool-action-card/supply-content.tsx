import { useState } from "react";
import { useApprove } from "@/hooks/mutation/use-approve";
import type { HexAddress } from "@/types/types.d";
import { useSupply } from "@/hooks/mutation/use-supply";
import type { ContentProps, Mode } from "./types";
import { ModeToggle } from "./mode-toggle";
import { AmountSection } from "./amount-section";
import { StatsSection } from "./stats-section";
import { ActionButton } from "./action-button";

export const SupplyContent = ({
  poolAddress,
  collateralTokenAddress,
  borrowTokenAddress,
  collateralSymbol,
  borrowSymbol,
  collateralLogoUrl,
  borrowLogoUrl,
  borrowTokenDecimals,
  collateralTokenDecimals,
  ltv,
}: ContentProps) => {
  const [mode, setMode] = useState<Mode>("liquidity");
  const [amount, setAmount] = useState("");

  const [hasApproved, setHasApproved] = useState(false);

  const approve = useApprove(mode);
  const supply = useSupply({ type: mode });

  const isLiquidity = mode === "liquidity";
  const assetSymbol = isLiquidity
    ? borrowSymbol ?? "Borrow"
    : collateralSymbol ?? "Collateral";
  const assetLogoUrl = isLiquidity ? borrowLogoUrl : collateralLogoUrl;
  const tokenAddress = isLiquidity
    ? borrowTokenAddress
    : collateralTokenAddress;
  const decimals = isLiquidity ? borrowTokenDecimals : collateralTokenDecimals;

  const handleAction = () => {
    if (!amount || parseFloat(amount) <= 0) return;

    if (!hasApproved) {
      approve.mutation.mutate(
        {
          tokenAddress: tokenAddress as HexAddress,
          spenderAddress: poolAddress as HexAddress,
          amount,
          decimals,
        },
        {
          onSuccess: () => {
            setHasApproved(true);
          },
        }
      );
    } else {
      supply.mutation.mutate(
        {
          poolAddress: poolAddress as HexAddress,
          amount,
          decimals,
        },
        {
          onSuccess: () => {
            setAmount("");
            setHasApproved(false);
          },
        }
      );
    }
  };

  const getButtonLabel = () => {
    if (approve.status === "loading") return "Approving...";
    if (supply.status === "loading") return "Supplying...";
    if (hasApproved)
      return `Supply ${isLiquidity ? "Liquidity" : "Collateral"}`;
    return "Approve Token";
  };

  const isLoading = approve.status === "loading" || supply.status === "loading";
  const errorMessage = approve.error || supply.error;

  return (
    <>
      <ModeToggle activeTab="Supply" mode={mode} onChange={setMode} />

      <AmountSection
        actionLabel="Supply"
        assetSymbol={assetSymbol}
        assetLogoUrl={assetLogoUrl}
        amount={amount}
        onAmountChange={setAmount}
        tokenAddress={tokenAddress as HexAddress}
        decimals={decimals}
        poolAddress={poolAddress as HexAddress}
        balanceType={isLiquidity ? "wallet" : "wallet"}
      />

      <StatsSection 
        poolAddress={poolAddress} 
        ltv={ltv} 
        mode={isLiquidity ? "supply-liquidity" : "supply-collateral"}
        tokenAddress={tokenAddress}
        tokenSymbol={assetSymbol}
        tokenDecimals={decimals}
      />

      {errorMessage && (
        <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
      )}

      <ActionButton
        label={getButtonLabel()}
        onClick={handleAction}
        disabled={!amount || parseFloat(amount) <= 0 || isLoading}
        isLoading={isLoading}
      />
    </>
  );
};
