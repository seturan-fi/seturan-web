import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-linear-to-r from-neutral-800 via-neutral-700 to-neutral-800 bg-size-[200%_100%] animate-pulse animate-shimmer rounded-md",
        className
      )}
      {...props}
    />
  );
}


function SkeletonCircle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton-circle"
      className={cn(
        "bg-linear-to-br from-neutral-700 to-neutral-800 animate-pulse rounded-full",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton, SkeletonCircle };
