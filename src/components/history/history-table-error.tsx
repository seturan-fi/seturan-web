"use client";

import { AlertCircle } from "lucide-react";

interface HistoryTableErrorProps {
  error: Error | null;
}

export const HistoryTableError = ({ error }: HistoryTableErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
        <AlertCircle className="h-8 w-8 text-red-400" />
      </div>
      <h3 className="mb-2 text-lg font-medium text-neutral-200">
        Failed to load history
      </h3>
      <p className="max-w-sm text-center text-sm text-neutral-500">
        {error?.message || "An error occurred while fetching transaction history."}
      </p>
    </div>
  );
};
