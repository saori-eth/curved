"use client";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { formatUnits } from "@/lib/utils";
import { CURVED_ABI } from "@/lib/abi/curved";

import { useAuth } from "../../AuthProvider";
import { useEffect, useState } from "react";

interface Props {
  user: any;
  shareId: string;
}

export function TradeButtons({ user, shareId }: Props) {
  const { address } = useAccount();

  const hasShares = true;

  const {
    data: buyPrice,
    isError: buyPriceError,
    isLoading: buyPriceLoading,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_CURVED_ADDRESS as `0x${string}`,
    abi: CURVED_ABI,
    args: [shareId, 1],
    enabled: Boolean(address),
    watch: true,
    functionName: "getBuyPriceAfterFee",
  });

  const {
    data: sellPrice,
    isError: sellPriceError,
    isLoading: sellPriceLoading,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_CURVED_ADDRESS as `0x${string}`,
    abi: CURVED_ABI,
    args: [shareId, 1],
    enabled: Boolean(address),
    watch: true,
    functionName: "getSellPriceAfterFee",
  });

  return (
    <div className="flex w-full space-x-4">
      <div className="w-full space-y-1">
        <button className="w-full rounded-md bg-green-700 py-2 transition hover:bg-green-600 active:opacity-90">
          Buy
        </button>
        <div className="text-center text-sm text-slate-400">
          {buyPriceLoading ? "Loading..." : formatUnits(buyPrice as bigint)} ETH
        </div>
      </div>

      {hasShares && (
        <div className="w-full space-y-1">
          <button className="w-full rounded-md bg-red-800 py-2 transition hover:bg-red-700 active:opacity-90">
            Sell
          </button>
          <div className="text-center text-sm text-slate-400">
            {sellPriceLoading ? "Loading..." : formatUnits(sellPrice as bigint)}{" "}
            ETH
          </div>
        </div>
      )}
    </div>
  );
}
