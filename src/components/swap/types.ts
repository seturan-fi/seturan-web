import type { PoolWithTokens } from "@/hooks/graphql/use-pools";

/**
 * Swap card props
 */
export interface SwapCardProps {
  className?: string;
}

/**
 * Pool select button props
 */
export interface PoolSelectButtonProps {
  pool: PoolWithTokens | null;
  onSelect: (pool: PoolWithTokens) => void;
  pools: PoolWithTokens[];
  isLoading?: boolean;
  disabled?: boolean;
}

/**
 * Pool select dialog props
 */
export interface PoolSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pools: PoolWithTokens[];
  onSelect: (pool: PoolWithTokens) => void;
  selectedPool?: PoolWithTokens | null;
  title?: string;
}
