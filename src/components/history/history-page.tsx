"use client";

import { useMemo, useState } from "react";
import { Search, Filter } from "lucide-react";
import { useHistory, type TransactionType } from "@/hooks/graphql/use-history";
import { HistoryTable } from "./history-table";
import { HistoryTableSkeleton } from "@/components/skeleton/history-table-skeleton";
import { HistoryTableEmpty } from "./history-table-empty";
import { HistoryTableError } from "./history-table-error";

const FILTER_OPTIONS: { value: TransactionType | "all"; label: string }[] = [
  { value: "all", label: "All Transactions" },
  { value: "supply_collateral", label: "Supply Collateral" },
  { value: "supply_liquidity", label: "Supply Liquidity" },
  { value: "withdraw_collateral", label: "Withdraw Collateral" },
  { value: "withdraw_liquidity", label: "Withdraw Liquidity" },
  { value: "borrow", label: "Borrow" },
  { value: "repay", label: "Repay" },
  { value: "crosschain_borrow", label: "Cross-Chain Borrow" },
  { value: "liquidation", label: "Liquidation" },
];

export const HistoryPage = () => {
  const { data, isLoading, isError, error } = useHistory();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TransactionType | "all">("all");

  const filteredData = useMemo(() => {
    if (!data) return [];

    let result = data;

    // Apply type filter
    if (filter !== "all") {
      result = result.filter((item) => item.type === filter);
    }

    // Apply search
    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter((item) => {
        const poolPair = item.pool
          ? `${item.pool.collateral.symbol}/${item.pool.borrow.symbol}`.toLowerCase()
          : "";
        return (
          item.user.toLowerCase().includes(query) ||
          item.txHash.toLowerCase().includes(query) ||
          item.lendingPoolAddress.toLowerCase().includes(query) ||
          poolPair.includes(query)
        );
      });
    }

    return result;
  }, [data, search, filter]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-50">
          Transaction History
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          View all lending pool transactions on Mantle Sepolia
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by address or tx hash..."
              className="h-9 w-full rounded-none border border-neutral-700 bg-neutral-950 pl-10 pr-3 text-xs text-neutral-100 outline-none placeholder:text-neutral-600 transition-colors focus:border-neutral-600"
              aria-label="Search transactions"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as TransactionType | "all")}
              className="h-9 appearance-none rounded-none border border-neutral-700 bg-neutral-950 pl-10 pr-8 text-xs text-neutral-100 outline-none transition-colors focus:border-neutral-600"
              aria-label="Filter by type"
            >
              {FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {data && (
          <div className="text-sm text-neutral-500">
            {filteredData.length} of {data.length} transactions
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-none border border-neutral-800 bg-neutral-950/50">
        {isLoading ? (
          <HistoryTableSkeleton />
        ) : isError ? (
          <HistoryTableError error={error} />
        ) : !data || data.length === 0 ? (
          <HistoryTableEmpty />
        ) : filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-sm text-neutral-500">
              No transactions match your search criteria
            </p>
          </div>
        ) : (
          <HistoryTable items={filteredData} />
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
