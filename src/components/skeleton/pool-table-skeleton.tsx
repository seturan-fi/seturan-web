import { Skeleton, SkeletonCircle } from "@/components/ui/skeleton";

export const PoolTableSkeleton = () => {
  return (
    <div className="overflow-hidden border border-neutral-800 bg-neutral-950/80">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-900/80 text-xs uppercase tracking-wide text-neutral-400">
            <tr>
              <th className="px-4 py-3 text-left font-medium">
                <Skeleton className="h-3 w-16" />
              </th>
              <th className="px-4 py-3 text-right font-medium">
                <div className="flex justify-end">
                  <Skeleton className="h-3 w-24" />
                </div>
              </th>
              <th className="px-4 py-3 text-right font-medium">
                <div className="flex justify-end">
                  <Skeleton className="h-3 w-12" />
                </div>
              </th>
              <th className="px-4 py-3 text-right font-medium">
                <div className="flex justify-end">
                  <Skeleton className="h-3 w-20" />
                </div>
              </th>
              <th className="px-4 py-3 text-right font-medium">
                <div className="flex justify-end">
                  <Skeleton className="h-3 w-16" />
                </div>
              </th>
              <th className="px-4 py-3 text-right font-medium">
                <div className="flex justify-end">
                  <Skeleton className="h-3 w-10" />
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-800/80">
            {Array.from({ length: 5 }).map((_, index) => (
              <tr
                key={index}
                className="group transition-colors hover:bg-neutral-900/40"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-8 w-8 items-center">
                      <SkeletonCircle className="absolute left-0 z-10 h-8 w-8 ring-2 ring-neutral-950" />
                      <SkeletonCircle className="absolute left-4 h-8 w-8 ring-2 ring-neutral-950" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Skeleton className="ml-2 h-4 w-24" />
                      <Skeleton className="ml-2 h-3 w-20" />
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4 text-right">
                  <div className="flex flex-col items-end gap-1.5">
                    <Skeleton className="h-4 w-20" />
                  </div>
                </td>

                <td className="px-4 py-4 text-right">
                  <div className="flex justify-end">
                    <Skeleton className="h-4 w-16" />
                  </div>
                </td>

                <td className="px-4 py-4 text-right">
                  <div className="flex flex-col items-end gap-1.5">
                    <Skeleton className="h-4 w-20" />
                  </div>
                </td>

                <td className="px-4 py-4 text-right">
                  <div className="flex justify-end">
                    <Skeleton className="h-4 w-16" />
                  </div>
                </td>

                <td className="px-4 py-4 text-right">
                  <div className="flex justify-end">
                    <Skeleton className="h-4 w-12" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
