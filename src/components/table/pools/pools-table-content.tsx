import { PoolsTableRow } from "@/components/table/pools/pools-table-row";
import { PoolWithTokens } from "@/hooks/graphql/use-pools";
import { PoolRate } from "@/hooks/graphql/use-pool-rates";

interface PoolsTableContentProps {
  pools: PoolWithTokens[];
  rates?: Record<string, PoolRate>; // Change to optional object keyed by pool address
  onPoolClick: (poolAddress: string) => void;
}

export const PoolsTableContent = ({
  pools,
  rates,
  onPoolClick,
}: PoolsTableContentProps) => {
  return (
    <div className="overflow-hidden border border-neutral-800 bg-neutral-950/80">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-900/80 text-xs uppercase tracking-wide text-neutral-400">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Pool</th>
              <th className="px-4 py-3 text-right font-medium">
                Total Liquidity
              </th>
              <th className="px-4 py-3 text-right font-medium">APY</th>
              <th className="px-4 py-3 text-right font-medium">Total Borrow</th>
              <th className="px-4 py-3 text-right font-medium">Borrow APY</th>
              <th className="px-4 py-3 text-right font-medium">LTV</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/80">
            {pools.map((pool, index) => {
              const poolRate = rates?.[pool.lendingPool.toLowerCase()];

              return (
                <PoolsTableRow
                  key={pool.lendingPool}
                  pool={pool}
                  rate={poolRate}
                  index={index}
                  onClick={() => onPoolClick(pool.lendingPool)}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
