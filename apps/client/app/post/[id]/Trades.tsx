"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

import Avatar from "@/components/Avatar";
import { ETH_SYMBOL, formatAddress, formatUnits } from "@/lib/utils";

import etherscan from "./etherscan-logo-circle-light.svg";
import { getTrades } from "./getTrades";

type Trade = {
  hash: string;
  side: number;
  price: number;
  amount: number;
  trader: {
    address: string;
    username: string | null;
    avatar: string | null;
  };
};

interface Props {
  shareId: number;
}

export function Trades({ shareId }: Props) {
  const [pending, startTransition] = useTransition();
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    startTransition(async () => {
      const newTrades = await getTrades({ shareId });
      setTrades(newTrades);
    });
  }, [shareId]);

  return (
    <ul className="space-y-2">
      {trades.length === 0 && pending ? (
        <li className="h-8 w-full animate-pulse rounded-lg bg-slate-700" />
      ) : null}

      {trades.map((trade) => {
        const sign = trade.side === 0 ? "+" : "-";
        const verb = trade.side === 0 ? "bought" : "sold";
        const price = BigInt(trade.price);
        const amount = trade.amount;
        const hash = trade.hash;

        return (
          <li key={hash} className="flex items-center space-x-2 text-sm">
            <Avatar
              uniqueKey={trade.trader.username ?? trade.trader.address}
              size={24}
              src={trade.trader.avatar}
              draggable={false}
            />

            <div className="space-x-1">
              {trade.trader.username ? (
                <Link href={`/@${trade.trader.username}`} className="font-bold">
                  {trade.trader.username}
                </Link>
              ) : (
                <span>{formatAddress(trade.trader.address)}</span>
              )}
              <span className="text-slate-400">{verb}</span>
              <span className="font-bold text-white">{amount}</span>
              <span className="text-slate-400">
                share{amount > 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex w-full items-center justify-end space-x-2">
              <div
                className={`text-sm ${sign === "+" ? "text-sky-500" : "text-amber-500"
                  }`}
              >
                {sign}
                {formatUnits(price, 4)} {ETH_SYMBOL}
              </div>

              <Link
                href={`https://etherscan.io/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:opacity-80 active:opacity-70"
              >
                <Image src={etherscan} width={16} height={16} alt="Etherscan" />
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
