"use client";

import { formatEther } from "viem";

import { useMarket } from "@/hooks/useMarket";

interface Props {
  shareId: number;
}

export function TradeButtons({ shareId }: Props) {
  const {
    buy,
    sell,
    buyPrice,
    sellPrice,
    isPrepareBuyError: isPrepateBuyError,
    isPrepareSellError,
    isReadError,
    isBuyLoading,
    isReadLoading,
    isSellLoading,
  } = useMarket(shareId);

  const hasShares = true;

  const disableBuy = isBuyLoading || isReadLoading || isPrepateBuyError;
  const disableSell = isSellLoading || isReadLoading || isPrepareSellError;

  return (
    <div className="flex w-full space-x-4">
      <div className="w-full space-y-1">
        <button
          disabled={disableBuy}
          onClick={() => {
            if (!disableBuy && buy) {
              buy();
            }
          }}
          className={`w-full rounded-md bg-green-700 py-2 transition ${disableBuy ? "opacity-50" : "hover:bg-green-600 active:scale-95"
            }`}
        >
          Buy
        </button>
        <div className="text-center text-sm text-slate-400">
          {isReadError || isPrepateBuyError
            ? "Error"
            : !buyPrice
              ? "..."
              : formatEther(buyPrice)}
        </div>
      </div>

      {hasShares && (
        <div className="w-full space-y-1">
          <button
            disabled={disableSell}
            onClick={() => {
              if (!disableSell && sell) {
                sell();
              }
            }}
            className={`w-full rounded-md bg-red-800 py-2 transition ${disableSell
                ? "cursor-default opacity-50"
                : "hover:bg-red-700 active:scale-95"
              }`}
          >
            Sell
          </button>
          <div className="text-center text-sm text-slate-400">
            {isReadError || isPrepareSellError
              ? "Error"
              : !sellPrice
                ? "..."
                : formatEther(sellPrice)}
          </div>
        </div>
      )}
    </div>
  );
}
