"use client";

import { useEffect, useState, useRef } from "react";

import { TokenSelect } from "@/components/pool/token-select";
import type { TokenConfig } from "@/lib/addresses/types";

const INTERVALS = ["1h", "4h", "1d"] as const;
export type ChartInterval = (typeof INTERVALS)[number];

const TV_BASE_SYMBOL_MAP: Record<string, string | null> = {
  WBTC: "BTC",
  WETH: "ETH",
  USDC: "USDC",
  USDT: "USDT",
  ARBITRUM: "ARB",
  WMNT: "MNT",
};

const TRADING_VIEW_CONTAINER_ID = "tradingview_token_chart";
const TRADING_VIEW_SCRIPT_SRC = "https://s3.tradingview.com/tv.js";

// Type definition for TradingView global
interface TradingViewWindow extends Window {
  TradingView?: {
    widget: new (config: Record<string, unknown>) => void;
  };
}

declare const window: TradingViewWindow;

let tvScriptLoadingPromise: Promise<void> | null = null;

const loadTradingViewScript = (): Promise<void> => {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.TradingView) return Promise.resolve();
  if (tvScriptLoadingPromise) return tvScriptLoadingPromise;

  tvScriptLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = TRADING_VIEW_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load TradingView library"));
    document.head.appendChild(script);
  });

  return tvScriptLoadingPromise;
};

const mapPairToTradingViewSymbol = (
  baseToken: TokenConfig | null,
  quoteToken: TokenConfig | null
): string | null => {
  if (!baseToken || !quoteToken) return null;

  const baseSymbol = TV_BASE_SYMBOL_MAP[baseToken.symbol] ?? baseToken.symbol;
  const quoteSymbol =
    TV_BASE_SYMBOL_MAP[quoteToken.symbol] ?? quoteToken.symbol;

  if (!baseSymbol || !quoteSymbol) return null;
  if (baseSymbol.toUpperCase() === quoteSymbol.toUpperCase()) return null;

  // TradingView accepts MEXC:ARBUSDT style symbols; we normalise asset codes to lowercase.
  const base = baseSymbol.toLowerCase();
  const quote = quoteSymbol.toLowerCase();

  return `MEXC:${base}${quote}`;
};

const mapIntervalToTradingView = (interval: ChartInterval): string => {
  switch (interval) {
    case "1h":
      return "60"; // 60 minutes
    case "4h":
      return "240"; // 4 hours
    case "1d":
    default:
      return "D"; // 1 day
  }
};

interface TokenPriceChartProps {
  baseToken: TokenConfig | null;
  quoteToken: TokenConfig | null;
  onChangeBaseToken: (token: TokenConfig) => void;
  onChangeQuoteToken: (token: TokenConfig) => void;
}

export const TokenPriceChart = ({
  baseToken,
  quoteToken,
  onChangeBaseToken,
  onChangeQuoteToken,
}: TokenPriceChartProps) => {
  const [interval, setInterval] = useState<ChartInterval>("1h");
  const [widgetError, setWidgetError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const tvSymbol = mapPairToTradingViewSymbol(baseToken, quoteToken);

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;

    if (!baseToken || !quoteToken || !tvSymbol) {
      if (container) {
        container.innerHTML = "";
      }
      return;
    }

    // Reset error state in the async flow instead of synchronously
    loadTradingViewScript()
      .then(() => {
        if (cancelled) return;
        const TradingView = window.TradingView;
        if (!TradingView || !containerRef.current) {
          setWidgetError("TradingView widget not available");
          return;
        }

        // Clear previous widget instance when changing pair / interval
        containerRef.current.innerHTML = "";

        const tvInterval = mapIntervalToTradingView(interval);

        new TradingView.widget({
          container_id: TRADING_VIEW_CONTAINER_ID,
          symbol: tvSymbol,
          interval: tvInterval,
          timezone: "Etc/UTC",
          theme: "dark",
          style: 1, // candlesticks
          locale: "en",
          autosize: true,
          hide_side_toolbar: false,
          hide_top_toolbar: false,
          allow_symbol_change: false,
          save_image: false,
          studies: [],
          details: false,
          withdateranges: true,
        });

        // Clear error on successful widget creation
        setWidgetError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setWidgetError(
          err instanceof Error ? err.message : "Failed to load chart"
        );
      });

    return () => {
      cancelled = true;
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [baseToken, quoteToken, tvSymbol, interval]);

  const baseForTitle = baseToken
    ? TV_BASE_SYMBOL_MAP[baseToken.symbol] ?? baseToken.symbol
    : null;
  const quoteForTitle = quoteToken
    ? TV_BASE_SYMBOL_MAP[quoteToken.symbol] ?? quoteToken.symbol
    : null;
  const title =
    baseToken && quoteToken && tvSymbol && baseForTitle && quoteForTitle
      ? `${baseForTitle}/${quoteForTitle} Price`
      : "Token Price";

  return (
    <div className="rounded-none border border-neutral-800 bg-neutral-950 p-4 text-xs text-neutral-300">
      <div className="mb-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-neutral-50">{title}</h2>
            <p className="text-[11px] text-neutral-500">
              TradingView chart using MEXC spot data ({interval} interval)
            </p>
          </div>
          <div className="flex gap-1">
            {INTERVALS.map((intv) => (
              <button
                key={intv}
                type="button"
                onClick={() => setInterval(intv)}
                className={[
                  "h-7 px-2 text-[11px] font-medium uppercase tracking-wide",
                  intv === interval
                    ? "bg-sky-500 text-white"
                    : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {intv}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[220px] flex-1">
            <TokenSelect
              label="Base token"
              selected={baseToken}
              onSelect={onChangeBaseToken}
              excludeAddress={quoteToken?.address}
            />
          </div>
          <div className="min-w-[220px] flex-1">
            <TokenSelect
              label="Quote token"
              selected={quoteToken}
              onSelect={onChangeQuoteToken}
              excludeAddress={baseToken?.address}
            />
          </div>
        </div>
      </div>

      {(!baseToken || !quoteToken) && (
        <div className="py-10 text-center text-[11px] text-neutral-500">
          Select both base and quote tokens to see the TradingView price chart.
        </div>
      )}

      {baseToken && quoteToken && !tvSymbol && (
        <div className="py-10 text-center text-[11px] text-neutral-500">
          No TradingView symbol mapping for {baseToken.symbol}/
          {quoteToken.symbol}. Chart unavailable.
        </div>
      )}

      {baseToken && quoteToken && tvSymbol && widgetError && (
        <div className="py-10 text-center text-[11px] text-red-300">
          Failed to load chart: {widgetError}
        </div>
      )}

      {baseToken && quoteToken && tvSymbol && !widgetError && (
        <div className="mt-1 h-80 w-full bg-neutral-950">
          <div
            id={TRADING_VIEW_CONTAINER_ID}
            ref={containerRef}
            className="h-full w-full"
          />
        </div>
      )}
    </div>
  );
};
