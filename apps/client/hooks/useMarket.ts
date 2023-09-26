"use client";
import {
  useAccount,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";

import { CURVED_ABI } from "@/lib/abi/curved";

const contracts = {
  abi: CURVED_ABI,
  address: process.env.NEXT_PUBLIC_CURVED_ADDRESS as `0x${string}` | undefined,
};

export const useMarket = (shareId: number) => {
  const { address } = useAccount();

  const {
    data,
    isLoading: isReadLoading,
    isError: isReadError,
  } = useContractReads({
    contracts: [
      {
        abi: contracts.abi,
        address: contracts.address as `0x${string}`,
        args: [BigInt(shareId), BigInt(1)],
        functionName: "getBuyPriceAfterFee",
      },
      {
        abi: contracts.abi,
        address: contracts.address as `0x${string}`,
        args: [BigInt(shareId), BigInt(1)],
        functionName: "getSellPriceAfterFee",
      },
    ],
  });

  const buyPrice = data ? data[0].result : undefined;
  const sellPrice = data ? data[1].result : undefined;

  const {
    config: buyConfig,
    isLoading: isPrepareBuyLoading,
    isError: isPrepareBuyError,
  } = usePrepareContractWrite({
    abi: contracts.abi,
    address: contracts.address,
    args: [BigInt(shareId), BigInt(1)],
    enabled: Boolean(address) && Boolean(buyPrice),
    functionName: "buyShare",
    value: buyPrice,
  });

  const {
    config: sellConfig,
    isLoading: isPrepareSellLoading,
    isError: isPrepareSellError,
  } = usePrepareContractWrite({
    abi: contracts.abi,
    address: contracts.address,
    args: [BigInt(shareId), BigInt(1)],
    enabled: Boolean(address) && Boolean(sellPrice),
    functionName: "sellShare",
  });

  const { write: buy, isLoading: isBuyLoading } = useContractWrite(buyConfig);

  const { write: sell, isLoading: isSellLoading } =
    useContractWrite(sellConfig);

  return {
    buy,
    buyPrice,
    isBuyLoading: isBuyLoading || isPrepareBuyLoading,
    isPrepareBuyError,
    isPrepareSellError: isPrepareSellError,
    isReadError,
    isReadLoading,
    isSellLoading: isSellLoading || isPrepareSellLoading,
    sell,
    sellPrice,
  };
};
