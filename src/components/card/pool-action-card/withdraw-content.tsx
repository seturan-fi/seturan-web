import { useState } from "react";
import { useWithdrawLiquidity } from "@/hooks/mutation/use-withdraw-liquidity";
import { useWithdrawCollateral } from "@/hooks/mutation/use-withdraw-collateral";
import { useCalculateWithdrawShares } from "@/hooks/balance/use-user-shares";
import type { ContentProps, Mode } from "./types";
import { ModeToggle } from "./mode-toggle";
import { AmountSection } from "./amount-section";
import { StatsSection } from "./stats-section";
import { ActionButton } from "./action-button";
import type { HexAddress } from "@/types/types.d";

export const WithdrawContent = ({
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

  const withdrawLiquidity = useWithdrawLiquidity();
  const withdrawCollateral = useWithdrawCollateral();

  const { shares: withdrawShares, sharesLoading } = useCalculateWithdrawShares(
    poolAddress as HexAddress,
    mode === "liquidity" ? amount : "0",
    borrowTokenDecimals
  );

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

    if (isLiquidity) {
      if (withdrawShares === BigInt(0)) return;

      withdrawLiquidity.mutation.mutate(
        {
          poolAddress: poolAddress as HexAddress,
          shares: withdrawShares,
          decimals: borrowTokenDecimals,
        },
        {
          onSuccess: () => setAmount(""),
        }
      );
    } else {
      withdrawCollateral.mutation.mutate(
        {
          poolAddress: poolAddress as HexAddress,
          amount,
          decimals: collateralTokenDecimals,
        },
        {
          onSuccess: () => setAmount(""),
        }
      );
    }
  };

  const getButtonLabel = () => {
    if (isLiquidity) {
      if (withdrawLiquidity.status === "loading") return "Withdrawing...";
      return "Withdraw Liquidity";
    } else {
      if (withdrawCollateral.status === "loading") return "Withdrawing...";
      return "Withdraw Collateral";
    }
  };

  const isLoading =
    withdrawLiquidity.status === "loading" ||
    withdrawCollateral.status === "loading";

  const hasError = withdrawLiquidity.error || withdrawCollateral.error;
  const errorMessage = withdrawLiquidity.error || withdrawCollateral.error;

  const isButtonDisabled =
    !amount ||
    parseFloat(amount) <= 0 ||
    (isLiquidity && (sharesLoading || withdrawShares === BigInt(0)));

  return (
    <>
      <ModeToggle activeTab="Withdraw" mode={mode} onChange={setMode} />

      <AmountSection
        actionLabel="Withdraw"
        assetSymbol={assetSymbol}
        assetLogoUrl={assetLogoUrl}
        amount={amount}
        onAmountChange={setAmount}
        tokenAddress={tokenAddress as HexAddress}
        decimals={decimals}
        poolAddress={poolAddress as HexAddress}
        balanceType={isLiquidity ? "supply" : "collateral"}
      />

      <StatsSection 
        poolAddress={poolAddress} 
        ltv={ltv}
        mode={isLiquidity ? "withdraw-liquidity" : "withdraw-collateral"}
        tokenAddress={tokenAddress}
        tokenSymbol={assetSymbol}
        tokenDecimals={decimals}
      />

      {hasError && <div className="alert-error">{errorMessage}</div>}

      {isLiquidity &&
        amount &&
        parseFloat(amount) > 0 &&
        !sharesLoading &&
        withdrawShares > BigInt(0) && (
          <div className="alert-info">
            You will burn {withdrawShares.toString()} shares to withdraw{" "}
            {amount} {assetSymbol}
          </div>
        )}

      <ActionButton
        label={getButtonLabel()}
        onClick={handleAction}
        disabled={isButtonDisabled}
        isLoading={isLoading}
      />
    </>
  );
};
