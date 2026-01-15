"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { PoolsTableContainer } from "@/components/table/pools/pools-table-container";
import { PoolsTableContent } from "@/components/table/pools/pools-table-content";
import { PoolsTableError } from "@/components/table/pools/pools-table-error";
import { PoolsTableEmpty } from "@/components/table/pools/pools-table-empty";
import { PoolTableSkeleton } from "@/components/skeleton/pool-table-skeleton";
import { usePools } from "@/hooks/graphql/use-pools";
import { useMultiplePoolRates } from "@/hooks/graphql/use-pool-rates";

export const PoolsTable = () => {
  const router = useRouter();
  const { data, isLoading, isError, error } = usePools();
  const [search, setSearch] = useState("");

  const poolAddresses = useMemo(() => {
    return data?.map((pool) => pool.lendingPool) || [];
  }, [data]);

  const { data: rates, isLoading: isLoadingRates } = useMultiplePoolRates(poolAddresses);

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!data) return [];
    if (!query) return data;

    return data.filter((pool) => {
      const pair =
        `${pool.collateral.symbol}/${pool.borrow.symbol}`.toLowerCase();
      const address = pool.lendingPool.toLowerCase();
      return pair.includes(query) || address.includes(query);
    });
  }, [data, search]);

  const handlePoolClick = (poolAddress: string) => {
    router.push(`/dashboard/${poolAddress}`);
  };

  if (isLoading || isLoadingRates) {
    return (
      <PoolsTableContainer search={search} onSearchChange={setSearch}>
        <PoolTableSkeleton />
      </PoolsTableContainer>
    );
  }

  if (isError) {
    return (
      <PoolsTableContainer search={search} onSearchChange={setSearch}>
        <PoolsTableError error={error} />
      </PoolsTableContainer>
    );
  }

  if (!data || data.length === 0) {
    return (
      <PoolsTableContainer search={search} onSearchChange={setSearch}>
        <PoolsTableEmpty />
      </PoolsTableContainer>
    );
  }

  return (
    <PoolsTableContainer search={search} onSearchChange={setSearch}>
      <PoolsTableContent
        pools={filteredData}
        rates={rates}
        onPoolClick={handlePoolClick}
      />
    </PoolsTableContainer>
  );
};

export default PoolsTable;
