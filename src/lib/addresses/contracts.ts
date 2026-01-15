import { Network, ContractAddresses } from "./types";

export const CONTRACT_ADDRESSES: Record<Network, ContractAddresses> = {
  [Network.ARBITRUM]: {
    FACTORY: "0x02a66B51Fc24E08535a6Cfe1e11E532D8A089212",
    HELPER: "0x034cf520e48C7e87763466949058965F7a5A3181",
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
