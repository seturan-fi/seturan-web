import type { Metadata } from "next";
import SwapPage from "@/components/swap/swap-page";

export const metadata: Metadata = {
  title: "swap",
};

export default function SwapRoute() {
  return <SwapPage />;
}
