"use client";

import { useState } from "react";
import Image from "next/image";
import { useConnection } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet, ChevronDown } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActionButton } from "@/components/ui/action-button";
import { useFaucetMint, useFaucetTokenBalances } from "@/hooks/faucet";
import {
  FAUCET_CLAIM_AMOUNTS,
  FAUCET_TOKENS,
} from "@/lib/constants/faucet.constants";
import { TOKENS } from "@/lib/addresses/tokens";
import { Network, TokenSymbol, type TokenConfig } from "@/lib/addresses/types";

export const FaucetPage = () => {
  const { address, isConnecting } = useConnection();
  const { balances, isLoading: isLoadingBalances } = useFaucetTokenBalances();
  const { claim, isPending } = useFaucetMint();

  const [selectedSymbol, setSelectedSymbol] = useState<TokenSymbol>(
    TokenSymbol.WETH
  );
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const tokens = TOKENS[Network.ARBITRUM];
  const selectedToken: TokenConfig | null = tokens[selectedSymbol] ?? null;
  const claimAmount = FAUCET_CLAIM_AMOUNTS[selectedSymbol];

  const handleClaim = () => {
    if (!selectedToken) return;
    claim({ token: selectedToken, symbol: selectedSymbol });
  };

  const handleSelectToken = (symbol: TokenSymbol) => {
    setSelectedSymbol(symbol);
    setIsSelectOpen(false);
  };

  if (isConnecting) {
    return (
      <PageContainer>
        <section className="flex min-h-[60vh] flex-col items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-700 border-t-neutral-400" />
        </section>
      </PageContainer>
    );
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
              Connect your wallet to claim testnet tokens from the faucet.
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
          <h1 className="text-2xl font-semibold text-neutral-50">Faucet</h1>
          <p className="text-sm text-neutral-400">
            Claim testnet tokens to use in the application.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Claim Card */}
          <Card className="border-neutral-800 bg-neutral-900/50">
            <CardHeader>
              <CardTitle className="text-neutral-100">Claim Tokens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Token Select */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-200">
                  Select Token
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsSelectOpen(!isSelectOpen)}
                    className="flex h-16 w-full items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900/50 px-4 text-sm text-neutral-100 transition-colors hover:border-neutral-700 hover:bg-neutral-900"
                  >
                    {selectedToken ? (
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-neutral-700 bg-neutral-900">
                          <Image
                            src={selectedToken.logo}
                            alt={selectedToken.symbol}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-base font-semibold text-neutral-100">
                            {selectedToken.symbol}
                          </span>
                          <span className="text-xs text-neutral-400">
                            {selectedToken.name}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-neutral-400">Select token</span>
                    )}
                    <ChevronDown className="h-5 w-5 text-neutral-500" />
                  </button>

                  {/* Dropdown */}
                  {isSelectOpen && (
                    <div className="absolute z-10 mt-2 w-full rounded-lg border border-neutral-800 bg-neutral-900 shadow-lg">
                      {FAUCET_TOKENS.map((symbol) => {
                        const token = tokens[symbol];
                        if (!token) return null;
                        return (
                          <button
                            key={symbol}
                            type="button"
                            onClick={() => handleSelectToken(symbol)}
                            className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-neutral-800"
                          >
                            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-neutral-700 bg-neutral-900">
                              <Image
                                src={token.logo}
                                alt={token.symbol}
                                width={32}
                                height={32}
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-neutral-100">
                                {token.symbol}
                              </span>
                              <span className="text-xs text-neutral-400">
                                {token.name}
                              </span>
                            </div>
                            <span className="ml-auto text-xs text-neutral-500">
                              +{FAUCET_CLAIM_AMOUNTS[symbol]} {token.symbol}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Claim Amount Display */}
              <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400">Claim Amount</span>
                  <span className="text-lg font-semibold text-neutral-100">
                    {claimAmount} {selectedToken?.symbol}
                  </span>
                </div>
              </div>

              {/* Claim Button */}
              <ActionButton
                variant="create"
                onClick={handleClaim}
                disabled={!selectedToken}
                isLoading={isPending}
                loadingText="Claiming..."
                fullWidth
              >
                {`Claim ${claimAmount} ${selectedToken?.symbol ?? ""}`}
              </ActionButton>
            </CardContent>
          </Card>

          {/* Balances Card */}
          <Card className="border-neutral-800 bg-neutral-900/50">
            <CardHeader>
              <CardTitle className="text-neutral-100">Your Balances</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingBalances ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950/50 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 animate-pulse rounded-full bg-neutral-800" />
                        <div className="h-4 w-16 animate-pulse rounded bg-neutral-800" />
                      </div>
                      <div className="h-4 w-20 animate-pulse rounded bg-neutral-800" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {balances.map(({ token, symbol, formattedBalance }) => (
                    <div
                      key={symbol}
                      className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950/50 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-neutral-700 bg-neutral-900">
                          <Image
                            src={token.logo}
                            alt={token.symbol}
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-neutral-100">
                            {token.symbol}
                          </span>
                          <span className="text-xs text-neutral-400">
                            {token.name}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-neutral-100">
                        {formattedBalance}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </PageContainer>
  );
};

export default FaucetPage;
