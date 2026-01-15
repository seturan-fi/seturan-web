"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import CardSupply from "@/components/card/supply-card";
import { usePoolByAddress } from "@/hooks/graphql/use-pools";
import { usePosition, usePoolRouter } from "@/hooks/graphql/use-position";
import { formatCompactNumber, formatLtvFromRaw } from "@/lib/format/pool";
import { PageContainer } from "@/components/layout/page-container";
import { useReadTotalSupplyAssets } from "@/hooks/balance/use-total-supply-assets";
import { PoolStatsGrid } from "./pool-stats-grid";
import { PoolPageSkeleton } from "@/components/skeleton/pool-page-skeleton";
import {
  usePoolRateByAddress,
  formatTotalSupply,
  formatTotalBorrow,
  formatInterestRate,
} from "@/hooks/graphql/use-pool-rates";
import { InterestRateChart } from "@/components/interest-rate-model";

export const PoolPage = () => {
  const params = useParams<{ poolAddress: string }>();
  const poolAddress = params.poolAddress;

  const {
    data: pool,
    isLoading: isPoolLoading,
    isError,
  } = usePoolByAddress(poolAddress);
  const { data: poolRate, isLoading: isRatesLoading } =
    usePoolRateByAddress(poolAddress);
  const { data: position } = usePosition(pool?.lendingPool);
  const { data: publicRouterAddress } = usePoolRouter(pool?.lendingPool);

  const isLoading = isPoolLoading || isRatesLoading;

  const { totalSupplyAssetsFormatted, totalSupplyAssetsLoading } =
    useReadTotalSupplyAssets(
      pool?.lendingPool as `0x${string}`,
      pool?.borrow.decimals || 18,
      publicRouterAddress || undefined
    );

  if (isLoading) {
    return <PoolPageSkeleton />;
  }

  if (isError || !pool) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-red-300 lg:px-8">
        Pool not found.
      </div>
    );
  }

  const borrowDecimals = pool.borrow.decimals;
  const totalLiquidity = poolRate?.totalSupplyAssets
    ? formatTotalSupply(poolRate.totalSupplyAssets, borrowDecimals)
    : 0;
  const totalBorrow = poolRate?.totalBorrowAssets
    ? formatTotalBorrow(poolRate.totalBorrowAssets, borrowDecimals)
    : 0;
  const supplyApy = poolRate?.apy ? formatInterestRate(poolRate.apy) : 0;

  const truncateAddress = (addr: string) => `${addr.slice(0, 10)}...`;

  return (
    <PageContainer>
      <div className="flex flex-col gap-8 lg:flex-row">
        <section className="flex-1 space-y-8">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-16">
                <div className="absolute left-0 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full border border-neutral-800 bg-neutral-950">
                  <Image
                    src={pool.collateral.logoUrl}
                    alt={pool.collateral.symbol}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full"
                  />
                </div>
                <div className="absolute right-0 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full border border-neutral-800 bg-neutral-950">
                  <Image
                    src={pool.borrow.logoUrl}
                    alt={pool.borrow.symbol}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <h1 className="text-xl font-semibold text-neutral-50">
                  {pool.collateral.symbol} / {pool.borrow.symbol}
                </h1>
                <p className="text-xs text-neutral-500">
                  Pool address: {pool.lendingPool}
                </p>
                <div className="mt-1 space-y-0.5 text-xs text-neutral-600">
                  <p title={publicRouterAddress || "Loading..."}>
                    Router:{" "}
                    {publicRouterAddress
                      ? truncateAddress(publicRouterAddress)
                      : "Loading..."}
                  </p>
                  {position && (
                    <p title={position.position}>
                      Position: {truncateAddress(position.position)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </header>

          <PoolStatsGrid
            totalLiquidity={formatCompactNumber(totalLiquidity)}
            totalBorrow={formatCompactNumber(totalBorrow)}
            ltv={formatLtvFromRaw(pool.ltv)}
            supplyApy={supplyApy.toFixed(2)}
            totalSupplyAssets={totalSupplyAssetsFormatted}
            liquidationThreshold={formatLtvFromRaw(pool.liquidationThreshold)}
            borrowSymbol={pool.borrow.symbol}
            totalSupplyAssetsLoading={totalSupplyAssetsLoading}
          />

          {/* Interest Rate Model Chart */}
          {poolRate && (
            <InterestRateChart
              baseRate={poolRate.lendingPoolBaseRate}
              optimalUtilization={poolRate.lendingPoolOptimalUtilization}
              rateAtOptimal={poolRate.lendingPoolRateAtOptimal}
              maxRate={poolRate.lendingPoolMaxRate}
              currentUtilization={poolRate.utilizationRate}
              currentBorrowRate={poolRate.borrowRate}
              reserveFactor={poolRate.tokenReserveFactor}
            />
          )}
        </section>

        <aside className="w-full shrink-0 lg:w-104">
          <div className="sticky top-24">
            <CardSupply
              poolAddress={pool.lendingPool}
              collateralTokenAddress={pool.collateral.address}
              borrowTokenAddress={pool.borrow.address}
              collateralSymbol={pool.collateral.symbol}
              borrowSymbol={pool.borrow.symbol}
              collateralLogoUrl={pool.collateral.logoUrl}
              borrowLogoUrl={pool.borrow.logoUrl}
              borrowTokenDecimals={pool.borrow.decimals}
              collateralTokenDecimals={pool.collateral.decimals}
              ltv={formatLtvFromRaw(pool.ltv)}
            />
          </div>
        </aside>
      </div>
    </PageContainer>
  );
};
