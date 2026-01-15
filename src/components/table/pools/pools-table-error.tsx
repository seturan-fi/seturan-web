interface PoolsTableErrorProps {
  error?: Error | null;
}

export const PoolsTableError = ({ error }: PoolsTableErrorProps) => {
  return (
    <div className="space-y-2 border border-red-800/60 bg-red-950/40 p-6 text-sm text-red-300">
      <div>
        Failed to load pools. Please check your NEXT_PUBLIC_POOL_API
        configuration.
      </div>
      {error && (
        <pre className="max-w-full overflow-x-auto whitespace-pre-wrap wrap-break-word text-[11px] text-red-200/80">
          {error.message}
        </pre>
      )}
    </div>
  );
};
