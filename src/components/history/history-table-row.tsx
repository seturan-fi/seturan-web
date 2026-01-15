"use client";

import Image from "next/image";
import { formatUnits } from "viem";
import { ExternalLink } from "lucide-react";
import type { HistoryItem, TransactionType } from "@/hooks/graphql/use-history";

const CHAIN_NAMES: Record<number, string> = {
  5003: "Mantle Sepolia",
  84532: "Base Sepolia",
  // LayerZero EIDs
  40267: "Mantle Sepolia",
  40245: "Base Sepolia",
};

const getTransactionTypeConfig = (type: TransactionType) => {
  const configs: Record<
    TransactionType,
    { label: string; color: string; bgColor: string }
  > = {
    supply_collateral: {
      label: "Supply Collateral",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/15 border-emerald-500/30",
    },
    supply_liquidity: {
      label: "Supply Liquidity",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/15 border-emerald-500/30",
    },
    withdraw_collateral: {
      label: "Withdraw Collateral",
      color: "text-amber-400",
      bgColor: "bg-amber-500/15 border-amber-500/30",
    },
    withdraw_liquidity: {
      label: "Withdraw Liquidity",
      color: "text-amber-400",
      bgColor: "bg-amber-500/15 border-amber-500/30",
    },
    borrow: {
      label: "Borrow",
      color: "text-blue-400",
      bgColor: "bg-blue-500/15 border-blue-500/30",
    },
    repay: {
      label: "Repay",
      color: "text-violet-400",
      bgColor: "bg-violet-500/15 border-violet-500/30",
    },
    crosschain_borrow: {
      label: "Cross-Chain Borrow",
      color: "text-pink-400",
      bgColor: "bg-pink-500/15 border-pink-500/30",
    },
    liquidation: {
      label: "Liquidation",
      color: "text-red-400",
      bgColor: "bg-red-500/15 border-red-500/30",
    },
  };
  return configs[type];
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

const getExplorerUrl = (txHash: string, type: TransactionType) => {
  if (type === "crosschain_borrow") {
    return `https://layerzeroscan.com/tx/${txHash}`;
  }
  return `https://sepolia.mantlescan.xyz/tx/${txHash}`;
};

interface HistoryTableRowProps {
  item: HistoryItem;
}

export const HistoryTableRow = ({ item }: HistoryTableRowProps) => {
  const config = getTransactionTypeConfig(item.type);
  const explorerUrl = getExplorerUrl(item.txHash, item.type);

  const getTokenInfo = () => {
    if (!item.pool) return null;

    if (
      item.type === "supply_collateral" ||
      item.type === "withdraw_collateral"
    ) {
      return item.pool.collateral;
    }
    return item.pool.borrow;
  };

  const tokenInfo = getTokenInfo();
  const decimals = tokenInfo?.decimals || 18;
  const formattedAmount = formatUnits(BigInt(item.amount || "0"), decimals);

  return (
    <tr className="bg-neutral-950/40 transition-colors hover:bg-neutral-900/70">
      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center rounded-none border px-2.5 py-1 text-xs font-medium ${config.bgColor} ${config.color}`}
        >
          {config.label}
        </span>
      </td>

      <td className="px-4 py-4">
        {item.pool ? (
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-12">
              <div className="absolute left-0 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full border border-neutral-800 bg-neutral-900">
                <Image
                  src={item.pool.collateral.logoUrl}
                  alt={item.pool.collateral.symbol}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full"
                />
              </div>
              <div className="absolute right-0 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full border border-neutral-800 bg-neutral-900">
                <Image
                  src={item.pool.borrow.logoUrl}
                  alt={item.pool.borrow.symbol}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-neutral-100">
                {item.pool.collateral.symbol} / {item.pool.borrow.symbol}
              </span>
              <span className="text-xs text-neutral-500">
                {formatAddress(item.lendingPoolAddress)}
              </span>
            </div>
          </div>
        ) : (
          <span className="text-sm text-neutral-400">
            {formatAddress(item.lendingPoolAddress)}
          </span>
        )}
      </td>

      <td className="px-4 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-neutral-100">
            {parseFloat(formattedAmount).toLocaleString(undefined, {
              maximumFractionDigits: 6,
            })}
          </span>
          {tokenInfo && (
            <span className="text-xs text-neutral-500">{tokenInfo.symbol}</span>
          )}
        </div>
      </td>

      <td className="px-4 py-4">
        <span className="text-sm text-neutral-300">
          {formatAddress(item.user)}
        </span>
      </td>

      <td className="px-4 py-4">
        {item.type === "crosschain_borrow" && item.destChainId ? (
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-neutral-400">
              {CHAIN_NAMES[5003] || "Mantle Sepolia"}
            </span>
            <span className="text-xs text-pink-400">
              → {CHAIN_NAMES[item.destChainId] || `Chain ${item.destChainId}`}
            </span>
          </div>
        ) : (
          <span className="text-sm text-neutral-400">
            {CHAIN_NAMES[item.contractChainId] || `Chain ${item.contractChainId}`}
          </span>
        )}
      </td>

      <td className="px-4 py-4">
        <span className="text-sm text-neutral-400">
          {formatTimestamp(item.timestamp)}
        </span>
      </td>

      <td className="px-4 py-4">
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-400 transition-colors hover:text-neutral-100"
        >
          <span>{formatAddress(item.txHash)}</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
        {item.type === "crosschain_borrow" && (
          <div className="mt-0.5 text-[10px] text-pink-400">LayerZero</div>
        )}
      </td>
    </tr>
  );
};
