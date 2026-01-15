import { Network, TokensConfig, TokenSymbol, TokenConfig } from "./types";
export const TOKENS: Record<Network, TokensConfig> = {
  [Network.ARBITRUM]: {
    [TokenSymbol.ETH]: {
      name: "Ethereum",
      symbol: "ETH",
      logo: "/token/ethereum.png",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000001",
    },
    [TokenSymbol.USDT]: {
      name: "Tether USD",
      symbol: "USDT",
      logo: "/token/usdt.png",
      decimals: 6,
      address: "0x04C37dc1b538E00b31e6bc883E16d97cD7937a10",
    },
    [TokenSymbol.USDC]: {
      name: "USD Coin",
      symbol: "USDC",
      logo: "/token/usdc.png",
      decimals: 6,
      address: "0x15858A57854BBf0DF60A737811d50e1Ee785f9bc",
    },
    [TokenSymbol.ARB]: {
      name: "Arbitrum",
      symbol: "ARB",
      logo: "/chain/arbitrum.png",
      decimals: 18,
      address: "0x4Ba8D8083e7F3652CCB084C32652e68566E9Ef23",
    },
    [TokenSymbol.WETH]: {
      name: "Wrapped Ether",
      symbol: "WETH",
      logo: "/token/weth.png",
      decimals: 18,
      address: "0x007F735Fd070DeD4B0B58D430c392Ff0190eC20F",
    },
    [TokenSymbol.WBTC]: {
      name: "Wrapped Bitcoin",
      symbol: "WBTC",
      logo: "/token/wbtc.png",
      decimals: 8,
      address: "0x5C368bd6cE77b2ca47B4ba791fCC1f1645591c84",
    },
  },
};

// get token by network and symbol
export const getToken = (
  network: Network,
  symbol: TokenSymbol
): TokenConfig => {
  return TOKENS[network][symbol];
};

// get token address by network and symbol
export const getTokenAddress = (
  network: Network,
  symbol: TokenSymbol
): string => {
  return TOKENS[network][symbol].address;
};

// Get all tokens for a specific network
export const getAllTokens = (network: Network): TokensConfig => {
  return TOKENS[network];
};

// get all tokens
export const getTokensArray = (network: Network): TokenConfig[] => {
  if (!network || !TOKENS[network]) {
    return [];
  }
  return Object.values(TOKENS[network]);
};
