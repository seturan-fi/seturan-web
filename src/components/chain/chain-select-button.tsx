import Image from "next/image";
import { cn } from "@/lib/utils";
import type { CrossChainConfig } from "@/lib/constants/chains";

interface ChainSelectButtonProps {
  selectedChain: CrossChainConfig | null;
  onClick: () => void;
  disabled?: boolean;
}

export const ChainSelectButton = ({
  selectedChain,
  onClick,
  disabled = false,
}: ChainSelectButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-16 w-full items-center justify-between rounded-none border px-4",
        "bg-neutral-900/50 hover:bg-neutral-900 transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "border-neutral-800 hover:border-neutral-700"
      )}
    >
      {selectedChain ? (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-neutral-700 bg-neutral-900">
            <Image
              src={selectedChain.logo}
              alt={selectedChain.name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-base font-semibold text-neutral-100">
              {selectedChain.name}
            </span>
            <span className="text-xs text-neutral-400">
              Chain ID: {selectedChain.chainId.toString()}
            </span>
          </div>
        </div>
      ) : (
        <span className="text-neutral-400">Select destination chain</span>
      )}
      
      <svg
        className="w-5 h-5 text-neutral-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  );
};
