export interface CrossChainConfig {
  chainId: bigint;
  destEid: number;
  name: string;
  logo: string;
  nativeCurrency: string;
}

export const SUPPORTED_CHAINS: Record<string, CrossChainConfig> = {
  ARBITRUM_SEPOLIA: {
    chainId: BigInt(421614),
    destEid: 40231, // Arbitrum Sepolia endpoint ID
    name: "Arbitrum Sepolia",
    logo: "/chain/arbitrum.png",
    nativeCurrency: "ETH",
  },
  BASE: {
    chainId: BigInt(84532),
    destEid: 40245,
    name: "Base Sepolia",
    logo: "/chain/base.svg",
    nativeCurrency: "ETH",
  },
} as const;

export type SupportedChainKey = keyof typeof SUPPORTED_CHAINS;

export const DEFAULT_CHAIN = SUPPORTED_CHAINS.ARBITRUM_SEPOLIA;

export const getChainConfig = (key: SupportedChainKey): CrossChainConfig => {
  return SUPPORTED_CHAINS[key];
};

export const getAllChains = (): CrossChainConfig[] => {
  return Object.values(SUPPORTED_CHAINS);
};
