import { useState, useMemo } from "react";
import type { ContentProps, RepayMode } from "./types";
import { ModeToggle } from "./mode-toggle";
import { AmountSection } from "./amount-section";
import { StatsSection } from "./stats-section";
import { ActionButton } from "./action-button";
import { ConversionCard } from "./conversion-card";
import { useApprove } from "@/hooks/mutation/use-approve";
import { useRepay } from "@/hooks/mutation/use-repay-select-token";
import { useRepay as useRepayByCollateral } from "@/hooks/mutation/use-repay-by-collateral";
import { TokenSelect } from "@/components/pool/token-select";
import { useExchangeRate } from "@/hooks/use-exchange-rate";
import { usePosition } from "@/hooks/graphql/use-position";
import { getTokensArray } from "@/lib/addresses/tokens";
import { Network } from "@/lib/addresses/types";
import type { HexAddress } from "@/types/types.d";
import type { TokenConfig } from "@/lib/addresses/types";

const AVAILABLE_TOKENS = getTokensArray(Network.MANTLE);

export const RepayContent = ({
  poolAddress,
  borrowTokenAddress,
  borrowSymbol,
  borrowLogoUrl,
  borrowTokenDecimals,
  ltv,
}: ContentProps) => {
  const getBorrowTokenConfig = () => {
    return (
      AVAILABLE_TOKENS.find(
        (t) => t.address.toLowerCase() === borrowTokenAddress?.toLowerCase()
      ) || null
    );
  };

  const [repayMode, setRepayMode] = useState<RepayMode>("position");
  const [amount, setAmount] = useState("");
  const [hasApproved, setHasApproved] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenConfig | null>(() =>
    getBorrowTokenConfig()
  );
  const [collateralToken, setCollateralToken] = useState<TokenConfig | null>(
    () => getBorrowTokenConfig()
  );

  const { data: positionData } = usePosition(poolAddress);
  const positionAddress = positionData?.position as HexAddress | null;

  const isSameAsBorrowToken =
    selectedToken?.address?.toLowerCase() === borrowTokenAddress?.toLowerCase();

  const isCollateralSameAsBorrowToken =
    collateralToken?.address?.toLowerCase() ===
    borrowTokenAddress?.toLowerCase();

  const {
    formattedAmountOut: exchangeRateAmount,
    rate: exchangeRate,
    isLoading: isLoadingExchangeRate,
  } = useExchangeRate(
    repayMode === "position" && selectedToken && !isSameAsBorrowToken
      ? (selectedToken.address as HexAddress)
      : null,
    borrowTokenAddress as HexAddress,
    amount || "0",
    positionAddress,
    selectedToken?.decimals || 18,
    borrowTokenDecimals
  );

  const {
    formattedAmountOut: collateralExchangeRateAmount,
    rate: collateralExchangeRate,
    isLoading: isLoadingCollateralExchangeRate,
  } = useExchangeRate(
    repayMode === "token" && collateralToken && !isCollateralSameAsBorrowToken
      ? (collateralToken.address as HexAddress)
      : null,
    borrowTokenAddress as HexAddress,
    amount || "0",
    positionAddress,
    collateralToken?.decimals || 18,
    borrowTokenDecimals
  );

  const approve = useApprove("default");
  const repay = useRepay({
    poolAddress: poolAddress as HexAddress,
    decimals: borrowTokenDecimals,
  });
  const repayByCollateral = useRepayByCollateral({
    poolAddress: poolAddress as HexAddress,
    decimals: borrowTokenDecimals,
  });

  const tokenToUse =
    repayMode === "position" && selectedToken
      ? selectedToken.address
      : repayMode === "token" && collateralToken
      ? collateralToken.address
      : borrowTokenAddress;

  const convertedAmount = useMemo(() => {
    if (!amount || parseFloat(amount) <= 0) return "0";
    if (isSameAsBorrowToken) return amount;
    if (exchangeRateAmount) return exchangeRateAmount;
    return "0";
  }, [amount, isSameAsBorrowToken, exchangeRateAmount]);

  const collateralConvertedAmount = useMemo(() => {
    if (!amount || parseFloat(amount) <= 0) return "0";
    if (isCollateralSameAsBorrowToken) return amount;
    if (collateralExchangeRateAmount) return collateralExchangeRateAmount;
    return "0";
  }, [amount, isCollateralSameAsBorrowToken, collateralExchangeRateAmount]);

  const handleAction = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    if (repayMode === "position" && !selectedToken) return;
    if (repayMode === "token" && !collateralToken) return;

    if (repayMode === "position") {
      if (!hasApproved) {
        approve.mutation.mutate(
          {
            tokenAddress: tokenToUse as HexAddress,
            spenderAddress: poolAddress as HexAddress,
            amount: amount,
            decimals: selectedToken
              ? selectedToken.decimals
              : borrowTokenDecimals,
            bufferPercent: 10,
          },
          {
            onSuccess: () => setHasApproved(true),
          }
        );
      } else {
        repay.mutation.mutate(
          {
            poolAddress: poolAddress as HexAddress,
            borrowTokenAddress: tokenToUse as HexAddress,
            amount: convertedAmount,
            decimals: borrowTokenDecimals,
            tokenInDecimals: selectedToken
              ? selectedToken.decimals
              : borrowTokenDecimals,
          },
          {
            onSuccess: () => {
              setAmount("");
              setHasApproved(false);
            },
          }
        );
      }
    } else {
      repayByCollateral.mutation.mutate(
        {
          poolAddress: poolAddress as HexAddress,
          borrowTokenAddress: tokenToUse as HexAddress,
          amount: collateralConvertedAmount,
          decimals: borrowTokenDecimals,
          tokenInDecimals: collateralToken
            ? collateralToken.decimals
            : borrowTokenDecimals,
        },
        {
          onSuccess: () => setAmount(""),
        }
      );
    }
  };

  const getButtonLabel = () => {
    if (approve.status === "loading") return "Approving...";
    if (repay.status === "loading") return "Repaying...";
    if (repayByCollateral.status === "loading") return "Repaying...";

    if (repayMode === "position") {
      return hasApproved ? "Repay from Position" : "Approve Token";
    }
    return "Repay with Collateral";
  };

  const isLoading =
    approve.status === "loading" ||
    repay.status === "loading" ||
    repayByCollateral.status === "loading";

  const errorMessage = approve.error || repay.error || repayByCollateral.error;

  const showConversionCard =
    repayMode === "position" &&
    selectedToken &&
    !isSameAsBorrowToken &&
    amount &&
    parseFloat(amount) > 0;

  const showCollateralConversionCard =
    repayMode === "token" &&
    collateralToken &&
    !isCollateralSameAsBorrowToken &&
    amount &&
    parseFloat(amount) > 0;

  return (
    <>
      <ModeToggle
        activeTab="Repay"
        mode="liquidity"
        onChange={() => {}}
        repayMode={repayMode}
        onRepayModeChange={(mode) => {
          setRepayMode(mode);
          setHasApproved(false);
          setAmount("");
          setSelectedToken(null);
          setCollateralToken(null);
        }}
      />

      {repayMode === "position" && (
        <TokenSelect
          label="Select Token"
          selected={selectedToken}
          onSelect={(token) => {
            setSelectedToken(token);
            setHasApproved(false);
          }}
        />
      )}

      {repayMode === "token" && (
        <TokenSelect
          label="Select Collateral Token"
          selected={collateralToken}
          onSelect={setCollateralToken}
        />
      )}

      <AmountSection
        actionLabel={
          repayMode === "position" ? "Repay with" : "Repay with Collateral"
        }
        assetSymbol={
          repayMode === "position" && selectedToken
            ? selectedToken.symbol
            : repayMode === "token" && collateralToken
            ? collateralToken.symbol
            : borrowSymbol ?? "Borrow"
        }
        assetLogoUrl={
          repayMode === "position" && selectedToken
            ? selectedToken.logo
            : repayMode === "token" && collateralToken
            ? collateralToken.logo
            : borrowLogoUrl
        }
        amount={amount}
        onAmountChange={setAmount}
        tokenAddress={
          (repayMode === "position" && selectedToken
            ? selectedToken.address
            : repayMode === "token" && collateralToken
            ? collateralToken.address
            : borrowTokenAddress) as HexAddress
        }
        decimals={
          repayMode === "position" && selectedToken
            ? selectedToken.decimals
            : repayMode === "token" && collateralToken
            ? collateralToken.decimals
            : borrowTokenDecimals
        }
        balanceType={repayMode === "token" ? "collateral" : "wallet"}
        poolAddress={
          repayMode === "token" ? (poolAddress as `0x${string}`) : undefined
        }
      />

      {showConversionCard && (
        <ConversionCard
          outputAmount={convertedAmount}
          outputSymbol={borrowSymbol || ""}
          outputLogoUrl={borrowLogoUrl}
          isLoading={isLoadingExchangeRate}
        />
      )}

      {showCollateralConversionCard && (
        <ConversionCard
          outputAmount={collateralConvertedAmount}
          outputSymbol={borrowSymbol || ""}
          outputLogoUrl={borrowLogoUrl}
          isLoading={isLoadingCollateralExchangeRate}
        />
      )}

      <StatsSection
        poolAddress={poolAddress}
        ltv={ltv}
        mode="repay"
        borrowTokenDecimals={borrowTokenDecimals}
        exchangeRate={
          repayMode === "position" && !isSameAsBorrowToken
            ? exchangeRate
            : repayMode === "token" && !isCollateralSameAsBorrowToken
            ? collateralExchangeRate
            : undefined
        }
        exchangeRateLoading={
          repayMode === "position"
            ? isLoadingExchangeRate
            : isLoadingCollateralExchangeRate
        }
        fromTokenSymbol={
          repayMode === "position" && !isSameAsBorrowToken
            ? selectedToken?.symbol
            : repayMode === "token" && !isCollateralSameAsBorrowToken
            ? collateralToken?.symbol
            : undefined
        }
        toTokenSymbol={
          (repayMode === "position" && !isSameAsBorrowToken) ||
          (repayMode === "token" && !isCollateralSameAsBorrowToken)
            ? borrowSymbol
            : undefined
        }
        inputAmount={amount}
        calculatedAmountOut={
          repayMode === "position" && !isSameAsBorrowToken
            ? exchangeRateAmount
            : repayMode === "token" && !isCollateralSameAsBorrowToken
            ? collateralExchangeRateAmount
            : undefined
        }
      />

      {errorMessage && (
        <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
      )}

      <ActionButton
        label={getButtonLabel()}
        onClick={handleAction}
        disabled={
          !amount ||
          parseFloat(amount) <= 0 ||
          isLoading ||
          (repayMode === "position" && !selectedToken) ||
          (repayMode === "position" &&
            !isSameAsBorrowToken &&
            isLoadingExchangeRate) ||
          (repayMode === "token" && !collateralToken) ||
          (repayMode === "token" &&
            !isCollateralSameAsBorrowToken &&
            isLoadingCollateralExchangeRate)
        }
        isLoading={isLoading}
      />
    </>
  );
};
