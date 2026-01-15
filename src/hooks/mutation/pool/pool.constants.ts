import type { StepState, PoolContractParams } from "./pool.types";

export const DEFAULT_POOL_PARAMS: PoolContractParams = {
  baseRate: BigInt(5e14),
  rateAtOptimal: BigInt(8e17),
  optimalUtilization: BigInt(6e17),
  maxUtilization: BigInt(96e16),
  liquidationThreshold: BigInt(85e16),
  liquidationBonus: BigInt(5e16),
  maxRate: BigInt(1e18),
};

export const INITIAL_STEPS: StepState[] = [
  { step: 1, status: "idle", label: "Approve Token" },
  { step: 2, status: "idle", label: "Create Pool" },
];

export const TOAST_IDS = {
  approvePool: "approve-pool",
  confirmingApprove: "confirming-approve",
  createPool: "create-pool",
  confirmingPool: "confirming-pool",
} as const;

export const QUERY_REFETCH_DELAY = 2000;
export const TX_POLLING_INTERVAL = 1000;
