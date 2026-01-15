import { arbitrumSepolia } from "viem/chains";
import type { HexAddress } from "@/types/types.d";

export const getBlockExplorerUrl = (
  txHash: HexAddress,
  chainId: number = arbitrumSepolia.id
): string => {
  const explorers: Record<number, string> = {
    [arbitrumSepolia.id]: "https://sepolia.arbiscan.io/tx",
  };

  const baseUrl = explorers[chainId] || explorers[arbitrumSepolia.id];
  return `${baseUrl}/${txHash}`;
};
