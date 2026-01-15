import type { ChartDataPoint } from "./types";

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartDataPoint }>;
}

export const ChartTooltip = ({ active, payload }: TooltipProps) => {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;

  return (
    <div className="rounded-lg border border-neutral-700 bg-neutral-900 p-3 shadow-lg">
      <p className="text-xs font-medium text-neutral-400">
        Utilization: <span className="text-neutral-200">{data.utilization.toFixed(2)}%</span>
      </p>
      <p className="text-xs font-medium text-pink-400">
        Borrow APR: <span className="text-pink-300">{data.borrowRate.toFixed(2)}%</span>
      </p>
      <p className="text-xs font-medium text-emerald-400">
        Supply APR: <span className="text-emerald-300">{data.supplyRate.toFixed(2)}%</span>
      </p>
    </div>
  );
};
