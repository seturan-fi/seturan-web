
export const QUERY_CONFIG = {
  // Default stale times (in milliseconds)
  staleTime: {
    fast: 5_000, // 5 seconds - for rapidly changing data (balances, prices)
    medium: 10_000, // 10 seconds - for moderately changing data
    slow: 30_000, // 30 seconds - for slowly changing data (pool info)
    static: 60_000, // 1 minute - for rarely changing data (token metadata)
  },

  // Garbage collection time
  gcTime: {
    short: 30_000, // 30 seconds
    medium: 60_000, // 1 minute
    long: 300_000, // 5 minutes
  },

  // Retry configuration
  retry: {
    balance: {
      retry: 2,
      retryDelay: 400,
    },
    contract: {
      retry: 3,
      retryDelay: 500,
    },
    graphql: {
      retry: 3,
      retryDelay: 1000,
    },
  },

  // Refetch behavior
  refetch: {
    disabled: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchInterval: false,
    },
    onFocus: {
      refetchOnMount: false,
      refetchOnWindowFocus: true,
      refetchInterval: false,
    },
    polling: (interval: number) => ({
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchInterval: interval,
    }),
  },
} as const;

/**
 * Specific configurations for different types of queries
 */
export const BALANCE_QUERY_CONFIG = {
  staleTime: QUERY_CONFIG.staleTime.fast,
  gcTime: QUERY_CONFIG.gcTime.short,
  ...QUERY_CONFIG.retry.balance,
  ...QUERY_CONFIG.refetch.disabled,
} as const;

export const POOL_QUERY_CONFIG = {
  staleTime: QUERY_CONFIG.staleTime.medium,
  gcTime: QUERY_CONFIG.gcTime.medium,
  ...QUERY_CONFIG.retry.contract,
  ...QUERY_CONFIG.refetch.disabled,
} as const;

export const TOTAL_ASSETS_QUERY_CONFIG = {
  staleTime: QUERY_CONFIG.staleTime.fast,
  gcTime: QUERY_CONFIG.gcTime.short,
  ...QUERY_CONFIG.retry.contract,
  ...QUERY_CONFIG.refetch.disabled,
} as const;

/**
 * Display decimals configuration for formatting
 */
export const getDisplayDecimals = (decimals: number): number => {
  if (decimals >= 18) return 4;
  if (decimals >= 6) return 2;
  return decimals;
};

/**
 * Error messages for read operations
 */
export const QUERY_ERROR_MESSAGES = {
  walletNotConnected: "Wallet not connected",
  invalidAddress: "Invalid address provided",
  contractReadFailed: "Failed to read from contract",
  networkError: "Network error occurred",
  invalidParameters: "Invalid parameters provided",
} as const;

/**
 * Common validation for addresses
 */
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;
export const ZERO_ADDRESS_ALT = "0x0000000000000000000000000000000000000001" as const;

export const isValidAddress = (address: string | null | undefined): boolean => {
  return (
    !!address &&
    address !== ZERO_ADDRESS &&
    address !== ZERO_ADDRESS_ALT
  );
};
