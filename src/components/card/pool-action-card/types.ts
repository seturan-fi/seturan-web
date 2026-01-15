export const TABS = ["Supply", "Borrow", "Repay", "Withdraw"] as const;

export type Tab = (typeof TABS)[number];

export type Mode = "liquidity" | "collateral";

export type RepayMode = "position" | "token";

export interface PoolActionCardProps {
  poolAddress: string;
  collateralTokenAddress: string;
  borrowTokenAddress: string;
  collateralSymbol?: string;
  borrowSymbol?: string;
  collateralLogoUrl?: string;
  borrowLogoUrl?: string;
  borrowTokenDecimals?: number;
  collateralTokenDecimals?: number;
  ltv: string;
}

export interface ContentProps {
  poolAddress: string;
  collateralTokenAddress: string;
  borrowTokenAddress: string;
  collateralSymbol?: string;
  borrowSymbol?: string;
  collateralLogoUrl?: string;
  borrowLogoUrl?: string;
  borrowTokenDecimals: number;
  collateralTokenDecimals: number;
  ltv: string;
}
