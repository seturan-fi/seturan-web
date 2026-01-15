import { useQuery } from "@tanstack/react-query";
import { formatUnits } from "viem";

export interface PoolRate {
  lendingPoolBaseRate: string;
  lendingPoolRateAtOptimal: string;
  lendingPoolOptimalUtilization: string;
  lendingPoolMaxRate: string;
  tokenReserveFactor: string;
  totalBorrowAssets: string;
  totalReserveAssets: string;
  totalSupplyAssets: string;
  utilizationRate: string;
  borrowRate: string;
  supplyRate: string;
  apy: string;
}

const BASE_API_URL = `${process.env.NEXT_PUBLIC_POOL_API}lendingPoolRate/5003`;

const fetchPoolRate = async (poolAddress: string): Promise<PoolRate> => {
  const response = await fetch(`${BASE_API_URL}/${poolAddress}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch pool rate: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

const fetchPoolRates = async (): Promise<PoolRate[]> => {
  return [];
};

export const usePoolRates = () => {
  return useQuery<PoolRate[], Error>({
    queryKey: ["poolRates"],
    queryFn: async () => {
      try {
        return await fetchPoolRates();
      } catch (err) {
        throw err as Error;
      }
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
};

export const usePoolRateByAddress = (
  poolAddress: string | undefined | null
) => {
  return useQuery<PoolRate | null, Error>({
    queryKey: ["poolRate", poolAddress],
    queryFn: async () => {
      if (!poolAddress) return null;
      try {
        return await fetchPoolRate(poolAddress);
      } catch (err) {
        throw err as Error;
      }
    },
    enabled: !!poolAddress,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
};

export const useMultiplePoolRates = (poolAddresses: string[]) => {
  return useQuery<Record<string, PoolRate>, Error>({
    queryKey: ["poolRates", poolAddresses],
    queryFn: async () => {
      const results: Record<string, PoolRate> = {};

      await Promise.all(
        poolAddresses.map(async (address) => {
          try {
            const rate = await fetchPoolRate(address);
            results[address.toLowerCase()] = rate;
          } catch (err) {
            console.error(`Failed to fetch rate for ${address}:`, err);
          }
        })
      );

      return results;
    },
    enabled: poolAddresses.length > 0,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
};

export const formatApy = (apy: string): number => {
  try {
    // Values are stored as 1e18 = 100%, so divide by 1e16 to get percentage
    const formatted = formatUnits(BigInt(apy), 16);
    return parseFloat(formatted);
  } catch {
    return 0;
  }
};

export const formatInterestRate = (rate: string): number => {
  try {
    // Values are stored as 1e18 = 100%, so divide by 1e16 to get percentage
    const formatted = formatUnits(BigInt(rate), 16);
    return parseFloat(formatted);
  } catch {
    return 0;
  }
};

export const formatTotalSupply = (total: string, decimals: number): number => {
  try {
    const formatted = formatUnits(BigInt(total), decimals);
    return parseFloat(formatted);
  } catch {
    return 0;
  }
};

export const formatTotalBorrow = (total: string, decimals: number): number => {
  try {
    const formatted = formatUnits(BigInt(total), decimals);
    return parseFloat(formatted);
  } catch {
    return 0;
  }
};
