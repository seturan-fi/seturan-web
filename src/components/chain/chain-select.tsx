"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { ChainSelectDialog } from "@/components/chain/chain-select-dialog";
import { getAllChains, type CrossChainConfig } from "@/lib/constants/chains";

interface ChainSelectProps {
  label?: string;
  selected: CrossChainConfig | null;
  onSelect: (chain: CrossChainConfig) => void;
}

export const ChainSelect = ({
  label = "Destination Chain",
  selected,
  onSelect,
}: ChainSelectProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-neutral-200">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-16 w-full items-center justify-between rounded-none border border-neutral-800 bg-neutral-900/50 px-4 text-sm text-neutral-100 transition-colors hover:border-neutral-700 hover:bg-neutral-900"
      >
        {selected ? (
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-neutral-700 bg-neutral-900">
              <Image
                src={selected.logo}
                alt={selected.name}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-base font-semibold text-neutral-100">
                {selected.name}
              </span>
              <span className="text-xs text-neutral-400">
                Chain ID: {selected.chainId.toString()}
              </span>
            </div>
          </div>
        ) : (
          <span className="text-neutral-400">Select destination chain</span>
        )}
        <ChevronDown className="h-5 w-5 text-neutral-500" />
      </button>

      <ChainSelectDialog
        open={open}
        onOpenChange={setOpen}
        chains={getAllChains()}
        selectedChain={selected}
        onSelectChain={onSelect}
      />
    </div>
  );
};
