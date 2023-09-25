"use client";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { formatUnits } from "@/lib/utils";
import { CURVED_ABI } from "@/lib/abi/curved";
import { useMarket } from "@/hooks/useMarket";
import { useAuth } from "../../AuthProvider";
import { useEffect, useState } from "react";

interface Props {
  user: any;
  shareId: string;
}

export function TradeButtons({ user, shareId }: Props) {
  const { address } = useAccount();
  const { read, write } = useMarket(shareId);
  const { dataError, dataLoading, buyPrice, sellPrice } = read;
  const { methodError, methodLoading, buy, sell } = write;

  const hasShares = true;

  return (
    <div className="flex w-full space-x-4">
      <div className="w-full space-y-1">
        <button
          className="w-full rounded-md bg-green-700 py-2 transition hover:bg-green-600 active:opacity-90"
          onClick={() => {
            buy && buy();
          }}
        >
          Buy
        </button>
        <div className="text-center text-sm text-slate-400">
          {dataLoading
            ? "..."
            : dataError
            ? "Error"
            : formatUnits(buyPrice as bigint)}
        </div>
      </div>

      {hasShares && (
        <div className="w-full space-y-1">
          <button
            className="w-full rounded-md bg-red-800 py-2 transition hover:bg-red-700 active:opacity-90"
            onClick={() => {
              sell && sell();
            }}
          >
            Sell
          </button>
          <div className="text-center text-sm text-slate-400">
            {dataLoading
              ? "..."
              : dataError
              ? "Error"
              : formatUnits(sellPrice as bigint)}
          </div>
        </div>
      )}
    </div>
  );
}
