export type Address = `0x${string}`;

export enum Network {
  ARBITRUM = "arbitrum",
}

export interface TokenConfig {
  name: string;
  symbol: string;
  logo: string;
  decimals: number;
  address: Address;
}

export enum TokenSymbol {
  ETH = "ETH",
  USDT = "USDT",
  USDC = "USDC",
  ARB = "ARB",
  WETH = "WETH",
  WBTC = "WBTC",
}

export type TokensConfig = {
  [key in TokenSymbol]: TokenConfig;
};

export interface ContractAddresses {
  FACTORY: Address;
  HELPER: Address;
}
