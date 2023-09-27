"use client";
import {
  useAccount,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { CURVED_ABI } from "@/lib/abi/curved";

const contracts = {
  abi: CURVED_ABI,
  address: process.env.NEXT_PUBLIC_CURVED_ADDRESS as `0x${string}` | undefined,
  watch: true,
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
      {
        abi: contracts.abi,
        address: contracts.address as `0x${string}`,
        args: [BigInt(shareId), address as `0x${string}`],
        functionName: "getShareBalance",
      },
    ],
    watch: true,
  });

  const buyPrice = data ? data[0].result : undefined;
  const sellPrice = data ? data[1].result : undefined;
  const shareBalance = data ? data[2].result : undefined;

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

  const {
    write: buy,
    isLoading: isBuyLoading,
    data: buyResult,
  } = useContractWrite(buyConfig);
  const {
    write: sell,
    isLoading: isSellLoading,
    data: sellResult,
  } = useContractWrite(sellConfig);

  const { isSuccess: doneBuying, isLoading: waitingForBuy } =
    useWaitForTransaction({
      enabled: Boolean(buyResult),
      hash: buyResult?.hash,
    });
  const { isSuccess: doneSelling, isLoading: waitingForSell } =
    useWaitForTransaction({
      enabled: Boolean(sellResult),
      hash: sellResult?.hash,
    });

  return {
    buy,
    buyPrice,
    doneBuying,
    doneSelling,
    isBuyLoading: isBuyLoading || isPrepareBuyLoading,
    isPrepareBuyError,
    isPrepareSellError,
    isReadError,
    isReadLoading,
    isSellLoading: isSellLoading || isPrepareSellLoading,
    sell,
    sellPrice,
    shareBalance,
    waitingForBuy,
    waitingForSell,
  };
};
