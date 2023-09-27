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
    isPrepareBuyError,
    isPrepareSellError,
    isReadError,
    isBuyLoading,
    isReadLoading,
    isSellLoading,
  } = useMarket(shareId);

  const hasShares = true; // TODO: Replace with real value
  const canSell = hasShares && sellPrice;

  const disableBuy = !buy || isBuyLoading || isReadLoading || isPrepareBuyError;
  const disableSell =
    !sell || isSellLoading || isReadLoading || isPrepareSellError;

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
          className={`w-full rounded-md bg-sky-600 py-2 font-bold transition ${disableBuy ? "opacity-50" : "hover:bg-sky-500 active:scale-95"
            }`}
        >
          Buy
        </button>
        <div className="text-center text-sm text-slate-400">
          {isReadError || isPrepareBuyError
            ? "Error"
            : !buyPrice
              ? "..."
              : formatEther(buyPrice)}
        </div>
      </div>

      {canSell ? (
        <div className="w-full space-y-1">
          <button
            disabled={disableSell}
            onClick={() => {
              if (!disableSell && sell) {
                sell();
              }
            }}
            className={`w-full rounded-md bg-amber-600 py-2 font-bold transition ${disableSell
                ? "cursor-default opacity-50"
                : "hover:bg-amber-500 active:scale-95"
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
      ) : null}
    </div>
  );
}
