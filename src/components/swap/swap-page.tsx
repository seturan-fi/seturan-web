"use client";

import { useAccount } from "wagmi";
import { Wallet } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { PageContainer } from "@/components/layout/page-container";
import { TokenPriceChart } from "./token-price-chart";
import { SwapCard } from "./swap-card";
import { useChartTokens } from "./use-chart-tokens";
import { usePools } from "@/hooks/graphql/use-pools";
import { SwapPageSkeleton } from "@/components/skeleton/swap-page-skeleton";

export const SwapPage = () => {
  const { address, isConnecting } = useAccount();
  const { baseToken, quoteToken, setBaseToken, setQuoteToken } =
    useChartTokens();
  const { isLoading: isLoadingPools } = usePools();

  if (isConnecting || isLoadingPools) {
    return <SwapPageSkeleton />;
  }

  if (!address) {
    return (
      <PageContainer>
        <section className="flex min-h-[60vh] flex-col items-center justify-center space-y-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="rounded-full border border-neutral-800 bg-neutral-900 p-6">
              <Wallet className="h-12 w-12 text-neutral-500" />
            </div>
            <h1 className="text-2xl font-semibold text-neutral-100">
              Connect Your Wallet
            </h1>
            <p className="max-w-md text-sm text-neutral-400">
              Connect your wallet to access the swap feature and exchange your
              tokens.
            </p>
          </div>
          <ConnectButton />
        </section>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <section className="space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-neutral-50">Swap</h1>
          <p className="text-sm text-neutral-400">
            Swap your position collateral and monitor live market prices.
          </p>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
          <TokenPriceChart
            baseToken={baseToken}
            quoteToken={quoteToken}
            onChangeBaseToken={setBaseToken}
            onChangeQuoteToken={setQuoteToken}
          />
          <SwapCard />
        </div>
      </section>
    </PageContainer>
  );
};

export default SwapPage;
