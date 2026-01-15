import { ReactNode } from "react";
import { PoolsTableHeader } from "@/components/table/pools/pools-table-header";

interface PoolsTableContainerProps {
  search: string;
  onSearchChange: (value: string) => void;
  children: ReactNode;
}

export const PoolsTableContainer = ({
  search,
  onSearchChange,
  children,
}: PoolsTableContainerProps) => {
  return (
    <div className="mt-8 space-y-3">
      <PoolsTableHeader search={search} onSearchChange={onSearchChange} />
      {children}
    </div>
  );
};
