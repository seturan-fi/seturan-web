"use client";

import { cn } from "@/lib/utils";

interface LabeledSliderProps {
  /**
   * Label displayed above the slider
   */
  label: string;

  /**
   * Current value of the slider
   */
  value: number;

  /**
   * Minimum value
   */
  min: number;

  /**
   * Maximum value
   */
  max: number;

  /**
   * Step increment
   */
  step: number;

  /**
   * Callback when value changes
   */
  onChange: (value: number) => void;

  /**
   * Unit to display (default: "%")
   */
  unit?: string;

  /**
   * Number of decimal places to display
   */
  decimals?: number;

  /**
   * Optional display value (if different from actual value)
   * Useful for conversions like BPS to percentage
   */
  displayValue?: number;

  /**
   * Optional display min (if different from actual min)
   */
  displayMin?: number;

  /**
   * Optional display max (if different from actual max)
   */
  displayMax?: number;

  /**
   * Additional CSS class for the container
   */
  className?: string;
}

/**
 * Reusable slider component with label and value display
 * Used for advanced pool parameters configuration
 */
export const LabeledSlider = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit = "%",
  decimals = 2,
  displayValue,
  displayMin,
  displayMax,
  className,
}: LabeledSliderProps) => {
  const valueToDisplay = displayValue !== undefined ? displayValue : value;
  const minToDisplay = displayMin !== undefined ? displayMin : min;
  const maxToDisplay = displayMax !== undefined ? displayMax : max;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Label and Value Display */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-neutral-300">{label}</label>
        <span className="text-xs font-mono text-neutral-400">
          {valueToDisplay.toFixed(decimals)}
          {unit}
        </span>
      </div>

      {/* Slider Input */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-sky-500 cursor-pointer"
      />

      {/* Min/Max Labels */}
      <div className="flex justify-between text-[10px] text-neutral-600">
        <span>
          {minToDisplay}
          {unit}
        </span>
        <span>
          {maxToDisplay}
          {unit}
        </span>
      </div>
    </div>
  );
};
