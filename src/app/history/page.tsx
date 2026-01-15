import type { Metadata } from "next";
import { HistoryPage } from "@/components/history";

export const metadata: Metadata = {
  title: "Transaction History | Seturan",
  description: "View all lending pool transactions on Mantle Sepolia",
};

export default function Page() {
  return <HistoryPage />;
}
