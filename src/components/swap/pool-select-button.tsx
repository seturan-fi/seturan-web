"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Loader2 } from "lucide-react";
import { PoolSelectDialog } from "./pool-select-dialog";
import type { PoolSelectButtonProps } from "./types";

const formatAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

export const PoolSelectButton = ({
  pool,
  onSelect,
  pools,
  isLoading = false,
  disabled = false,
}: PoolSelectButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={disabled || isLoading}
        className="group flex w-full items-center justify-between rounded-none border border-neutral-800 bg-neutral-900/50 px-4 py-3 text-sm transition-all hover:border-neutral-600 hover:bg-neutral-800/80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <LoadingState />
        ) : pool ? (
          <SelectedPoolState pool={pool} />
        ) : (
          <EmptyState poolCount={pools.length} />
        )}

        <div className="flex items-center gap-2">
          {pool && (
            <span className="rounded-none border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-400">
              LTV {(Number(pool.ltv) / 1e16).toFixed(0)}%
            </span>
          )}
          <ChevronDown className="h-5 w-5 text-neutral-500 transition-transform group-hover:text-neutral-300" />
        </div>
      </button>

      <PoolSelectDialog
        open={open}
        onOpenChange={setOpen}
        pools={pools}
        onSelect={onSelect}
        title="Select Pool"
      />
    </>
  );
};

const LoadingState = () => (
  <div className="flex items-center gap-3 text-neutral-400">
    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-700 bg-neutral-800">
      <Loader2 className="h-5 w-5 animate-spin" />
    </div>
    <div className="flex flex-col items-start">
      <span className="font-medium">Loading pools...</span>
      <span className="text-xs text-neutral-500">Please wait</span>
    </div>
  </div>
);

const SelectedPoolState = ({
  pool,
}: {
  pool: NonNullable<PoolSelectButtonProps["pool"]>;
}) => (
  <div className="flex items-center gap-4">
    <div className="relative flex shrink-0">
      <div className="h-10 w-10 overflow-hidden rounded-full border border-neutral-700 bg-neutral-800 shadow-lg">
        <Image
          src={pool.collateral.logoUrl}
          alt={pool.collateral.symbol}
          width={40}
          height={40}
          className="h-10 w-10 object-cover"
        />
      </div>
      <div className="-ml-3 h-10 w-10 overflow-hidden rounded-full border border-neutral-700 bg-neutral-800 shadow-lg">
        <Image
          src={pool.borrow.logoUrl}
          alt={pool.borrow.symbol}
          width={40}
          height={40}
          className="h-10 w-10 object-cover"
        />
      </div>
    </div>
    <div className="flex flex-col items-start">
      <span className="text-base font-semibold text-neutral-100">
        {pool.collateral.symbol} / {pool.borrow.symbol}
      </span>
      <span className="text-xs text-neutral-500">
        {formatAddress(pool.lendingPool)}
      </span>
    </div>
  </div>
);

const EmptyState = ({ poolCount }: { poolCount: number }) => (
  <div className="flex items-center gap-4">
    <div className="relative flex shrink-0">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-neutral-700 bg-neutral-800/50">
        <span className="text-lg text-neutral-600">?</span>
      </div>
      <div className="-ml-3 flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-neutral-700 bg-neutral-800/50">
        <span className="text-lg text-neutral-600">?</span>
      </div>
    </div>
    <div className="flex flex-col items-start">
      <span className="font-medium text-neutral-300">Select a pool</span>
      <span className="text-xs text-neutral-500">
        Choose from {poolCount} available pools
      </span>
    </div>
  </div>
);

export default PoolSelectButton;
