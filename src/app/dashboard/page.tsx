import type { Metadata } from "next";
import { HomePage } from "@/components/home/home-page";

export const metadata: Metadata = {
  title: "Pool Dashboard - Seturan Lending Pools",
  description:
    "Browse and manage lending pools on Seturan. View pool details, APY rates, total liquidity, and more.",
};

export default function HomeIndexRoute() {
  return <HomePage />;
}
