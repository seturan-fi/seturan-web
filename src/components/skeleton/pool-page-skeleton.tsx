"use client";

import { PageContainer } from "@/components/layout/page-container";

const SkeletonBox = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-neutral-800 ${className}`} />
);

const PoolHeaderSkeleton = () => (
  <header className="flex flex-wrap items-center justify-between gap-4">
    <div className="flex items-center gap-4">
      {/* Token pair icons */}
      <div className="relative h-12 w-16">
        <div className="absolute left-0 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full border border-neutral-800 bg-neutral-900">
          <SkeletonBox className="h-12 w-12 rounded-full" />
        </div>
        <div className="absolute right-0 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full border border-neutral-800 bg-neutral-900">
          <SkeletonBox className="h-12 w-12 rounded-full" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {/* Pool name */}
        <SkeletonBox className="h-6 w-40 rounded-none" />
        {/* Pool address */}
        <SkeletonBox className="h-3 w-80 rounded-none" />
        {/* Router and Position */}
        <div className="mt-1 space-y-1">
          <SkeletonBox className="h-3 w-32 rounded-none" />
          <SkeletonBox className="h-3 w-28 rounded-none" />
        </div>
      </div>
    </div>
  </header>
);

const StatItemSkeleton = ({ valueWidth = "w-20" }: { valueWidth?: string }) => (
  <div>
    <SkeletonBox className="h-3 w-24 rounded-none" />
    <SkeletonBox className={`mt-2 h-5 ${valueWidth} rounded-none`} />
  </div>
);

const PoolStatsGridSkeleton = () => (
  <div className="grid gap-4 border border-neutral-800 bg-neutral-950/80 p-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
    <StatItemSkeleton valueWidth="w-24" />
    <StatItemSkeleton valueWidth="w-20" />
    <StatItemSkeleton valueWidth="w-14" />
    <StatItemSkeleton valueWidth="w-28" />
    <StatItemSkeleton valueWidth="w-14" />
    <StatItemSkeleton valueWidth="w-16" />
  </div>
);

const InterestRateChartSkeleton = () => (
  <div className="space-y-6 border border-neutral-800 bg-neutral-950/80 p-6">
    {/* Title */}
    <div>
      <SkeletonBox className="h-6 w-48 rounded-none" />
      <SkeletonBox className="mt-3 h-4 w-28 rounded-none" />
      <SkeletonBox className="mt-2 h-10 w-32 rounded-none" />
    </div>

    {/* Legend */}
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <SkeletonBox className="h-3 w-3 rounded-full" />
        <SkeletonBox className="h-3 w-32 rounded-none" />
      </div>
      <div className="flex items-center gap-2">
        <SkeletonBox className="h-3 w-3 rounded-full" />
        <SkeletonBox className="h-3 w-28 rounded-none" />
      </div>
    </div>

    {/* Chart area */}
    <div className="h-80 w-full">
      <div className="relative h-full w-full">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 flex h-full flex-col justify-between py-4">
          <SkeletonBox className="h-3 w-8 rounded-none" />
          <SkeletonBox className="h-3 w-8 rounded-none" />
          <SkeletonBox className="h-3 w-8 rounded-none" />
          <SkeletonBox className="h-3 w-8 rounded-none" />
          <SkeletonBox className="h-3 w-8 rounded-none" />
        </div>
        
        {/* Chart grid and line skeleton */}
        <div className="ml-12 h-full border-b border-l border-neutral-800">
          <div className="relative h-full w-full overflow-hidden">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-t border-neutral-800/50" />
              ))}
            </div>
            {/* Fake line chart */}
            <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
              <path
                d="M 0 240 L 180 235 L 360 230 L 450 200 L 540 100 L 600 20"
                fill="none"
                stroke="#3f3f46"
                strokeWidth="3"
                className="animate-pulse"
              />
            </svg>
          </div>
        </div>
        
        {/* X-axis labels */}
        <div className="ml-12 mt-2 flex justify-between">
          <SkeletonBox className="h-3 w-6 rounded-none" />
          <SkeletonBox className="h-3 w-8 rounded-none" />
          <SkeletonBox className="h-3 w-8 rounded-none" />
          <SkeletonBox className="h-3 w-8 rounded-none" />
          <SkeletonBox className="h-3 w-10 rounded-none" />
        </div>
      </div>
    </div>

    {/* Bottom stats */}
    <div className="grid grid-cols-3 gap-4 pt-4">
      <div>
        <SkeletonBox className="h-3 w-28 rounded-none" />
        <SkeletonBox className="mt-2 h-6 w-16 rounded-none" />
      </div>
      <div>
        <SkeletonBox className="h-3 w-20 rounded-none" />
        <SkeletonBox className="mt-2 h-6 w-14 rounded-none" />
      </div>
      <div>
        <SkeletonBox className="h-3 w-24 rounded-none" />
        <SkeletonBox className="mt-2 h-6 w-16 rounded-none" />
      </div>
    </div>
  </div>
);

const ActionCardSkeleton = () => (
  <div className="flex h-full w-104 flex-col rounded-none border border-neutral-800 bg-neutral-950 p-4">
    {/* Tabs */}
    <div className="flex gap-2 mb-4">
      <SkeletonBox className="h-9 w-20 rounded-none" />
      <SkeletonBox className="h-9 w-20 rounded-none" />
      <SkeletonBox className="h-9 w-20 rounded-none" />
      <SkeletonBox className="h-9 w-24 rounded-none" />
    </div>

    {/* Sub tabs */}
    <div className="flex gap-2 mb-4">
      <SkeletonBox className="h-8 w-32 rounded-none" />
      <SkeletonBox className="h-8 w-36 rounded-none" />
    </div>

    {/* Input section */}
    <div className="flex flex-col gap-3">
      {/* Token label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SkeletonBox className="h-4 w-16 rounded-none" />
          <SkeletonBox className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* Amount input */}
      <div className="flex items-center justify-between border border-neutral-800 bg-neutral-900 p-3">
        <SkeletonBox className="h-8 w-32 rounded-none" />
        <SkeletonBox className="h-8 w-14 rounded-none" />
      </div>

      {/* Wallet balance */}
      <SkeletonBox className="h-3 w-36 rounded-none" />

      {/* Info rows */}
      <div className="mt-4 space-y-3 border-t border-neutral-800 pt-4">
        <div className="flex items-center justify-between">
          <SkeletonBox className="h-3 w-20 rounded-none" />
          <SkeletonBox className="h-3 w-16 rounded-none" />
        </div>
        <div className="flex items-center justify-between">
          <SkeletonBox className="h-3 w-12 rounded-none" />
          <SkeletonBox className="h-3 w-14 rounded-none" />
        </div>
        <div className="flex items-center justify-between">
          <SkeletonBox className="h-3 w-24 rounded-none" />
          <SkeletonBox className="h-3 w-24 rounded-none" />
        </div>
      </div>

      {/* Action button */}
      <SkeletonBox className="mt-4 h-12 w-full rounded-none" />
    </div>
  </div>
);

export const PoolPageSkeleton = () => {
  return (
    <PageContainer>
      <div className="flex flex-col gap-8 lg:flex-row">
        <section className="flex-1 space-y-8">
          <PoolHeaderSkeleton />
          <PoolStatsGridSkeleton />
          <InterestRateChartSkeleton />
        </section>

        <aside className="w-full shrink-0 lg:w-104">
          <div className="sticky top-24">
            <ActionCardSkeleton />
          </div>
        </aside>
      </div>
    </PageContainer>
  );
};

export default PoolPageSkeleton;
