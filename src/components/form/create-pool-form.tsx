"use client";

import { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionButton } from "@/components/ui/action-button";
import { AlertMessage } from "@/components/ui/alert-message";
import { PoolPreview } from "@/components/ui/pool-preview";
import { Switch } from "@/components/ui/switch";
import { BasicPoolFields } from "@/components/pools/basic-pool-fields";
import { AdvancedPoolParameters } from "@/components/pools/advanced-pool-parameters";
import {
  createPoolSchema,
  createPoolDefaultValues,
  type CreatePoolFormData,
} from "@/lib/validation";

interface CreatePoolFormProps {
  onSubmit: (data: CreatePoolFormData) => void;
  isPending: boolean;
  isSuccess: boolean;
  onAdvancedModeChange?: (isAdvanced: boolean) => void;
}

export const CreatePoolForm = ({
  onSubmit,
  isPending,
  isSuccess,
  onAdvancedModeChange,
}: CreatePoolFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(createPoolSchema),
    defaultValues: createPoolDefaultValues,
    mode: "onChange",
  });

  const collateral = useWatch({ control, name: "collateral" });
  const borrow = useWatch({ control, name: "borrow" });
  const ltv = useWatch({ control, name: "ltv" });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const liquidationThreshold = useWatch({
    control,
    name: "liquidationThreshold",
  }); // Watched for validation
  const isAdvancedMode = useWatch({ control, name: "isAdvancedMode" });

  // Notify parent when advanced mode changes
  useEffect(() => {
    onAdvancedModeChange?.(isAdvancedMode ?? false);
  }, [isAdvancedMode, onAdvancedModeChange]);

  return (
    <form
      className="space-y-6 overflow-hidden pt-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={`gap-6 ${isAdvancedMode ? "grid grid-cols-2" : ""}`}>
        <div className="space-y-4">
          <BasicPoolFields
            control={control}
            errors={errors}
            collateral={collateral}
            borrow={borrow}
          />

          {collateral && borrow && (
            <PoolPreview
              collateral={collateral}
              borrow={borrow}
              ltv={(ltv ?? 0).toString()}
            />
          )}

          <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
            <div className="space-y-0.5">
              <label className="text-sm font-medium text-neutral-200">
                Advanced Mode
              </label>
              <p className="text-xs text-neutral-500">
                Configure interest rate model and liquidation parameters
              </p>
            </div>
            <Controller
              name="isAdvancedMode"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </div>

        {isAdvancedMode && <AdvancedPoolParameters control={control} />}
      </div>

      {errors.root && (
        <AlertMessage type="error" message={errors.root.message ?? ""} />
      )}

      <div className="flex justify-end gap-3 border-t border-neutral-800 pt-4">
        <ActionButton
          type="submit"
          variant="create"
          isLoading={isPending}
          isSuccess={isSuccess}
          loadingText="Creating..."
          successText="Created!"
          fullWidth
          disabled={!isValid || isPending}
        >
          Create Pool
        </ActionButton>
      </div>
    </form>
  );
};
