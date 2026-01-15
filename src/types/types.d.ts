export type HexAddress = `0x${string}`;

export type TxStatus = "idle" | "loading" | "success" | "error";

export interface BaseMutationParams {
  poolAddress: HexAddress;
  decimals: number;
}

export interface SupplyParams extends BaseMutationParams {
  amount: string;
}

export interface BorrowParams extends BaseMutationParams {
  amount: string;
}

export interface RepayParams extends BaseMutationParams {
  borrowTokenAddress: HexAddress;
  amount: string;
  tokenInDecimals: number; // Decimals of the token being used for repayment
}

export interface WithdrawLiquidityParams extends BaseMutationParams {
  shares: bigint;
}

export interface WithdrawCollateralParams extends BaseMutationParams {
  amount: string;
}

export interface ApproveParams {
  tokenAddress: HexAddress;
  spenderAddress: HexAddress;
  amount: string;
  decimals: number;
  bufferPercent?: number;
}

export interface SwapParams {
  poolAddress: HexAddress;
  tokenIn: HexAddress;
  tokenOut: HexAddress;
  amountIn: string;
  tokenInDecimals: number;
}
