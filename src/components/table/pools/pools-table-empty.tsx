interface PoolsTableEmptyProps {
  message?: string;
}

export const PoolsTableEmpty = ({
  message = "No pools available.",
}: PoolsTableEmptyProps) => {
  return (
    <div className="border border-neutral-800 bg-neutral-950 p-6 text-sm text-neutral-400">
      {message}
    </div>
  );
};
