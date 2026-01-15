"use client";

export const HistoryTableSkeleton = () => {
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
          {Array.from({ length: 8 }).map((_, i) => (
            <tr key={i} className="bg-neutral-950/40">
              <td className="px-4 py-4">
                <div className="h-6 w-28 animate-pulse rounded-none bg-neutral-800" />
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-12 animate-pulse rounded-full bg-neutral-800" />
                  <div className="space-y-1">
                    <div className="h-4 w-24 animate-pulse rounded-none bg-neutral-800" />
                    <div className="h-3 w-20 animate-pulse rounded-none bg-neutral-800" />
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="space-y-1">
                  <div className="h-4 w-20 animate-pulse rounded-none bg-neutral-800" />
                  <div className="h-3 w-12 animate-pulse rounded-none bg-neutral-800" />
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="h-4 w-24 animate-pulse rounded-none bg-neutral-800" />
              </td>
              <td className="px-4 py-4">
                <div className="h-4 w-24 animate-pulse rounded-none bg-neutral-800" />
              </td>
              <td className="px-4 py-4">
                <div className="h-4 w-32 animate-pulse rounded-none bg-neutral-800" />
              </td>
              <td className="px-4 py-4">
                <div className="h-4 w-28 animate-pulse rounded-none bg-neutral-800" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
