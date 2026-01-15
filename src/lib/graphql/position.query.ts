import { gql } from "graphql-request";

export const createPositionQuery = (
  userAddress: string,
  lendingPoolAddress: string
) => {
  return gql`
    query {
      positionCreateds(
        where: {
          user: "${userAddress.toLowerCase()}"
          lendingPool: "${lendingPoolAddress.toLowerCase()}"
          contractChainId: 421614 

        }
      ) {
        items {
          lendingPoolRouter
          position
        }
      }
    }
  `;
};

export const getRouterByPoolQuery = (lendingPoolAddress: string) => {
  return gql`
    query {
      positionCreateds(
        where: {
          lendingPool: "${lendingPoolAddress.toLowerCase()}"
          contractChainId: 421614
        }
        limit: 1
      ) {
        items {
          lendingPoolRouter
        }
      }
    }
  `;
};
