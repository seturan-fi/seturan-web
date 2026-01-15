"use client";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrumSepolia } from "viem/chains";
import { http } from "viem";

export const config = getDefaultConfig({
  appName: "Seturan Finance",
  projectId: "YOUR_PROJECT_ID",
  chains: [arbitrumSepolia],
  transports: {
    [arbitrumSepolia.id]: http(process.env.NEXT_PUBLIC_ARBITRUM_RPC),
  },
  ssr: true,
});
