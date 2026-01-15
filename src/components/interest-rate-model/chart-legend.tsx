interface LegendItemProps {
  color: string;
  label: string;
}

const LegendItem = ({ color, label }: LegendItemProps) => (
  <div className="flex items-center gap-2">
    <div className={`h-3 w-3 rounded-full ${color}`} />
    <span className="text-neutral-300">{label}</span>
  </div>
);

export const ChartLegend = () => (
  <div className="flex flex-wrap gap-6 text-sm">
    <LegendItem color="bg-pink-500" label="Borrow APR, variable" />
    <LegendItem color="bg-blue-500" label="Current Utilization" />
  </div>
);
