import { useMemo } from "react";
import { Loader2, ArrowDown } from "lucide-react";
import Image from "next/image";

interface ConversionCardProps {
  outputAmount: string;
  outputSymbol: string;
  outputLogoUrl?: string;
  isLoading: boolean;
}

export const ConversionCard = ({
  outputAmount,
  outputSymbol,
  outputLogoUrl,
  isLoading,
}: ConversionCardProps) => {
  const formattedOutputAmount = useMemo(() => {
    if (!outputAmount || outputAmount === "0") return "0.00";
    const parsed = parseFloat(outputAmount);
    if (isNaN(parsed)) return "0.00";
    return parsed.toFixed(6);
  }, [outputAmount]);

  return (
    <div className="relative border border-neutral-800 bg-neutral-900/50 mt-4">
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="rounded-full border border-neutral-700 bg-neutral-900 p-1.5">
          <ArrowDown className="h-3 w-3 text-neutral-400" />
        </div>
      </div>

      <div className="flex items-center justify-between px-3 pt-4 pb-2">
        <span className="text-xs text-neutral-500">Converts to</span>
        {isLoading && (
          <Loader2 className="h-3 w-3 animate-spin text-neutral-500" />
        )}
      </div>

      <div className="px-3 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {outputLogoUrl && (
              <Image
                src={outputLogoUrl}
                alt={outputSymbol}
                className="h-6 w-6 rounded-full"
                width={20}
                height={20}
              />
            )}
            <span className="text-lg font-semibold text-neutral-100">
              {isLoading ? (
                <span className="text-neutral-500">Calculating...</span>
              ) : (
                formattedOutputAmount
              )}
            </span>
            <span className="text-sm text-neutral-400">{outputSymbol}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
