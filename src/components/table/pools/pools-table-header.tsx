"use client";

import { CreatePoolButton } from "@/components/pools/create-pool-dialog";

interface PoolsTableHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export const PoolsTableHeader = ({
  search,
  onSearchChange,
}: PoolsTableHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex flex-1 items-center gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by pair or address..."
          className="h-9 w-full max-w-xs rounded-none border border-neutral-700 bg-neutral-950 px-3 text-xs text-neutral-100 outline-none placeholder:text-neutral-600 transition-colors focus:border-neutral-600"
          aria-label="Search pools"
        />
      </div>
      <CreatePoolButton />
    </div>
  );
};
