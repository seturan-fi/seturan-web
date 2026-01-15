export type Address = `0x${string}`;

export enum Network {
  MANTLE = "mantle",
}

export interface TokenConfig {
  name: string;
  symbol: string;
  logo: string;
  decimals: number;
  address: Address;
}

export enum TokenSymbol {
  MNT = "MNT",
  USDT = "USDT",
  USDC = "USDC",
  WMNT = "WMNT",
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
