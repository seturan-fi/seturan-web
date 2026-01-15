"use client";

import { HistoryTableRow } from "./history-table-row";
import type { HistoryItem } from "@/hooks/graphql/use-history";

interface HistoryTableProps {
  items: HistoryItem[];
}

export const HistoryTable = ({ items }: HistoryTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-neutral-800 bg-neutral-950/60">
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
              Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
              Pool
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
              Amount
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
              User
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
              Chain
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
              Time
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
              Transaction
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/50">
          {items.map((item) => (
            <HistoryTableRow key={item.id} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
