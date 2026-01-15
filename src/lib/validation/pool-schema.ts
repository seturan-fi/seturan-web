import { z } from "zod";
import type { TokenConfig } from "@/lib/addresses/types";


export const createPoolSchema = z
  .object({
    collateral: z
      .custom<TokenConfig>()
      .optional()
      .refine((val) => val !== undefined, {
        message: "Please select a collateral token",
      }),
    borrow: z
      .custom<TokenConfig>()
      .optional()
      .refine((val) => val !== undefined, {
        message: "Please select a borrow token",
      }),

    ltv: z
      .number()
      .min(0, "LTV must be at least 0%")
      .max(100, "LTV cannot exceed 100%"),

    supplyBalance: z.number().positive("Supply balance must be greater than 0"),

    isAdvancedMode: z.boolean(),

    baseRate: z
      .number()
      .min(1, "Base rate must be at least 1 BPS (0.01%)")
      .max(100, "Base rate cannot exceed 100 BPS (1%)"),

    rateAtOptimal: z
      .number()
      .min(1, "Rate at optimal must be at least 1%")
      .max(10, "Rate at optimal cannot exceed 10%"),

    optimalUtilization: z
      .number()
      .min(50, "Optimal utilization must be at least 50%")
      .max(95, "Optimal utilization cannot exceed 95%"),

    maxUtilization: z
      .number()
      .min(50, "Max utilization must be at least 50%")
      .max(100, "Max utilization cannot exceed 100%"),

    liquidationThreshold: z
      .number()
      .min(50, "Liquidation threshold must be at least 50%")
      .max(90, "Liquidation threshold cannot exceed 90%"),

    liquidationBonus: z
      .number()
      .min(1, "Liquidation bonus must be at least 1%")
      .max(15, "Liquidation bonus cannot exceed 15%"),

    maxRate: z
      .number()
      .min(15, "Max rate must be at least 15%")
      .max(100, "Max rate cannot exceed 100%"),
  })
  .refine(
    (data) => {
      if (data.collateral && data.borrow) {
        return (
          data.collateral.address.toLowerCase() !==
          data.borrow.address.toLowerCase()
        );
      }
      return true;
    },
    {
      message: "Collateral and borrow tokens must be different",
      path: ["borrow"],
    }
  )
  .refine(
    (data) => {
      return data.ltv < data.liquidationThreshold;
    },
    {
      message: "LTV must be less than liquidation threshold",
      path: ["ltv"],
    }
  );

export type CreatePoolFormData = z.infer<typeof createPoolSchema>;

export const createPoolDefaultValues = {
  collateral: undefined,
  borrow: undefined,
  ltv: 0,
  supplyBalance: 0,
  isAdvancedMode: false,
  baseRate: 50,
  rateAtOptimal: 5,
  optimalUtilization: 80,
  maxUtilization: 90,
  liquidationThreshold: 75,
  liquidationBonus: 5,
  maxRate: 50,
} as const;
