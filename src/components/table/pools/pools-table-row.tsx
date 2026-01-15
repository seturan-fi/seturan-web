"use client";

import Image from "next/image";
import { formatUnits } from "viem";
import { formatCompactNumber, formatLtvFromRaw } from "@/lib/format/pool";
import {
  PoolRate,
  formatApy,
  formatInterestRate,
} from "@/hooks/graphql/use-pool-rates";

interface PoolData {
  lendingPool: string;
  collateral: {
    symbol: string;
    logoUrl: string;
    decimals: number;
  };
  borrow: {
    symbol: string;
    logoUrl: string;
    decimals: number;
  };
  ltv: string;
}

interface PoolsTableRowProps {
  pool: PoolData;
  rate?: PoolRate;
  index: number;
  onClick: () => void;
}

export const PoolsTableRow = ({
  pool,
  rate,
  index,
  onClick,
}: PoolsTableRowProps) => {

  const borrowDecimals = pool.borrow.decimals;

  const totalLiquidity = rate?.totalSupplyAssets
    ? parseFloat(formatUnits(BigInt(rate.totalSupplyAssets), borrowDecimals))
    : 1_000_000 + index * 50_000;

  const totalBorrow = rate?.totalBorrowAssets
    ? parseFloat(formatUnits(BigInt(rate.totalBorrowAssets), borrowDecimals))
    : 400_000 + index * 25_000;

  const apy = rate?.apy ? formatInterestRate(rate.apy) : 4 + index * 0.2;

  const borrowApy = rate?.borrowRate
    ? formatInterestRate(rate.borrowRate)
    : 6 + index * 0.25;

  return (
    <tr
      className="cursor-pointer bg-neutral-950/40 transition-colors hover:bg-neutral-900/70"
      onClick={onClick}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-12">
            <div className="absolute left-0 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full border border-neutral-900 bg-neutral-950">
              <Image
                src={pool.collateral.logoUrl}
                alt={pool.collateral.symbol}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full"
              />
            </div>
            <div className="absolute right-0 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full border border-neutral-900 bg-neutral-950">
              <Image
                src={pool.borrow.logoUrl}
                alt={pool.borrow.symbol}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold text-neutral-50">
              {pool.collateral.symbol} / {pool.borrow.symbol}
            </span>
            <span className="text-[11px] text-neutral-500">
              {pool.lendingPool.slice(0, 6)}...
              {pool.lendingPool.slice(-4)}
            </span>
          </div>
        </div>
      </td>

      <td className="px-4 py-3 text-right text-neutral-100">
        ${formatCompactNumber(totalLiquidity)}
      </td>

      <td className="px-4 py-3 text-right text-emerald-400">
        {apy.toFixed(2)}%
      </td>

      <td className="px-4 py-3 text-right text-neutral-100">
        ${formatCompactNumber(totalBorrow)}
      </td>

      <td className="px-4 py-3 text-right text-sky-400">
        {borrowApy.toFixed(2)}%
      </td>

      <td className="px-4 py-3 text-right text-neutral-200">
        {formatLtvFromRaw(pool.ltv)}
      </td>
    </tr>
  );
};
