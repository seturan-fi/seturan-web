import { Network, ContractAddresses } from "./types";

export const CONTRACT_ADDRESSES: Record<Network, ContractAddresses> = {
  [Network.MANTLE]: {
    FACTORY: "0x46dA9F76c20a752132dDaefD2B14870e0A152D71",
    HELPER: "0x6c454d20F4CB5f69e2D66693fA8deE931D7432dF",
  },
};

export const getContractAddress = (
  network: Network,
  contractName: keyof ContractAddresses
): string | undefined => {
  return CONTRACT_ADDRESSES[network][contractName];
};

export const getContractAddresses = (network: Network): ContractAddresses => {
  return CONTRACT_ADDRESSES[network];
};
