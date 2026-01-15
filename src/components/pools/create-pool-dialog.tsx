"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreatePoolForm } from "@/components/form/create-pool-form";
import { useCreatePool } from "@/hooks/mutation/use-pool";
import { type CreatePoolFormData } from "@/lib/validation";

export const CreatePoolButton = () => {
  const [open, setOpen] = useState(false);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const { mutation, isLoading, isSuccess } = useCreatePool();

  const onSubmit = (data: CreatePoolFormData) => {
    if (!data.collateral || !data.borrow) return;

    mutation.mutate({
      collateralTokenAddress: data.collateral.address,
      borrowTokenAddress: data.borrow.address,
      borrowTokenDecimals: data.borrow.decimals,
      ltvValue: (data.ltv ?? 0).toString(),
      supplyBalance: (data.supplyBalance ?? 0).toString(),
      isAdvancedMode: data.isAdvancedMode ?? false,
      baseRate: data.baseRate ?? 50,
      rateAtOptimal: data.rateAtOptimal ?? 5,
      optimalUtilization: data.optimalUtilization ?? 80,
      maxUtilization: data.maxUtilization ?? 90,
      liquidationThreshold: data.liquidationThreshold ?? 75,
      liquidationBonus: data.liquidationBonus ?? 5,
      maxRate: data.maxRate ?? 50,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="sm"
          className="rounded-none border border-sky-600 bg-sky-500 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white transition-all hover:bg-sky-600"
        >
          Create Pool
        </Button>
      </DialogTrigger>

      <DialogContent
        className={`max-w-[calc(100vw-2rem)] border border-neutral-800 bg-neutral-950 text-neutral-50 transition-all duration-300 ${
          isAdvancedMode ? "sm:max-w-[920px]" : "sm:max-w-[520px]"
        }`}
      >
        <DialogHeader className="border-b border-neutral-800 pb-4">
          <DialogTitle className="text-xl font-bold text-neutral-50">
            Create New Pool
          </DialogTitle>
          <p className="text-sm text-neutral-400">
            Set up a new lending pool with your preferred tokens
          </p>
        </DialogHeader>

        <CreatePoolForm
          onSubmit={onSubmit}
          isPending={isLoading}
          isSuccess={isSuccess}
          onAdvancedModeChange={setIsAdvancedMode}
        />
      </DialogContent>
    </Dialog>
  );
};
