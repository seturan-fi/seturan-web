interface StatItemProps {
  label: string;
  value: React.ReactNode;
  isLoading?: boolean;
  valueClassName?: string;
}

const StatItem = ({
  label,
  value,
  isLoading,
  valueClassName = "text-neutral-50",
}: StatItemProps) => (
  <div>
    <div className="text-xs text-neutral-500">{label}</div>
    <div className={`mt-1 text-base font-semibold ${valueClassName}`}>
      {isLoading ? <span className="text-neutral-500">Loading...</span> : value}
    </div>
  </div>
);

interface PoolStatsGridProps {
  totalLiquidity: string;
  totalBorrow: string;
  ltv: string;
  supplyApy: string;
  totalSupplyAssets: string;
  liquidationThreshold: string;
  borrowSymbol: string;
  totalSupplyAssetsLoading?: boolean;
}

export const PoolStatsGrid = ({
  totalLiquidity,
  totalBorrow,
  ltv,
  supplyApy,
  totalSupplyAssets,
  liquidationThreshold,
  borrowSymbol,
  totalSupplyAssetsLoading,
}: PoolStatsGridProps) => (
  <div className="grid gap-4 border border-neutral-800 bg-neutral-950/80 p-4 text-sm text-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
    <StatItem label="Total Liquidity" value={`$${totalLiquidity}`} />
    <StatItem label="Total Borrow" value={`$${totalBorrow}`} />
    <StatItem label="LTV" value={ltv} />
    <StatItem
      label="Total Supply Assets"
      value={`${totalSupplyAssets} ${borrowSymbol}`}
      isLoading={totalSupplyAssetsLoading}
      valueClassName="text-emerald-400"
    />
    <StatItem
      label="Liquidation Threshold"
      value={liquidationThreshold}
      valueClassName="text-amber-400"
    />
    <StatItem
      label="Supply APY"
      value={`${supplyApy}%`}
      valueClassName="text-emerald-400"
    />
  </div>
);
