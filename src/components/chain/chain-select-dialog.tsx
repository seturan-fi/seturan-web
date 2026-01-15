import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import type { CrossChainConfig } from "@/lib/constants/chains";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ChainSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chains: CrossChainConfig[];
  selectedChain: CrossChainConfig | null;
  onSelectChain: (chain: CrossChainConfig) => void;
}

export const ChainSelectDialog = ({
  open,
  onOpenChange,
  chains,
  selectedChain,
  onSelectChain,
}: ChainSelectDialogProps) => {
  const handleSelect = (chain: CrossChainConfig) => {
    onSelectChain(chain);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none border border-neutral-800 bg-neutral-950 p-0 text-neutral-50 sm:max-w-md">
        <DialogHeader className="border-b border-neutral-800 px-6 py-4">
          <DialogTitle className="text-lg font-semibold text-neutral-50">
            Select Destination Chain
          </DialogTitle>
          <p className="text-sm text-neutral-400">
            Choose where to receive your borrowed tokens
          </p>
        </DialogHeader>

        <div className="max-h-[400px] overflow-y-auto">
          <div className="space-y-1 px-3 pb-3 pt-3">
            {chains.map((chain) => (
              <button
                key={chain.chainId.toString()}
                type="button"
                onClick={() => handleSelect(chain)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-none px-3 py-3 text-left transition-colors",
                  selectedChain?.chainId === chain.chainId
                    ? "border border-neutral-700 bg-neutral-900"
                    : "hover:bg-neutral-900/70"
                )}
              >
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-neutral-800 bg-neutral-900">
                  <Image
                    src={chain.logo}
                    alt={chain.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex flex-1 flex-col overflow-hidden text-left">
                  <span className="text-sm font-semibold text-neutral-100">{chain.name}</span>
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <span>Chain ID: {chain.chainId.toString()}</span>
                    <span>•</span>
                    <span>EID: {chain.destEid}</span>
                  </div>
                </div>

                {selectedChain?.chainId === chain.chainId && (
                  <div className="shrink-0">
                    <Check className="h-5 w-5 text-emerald-400" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
