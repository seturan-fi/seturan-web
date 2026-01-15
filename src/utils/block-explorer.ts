import { mantleSepoliaTestnet } from "viem/chains";
import type { HexAddress } from "@/types/types.d";

export const getBlockExplorerUrl = (
  txHash: HexAddress,
  chainId: number = mantleSepoliaTestnet.id
): string => {
  const explorers: Record<number, string> = {
    [mantleSepoliaTestnet.id]: "https://sepolia.mantlescan.xyz/tx",
  };

  const baseUrl = explorers[chainId] || explorers[mantleSepoliaTestnet.id];
  return `${baseUrl}/${txHash}`;
};
