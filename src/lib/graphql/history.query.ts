import { gql } from "graphql-request";

export const querySupplyCollateralHistory = () => {
  return gql`
    query {
      supplyCollaterals(where: { contractChainId: 5003 }, orderBy: "timestamp", orderDirection: "desc") {
        items {
          id
          amount
          lendingPoolAddress
          user
          txHash
          timestamp
          contractChainId
        }
      }
    }
  `;
};

export const querySupplyLiquidityHistory = () => {
  return gql`
    query {
      supplyLiquiditys(where: { contractChainId: 5003 }, orderBy: "timestamp", orderDirection: "desc") {
        items {
          id
          amount
          lendingPoolAddress
          user
          txHash
          timestamp
          contractChainId
        }
      }
    }
  `;
};

export const queryWithdrawCollateralHistory = () => {
  return gql`
    query {
      withdrawCollaterals(where: { contractChainId: 5003 }, orderBy: "timestamp", orderDirection: "desc") {
        items {
          id
          amount
          lendingPoolAddress
          user
          txHash
          timestamp
          contractChainId
        }
      }
    }
  `;
};

export const queryWithdrawLiquidityHistory = () => {
  return gql`
    query {
      withdrawLiquiditys(where: { contractChainId: 5003 }, orderBy: "timestamp", orderDirection: "desc") {
        items {
          id
          amount
          lendingPoolAddress
          user
          txHash
          timestamp
          contractChainId
        }
      }
    }
  `;
};

export const queryBorrowHistory = () => {
  return gql`
    query {
      borrowDebts(where: { contractChainId: 5003 }, orderBy: "timestamp", orderDirection: "desc") {
        items {
          id
          amount
          lendingPoolAddress
          user
          txHash
          timestamp
          contractChainId
        }
      }
    }
  `;
};

export const queryRepayHistory = () => {
  return gql`
    query {
      repayByPositions(where: { contractChainId: 5003 }, orderBy: "timestamp", orderDirection: "desc") {
        items {
          id
          amount
          lendingPoolAddress
          user
          txHash
          timestamp
          contractChainId
        }
      }
    }
  `;
};

export const queryCrossChainBorrowHistory = () => {
  return gql`
    query {
      borrowDebtCrossChains(where: { contractChainId: 5003 }, orderBy: "timestamp", orderDirection: "desc") {
        items {
          id
          amount
          lendingPoolAddress
          user
          txHash
          timestamp
          contractChainId
          chainId
        }
      }
    }
  `;
};

export const queryLiquidationHistory = () => {
  return gql`
    query {
      liquidations(where: { contractChainId: 5003 }, orderBy: "timestamp", orderDirection: "desc") {
        items {
          id
          userBorrowAssets
          liquidationBonus
          lendingPoolAddress
          borrower
          txHash
          timestamp
          contractChainId
        }
      }
    }
  `;
};
