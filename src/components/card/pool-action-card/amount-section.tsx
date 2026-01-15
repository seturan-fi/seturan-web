import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useUserWalletBalance } from "@/hooks/balance/use-user-token-balance";
import { useReadUserCollateralBalance } from "@/hooks/balance/use-user-collateral-balance";
import { useReadUserSupplyBalance } from "@/hooks/balance/use-user-supply-balance";

interface AmountSectionProps {
  actionLabel: string;
  assetSymbol: string;
  assetLogoUrl?: string;
  amount: string;
  onAmountChange: (value: string) => void;
  tokenAddress: `0x${string}`;
  decimals: number;
  onMaxClick?: () => void;
  poolAddress?: `0x${string}`;
  balanceType?: "wallet" | "collateral" | "supply";
}

export const AmountSection = ({
  actionLabel,
  assetSymbol,
  assetLogoUrl,
  amount,
  onAmountChange,
  tokenAddress,
  decimals,
  onMaxClick,
  poolAddress,
  balanceType = "wallet",
}: AmountSectionProps) => {
  const { userWalletBalanceFormatted, walletBalanceLoading } =
    useUserWalletBalance(tokenAddress, decimals);

  const { userCollateralBalanceFormatted, userCollateralBalanceLoading } =
    useReadUserCollateralBalance(
      poolAddress || ("0x0000000000000000000000000000000000000000" as `0x${string}`),
      tokenAddress,
      decimals
    );

  const { userSupplyBalanceFormatted, userSupplyBalanceLoading } =
    useReadUserSupplyBalance(
      poolAddress || ("0x0000000000000000000000000000000000000000" as `0x${string}`),
      tokenAddress,
      decimals
    );

  // Select the appropriate balance based on balanceType
  const displayBalance =
    balanceType === "collateral"
      ? userCollateralBalanceFormatted
      : balanceType === "supply"
        ? userSupplyBalanceFormatted
        : userWalletBalanceFormatted;

  const isBalanceLoading =
    balanceType === "collateral"
      ? userCollateralBalanceLoading
      : balanceType === "supply"
        ? userSupplyBalanceLoading
        : walletBalanceLoading;

  const balanceLabel =
    balanceType === "collateral"
      ? "Collateral"
      : balanceType === "supply"
        ? "Supply"
        : "Wallet";

  const handleMaxClick = () => {
    if (onMaxClick) {
      onMaxClick();
    } else {
      onAmountChange(displayBalance || "0");
    }
  };

  return (
    <div className="pool-card-section space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-200">
          {actionLabel} {assetSymbol}
        </span>
        {assetLogoUrl && (
          <Image
            src={assetLogoUrl}
            alt={assetSymbol}
            width={24}
            height={24}
            className="h-6 w-6 rounded-full"
          />
        )}
      </div>

      <div className="flex items-baseline justify-between gap-3">
        <input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="0.00"
          className="pool-card-input"
        />
        <Button
          type="button"
          onClick={handleMaxClick}
          className="btn-secondary"
        >
          MAX
        </Button>
      </div>

      <span className="text-[11px] text-neutral-500">
        {balanceLabel}:{" "}
        {isBalanceLoading
          ? "Loading..."
          : `${displayBalance} ${assetSymbol}`}
      </span>
    </div>
  );
};
