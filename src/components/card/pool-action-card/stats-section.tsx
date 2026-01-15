import {
  usePoolRateByAddress,
  formatInterestRate,
} from "@/hooks/graphql/use-pool-rates";
import { useReadUserCollateralBalance } from "@/hooks/balance/use-user-collateral-balance";
import { useReadUserSupplyBalance } from "@/hooks/balance/use-user-supply-balance";
import { useReadUserBorrowShares } from "@/hooks/balance/use-user-borrow-shares";
import { usePoolRouter } from "@/hooks/graphql/use-position";

interface StatsSectionProps {
  poolAddress: string;
  ltv: string;
  mode?:
    | "supply-liquidity"
    | "supply-collateral"
    | "withdraw-liquidity"
    | "withdraw-collateral"
    | "borrow"
    | "repay";
  tokenAddress?: string;
  tokenSymbol?: string;
  tokenDecimals?: number;
  maxBorrowAmount?: string;
  borrowSymbol?: string;
  borrowTokenDecimals?: number;
  exchangeRate?: number | null;
  exchangeRateLoading?: boolean;
  fromTokenSymbol?: string;
  toTokenSymbol?: string;
  inputAmount?: string;
  calculatedAmountOut?: string | null;
}

export const StatsSection = ({
  poolAddress,
  ltv,
  mode,
  tokenAddress,
  tokenSymbol,
  tokenDecimals = 18,
  maxBorrowAmount,
  borrowSymbol,
  borrowTokenDecimals = 18,
  exchangeRate,
  exchangeRateLoading = false,
  fromTokenSymbol,
  toTokenSymbol,
  inputAmount,
  calculatedAmountOut,
}: StatsSectionProps) => {
  const { data: poolRate } = usePoolRateByAddress(poolAddress);
  const { data: routerAddress } = usePoolRouter(poolAddress);

  const supplyApy = poolRate?.apy ? formatInterestRate(poolRate.apy) : 0;

  // Fetch collateral balance for supply/withdraw collateral
  const { userCollateralBalanceFormatted, userCollateralBalanceLoading } =
    useReadUserCollateralBalance(
      poolAddress as `0x${string}`,
      (tokenAddress as `0x${string}`) ||
        "0x0000000000000000000000000000000000000000",
      tokenDecimals
    );

  // Fetch supply balance for supply/withdraw liquidity
  const { userSupplyBalanceFormatted, userSupplyBalanceLoading } =
    useReadUserSupplyBalance(
      poolAddress as `0x${string}`,
      (tokenAddress as `0x${string}`) ||
        "0x0000000000000000000000000000000000000000",
      tokenDecimals
    );

  // Fetch borrow shares for borrow/repay modes
  const { borrowSharesFormatted, isLoadingBorrowShares } =
    useReadUserBorrowShares(
      routerAddress as `0x${string}` | undefined,
      borrowTokenDecimals
    );

  // Determine which balance to show based on mode
  const showCollateralBalance =
    mode === "supply-collateral" || mode === "withdraw-collateral";
  const showSupplyBalance =
    mode === "supply-liquidity" || mode === "withdraw-liquidity";

  const balance = showCollateralBalance
    ? userCollateralBalanceFormatted
    : showSupplyBalance
    ? userSupplyBalanceFormatted
    : null;

  const balanceLoading = showCollateralBalance
    ? userCollateralBalanceLoading
    : showSupplyBalance
    ? userSupplyBalanceLoading
    : false;

  const balanceLabel = showCollateralBalance
    ? "Your Collateral"
    : showSupplyBalance
    ? "Your Supply"
    : null;

  // Show interest rate (borrow APY) for borrow and repay modes
  const showInterestRate = mode === "borrow" || mode === "repay";
  const interestRate = poolRate?.borrowRate
    ? formatInterestRate(poolRate.borrowRate)
    : 0;

  return (
    <div className="space-y-1 border border-neutral-800 bg-neutral-900 p-3 text-[11px] text-neutral-400">
      {showInterestRate ? (
        <>
          {maxBorrowAmount && (
            <div className="flex items-center justify-between">
              <span>Max Borrow Amount</span>
              <span className="font-medium text-neutral-100">
                {maxBorrowAmount} {borrowSymbol}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span>Your Borrow</span>
            <span className="font-medium text-amber-400">
              {isLoadingBorrowShares ? "Loading..." : borrowSharesFormatted}
            </span>
          </div>
          {exchangeRate !== undefined && fromTokenSymbol && toTokenSymbol && (
            <div className="flex items-center justify-between">
              <span>Exchange Rate</span>
              <span className="font-medium text-cyan-400">
                {exchangeRateLoading
                  ? "Loading..."
                  : calculatedAmountOut && inputAmount && parseFloat(inputAmount) > 0
                  ? `${inputAmount} ${fromTokenSymbol} = ${calculatedAmountOut} ${toTokenSymbol}`
                  : exchangeRate
                  ? `1 ${fromTokenSymbol} = ${exchangeRate.toFixed(6)} ${toTokenSymbol}`
                  : "N/A"}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span>Interest Rate</span>
            <span className="font-medium text-sky-400">
              {interestRate.toFixed(2)}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>LTV</span>
            <span className="font-medium text-neutral-100">{ltv}</span>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <span>Supply APY</span>
            <span className="font-medium text-emerald-400">
              {supplyApy.toFixed(2)}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>LTV</span>
            <span className="font-medium text-neutral-100">{ltv}</span>
          </div>
          {balanceLabel && (
            <div className="flex items-center justify-between">
              <span>{balanceLabel}</span>
              <span className="font-medium text-neutral-100">
                {balanceLoading
                  ? "Loading..."
                  : `${balance} ${tokenSymbol || ""}`}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};
