export const INVALIDATE_KEYS = {
  supply: [
    "pools",
    "tokenBalance",
    "balance",
    "liquidityBalance",
    "totalSupplyAssets",
    "collateralBalance",
  ],  
  borrow: [
    "pools",
    "tokenBalance",
    "balance",
    "totalBorrowAssets",
    "totalBorrowShares",
    "userBorrowBalance",
  ],
  repay: [
    "pools",
    "tokenBalance",
    "balance",
    "totalBorrowAssets",
    "totalBorrowShares",
    "userBorrowBalance",
  ],
  withdrawLiquidity: [
    "pools",
    "tokenBalance",
    "balance",
    "liquidityBalance",
    "totalSupplyAssets",
  ],
  withdrawCollateral: ["pools", "tokenBalance", "balance", "collateralBalance"],
  swap: ["pools", "tokenBalance", "balance", "position"],
} as const;

export const invalidateKeys = (
  queryClient: { invalidateQueries: (options: { queryKey: string[] }) => void },
  type: keyof typeof INVALIDATE_KEYS
) => {
  INVALIDATE_KEYS[type].forEach((key) => {
    queryClient.invalidateQueries({ queryKey: [key] });
  });
};
