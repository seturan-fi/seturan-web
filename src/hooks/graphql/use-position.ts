import { useQuery } from "@tanstack/react-query";
import { graphClient } from "@/lib/graphql/client";
import { useConnection } from "wagmi";
import { createPositionQuery } from "@/lib/graphql/position.query";

interface PositionData {
  lendingPoolRouter: string;
  position: string;
}

interface PositionQueryResponse {
  positionCreateds: {
    items: PositionData[];
  };
}

const fetchPosition = async (
  userAddress: string,
  lendingPoolAddress: string
): Promise<PositionData | null> => {
  const query = createPositionQuery(userAddress, lendingPoolAddress);

  const data = await graphClient.request<PositionQueryResponse>(query);

  const positions = data.positionCreateds.items || [];

  return positions.length > 0 ? positions[0] : null;
};

export const usePosition = (lendingPoolAddress: string | undefined | null) => {
  const { address } = useConnection();

  return useQuery<PositionData | null, Error>({
    queryKey: [
      "position",
      {
        userAddress: address?.toLowerCase() ?? "disconnected",
        poolAddress: lendingPoolAddress?.toLowerCase() ?? "unknown",
      },
    ],
    queryFn: async () => {
      if (!address || !lendingPoolAddress) {
        return null;
      }

      try {
        return await fetchPosition(address, lendingPoolAddress);
      } catch (err) {
        throw err as Error;
      }
    },
    enabled: !!address && !!lendingPoolAddress,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    meta: {
      description: "User position data including router and position addresses",
    },
  });
};

export const useRouterAddress = (
  lendingPoolAddress: string | undefined | null
) => {
  const positionQuery = usePosition(lendingPoolAddress);

  return {
    ...positionQuery,
    data: positionQuery.data?.lendingPoolRouter ?? null,
  };
};

export const usePositionAddress = (
  lendingPoolAddress: string | undefined | null
) => {
  const positionQuery = usePosition(lendingPoolAddress);

  return {
    ...positionQuery,
    data: positionQuery.data?.position ?? null,
  };
};

import { getRouterByPoolQuery } from "@/lib/graphql/position.query";

export const usePoolRouter = (
  lendingPoolAddress: string | undefined | null
) => {
  return useQuery<string | null, Error>({
    queryKey: ["pool-router", lendingPoolAddress],
    queryFn: async () => {
      if (!lendingPoolAddress) return null;

      const query = getRouterByPoolQuery(lendingPoolAddress);

      try {
        const data = await graphClient.request<{
          positionCreateds: { items: { lendingPoolRouter: string }[] };
        }>(query);

        const items = data.positionCreateds.items;
        return items.length > 0 ? items[0].lendingPoolRouter : null;
      } catch (err) {
        return null;
      }
    },
    enabled: !!lendingPoolAddress,
    staleTime: Infinity,
  });
};
