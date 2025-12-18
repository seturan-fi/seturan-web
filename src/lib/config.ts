import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrum } from "viem/chains";

export const config = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_APP_NAME!,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  chains: [arbitrum],
  ssr: true,
});
