"use client";

import { useQuery } from "@tanstack/react-query";
import { graphClient } from "@/lib/graphql/client";
import {
  querySupplyCollateralHistory,
  querySupplyLiquidityHistory,
  queryWithdrawCollateralHistory,
  queryWithdrawLiquidityHistory,
  queryBorrowHistory,
  queryRepayHistory,
  queryCrossChainBorrowHistory,
  queryLiquidationHistory,
} from "@/lib/graphql/history.query";
import { usePools, type PoolWithTokens } from "./use-pools";

export type TransactionType =
  | "supply_collateral"
  | "supply_liquidity"
  | "withdraw_collateral"
  | "withdraw_liquidity"
  | "borrow"
  | "repay"
  | "crosschain_borrow"
  | "liquidation";

export interface HistoryItem {
  id: string;
  type: TransactionType;
  amount: string;
  lendingPoolAddress: string;
  user: string;
  txHash: string;
  timestamp: string;
  contractChainId: number;
  destChainId?: number;
  liquidationBonus?: string;
  pool?: PoolWithTokens;
}

interface RawHistoryItem {
  id: string;
  amount?: string;
  lendingPoolAddress: string;
  user?: string;
  borrower?: string;
  txHash: string;
  timestamp: string;
  contractChainId: number;
  chainId?: number;
  userBorrowAssets?: string;
  liquidationBonus?: string;
}

interface SupplyCollateralResponse {
  supplyCollaterals: { items: RawHistoryItem[] };
}

interface SupplyLiquidityResponse {
  supplyLiquiditys: { items: RawHistoryItem[] };
}

interface WithdrawCollateralResponse {
  withdrawCollaterals: { items: RawHistoryItem[] };
}

interface WithdrawLiquidityResponse {
  withdrawLiquiditys: { items: RawHistoryItem[] };
}

interface BorrowResponse {
  borrowDebts: { items: RawHistoryItem[] };
}

interface RepayResponse {
  repayByPositions: { items: RawHistoryItem[] };
}

interface CrossChainBorrowResponse {
  borrowDebtCrossChains: { items: RawHistoryItem[] };
}

interface LiquidationResponse {
  liquidations: { items: RawHistoryItem[] };
}

const mapToHistory = (
  items: RawHistoryItem[],
  type: TransactionType,
  pools: PoolWithTokens[]
): HistoryItem[] => {
  return items.map((item) => {
    const pool = pools.find(
      (p) => p.lendingPool.toLowerCase() === item.lendingPoolAddress.toLowerCase()
    );
    return {
      id: item.id,
      type,
      amount: item.amount || item.userBorrowAssets || "0",
      lendingPoolAddress: item.lendingPoolAddress,
      user: item.user || item.borrower || "",
      txHash: item.txHash,
      timestamp: item.timestamp,
      contractChainId: item.contractChainId,
      destChainId: item.chainId,
      liquidationBonus: item.liquidationBonus,
      pool,
    };
  });
};

export const useHistory = () => {
  const { data: pools = [] } = usePools();

  return useQuery({
    queryKey: ["history", pools.length],
    queryFn: async (): Promise<HistoryItem[]> => {
      const [
        supplyCollateral,
        supplyLiquidity,
        withdrawCollateral,
        withdrawLiquidity,
        borrow,
        repay,
        crossChainBorrow,
        liquidation,
      ] = await Promise.all([
        graphClient.request<SupplyCollateralResponse>(querySupplyCollateralHistory()),
        graphClient.request<SupplyLiquidityResponse>(querySupplyLiquidityHistory()),
        graphClient.request<WithdrawCollateralResponse>(queryWithdrawCollateralHistory()),
        graphClient.request<WithdrawLiquidityResponse>(queryWithdrawLiquidityHistory()),
        graphClient.request<BorrowResponse>(queryBorrowHistory()),
        graphClient.request<RepayResponse>(queryRepayHistory()),
        graphClient.request<CrossChainBorrowResponse>(queryCrossChainBorrowHistory()),
        graphClient.request<LiquidationResponse>(queryLiquidationHistory()),
      ]);

      const allHistory: HistoryItem[] = [
        ...mapToHistory(supplyCollateral.supplyCollaterals?.items || [], "supply_collateral", pools),
        ...mapToHistory(supplyLiquidity.supplyLiquiditys?.items || [], "supply_liquidity", pools),
        ...mapToHistory(withdrawCollateral.withdrawCollaterals?.items || [], "withdraw_collateral", pools),
        ...mapToHistory(withdrawLiquidity.withdrawLiquiditys?.items || [], "withdraw_liquidity", pools),
        ...mapToHistory(borrow.borrowDebts?.items || [], "borrow", pools),
        ...mapToHistory(repay.repayByPositions?.items || [], "repay", pools),
        ...mapToHistory(crossChainBorrow.borrowDebtCrossChains?.items || [], "crosschain_borrow", pools),
        ...mapToHistory(liquidation.liquidations?.items || [], "liquidation", pools),
      ];

      // Sort by timestamp descending
      return allHistory.sort(
        (a, b) => Number(b.timestamp) - Number(a.timestamp)
      );
    },
    enabled: pools.length > 0,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
};
