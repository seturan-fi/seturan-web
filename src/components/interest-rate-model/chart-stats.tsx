interface StatItemProps {
  label: string;
  value: string;
  color: string;
}

const StatItem = ({ label, value, color }: StatItemProps) => (
  <div>
    <p className="text-sm text-neutral-400">{label}</p>
    <p className={`mt-1 text-2xl font-semibold ${color}`}>{value}</p>
  </div>
);

interface ChartStatsProps {
  borrowRate: number;
  supplyRate: number;
  reserveFactor: number;
}

export const ChartStats = ({ borrowRate, supplyRate, reserveFactor }: ChartStatsProps) => (
  <div className="grid grid-cols-3 gap-6 border-t border-neutral-800 pt-6">
    <StatItem label="Current Borrow APR" value={`${borrowRate.toFixed(2)}%`} color="text-pink-500" />
    <StatItem label="Supply APR" value={`${supplyRate.toFixed(2)}%`} color="text-emerald-500" />
    <StatItem label="Reserve Factor" value={`${reserveFactor.toFixed(2)}%`} color="text-white" />
  </div>
);
