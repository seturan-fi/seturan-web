import { waitForTransactionReceipt } from "wagmi/actions";
import { config } from "@/lib/config";
import type { HexAddress } from "@/types/types.d";

export const waitForTxReceipt = async (hash: HexAddress) => {
  return waitForTransactionReceipt(config, {
    hash,
    confirmations: 1,
    pollingInterval: 2000, // Poll every 2 seconds
    timeout: 180_000, // 3 minute timeout for slow testnets
    retryCount: 5, // Retry up to 5 times
    retryDelay: 2000, // Wait 2 seconds between retries
  });
};
