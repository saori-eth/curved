"use client";
import { CURVED_ABI } from "@/lib/abi/curved";
import {
  useAccount,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";

const contracts = {
  address: process.env.NEXT_PUBLIC_CURVED_ADDRESS,
  abi: CURVED_ABI,
};

export const useMarket = (shareId: string) => {
  const { address } = useAccount();
  const { data, isLoading, isError } = useContractReads({
    contracts: [
      {
        address: contracts.address as `0x${string}`,
        abi: contracts.abi,
        functionName: "getBuyPriceAfterFee",
        args: [BigInt(shareId), BigInt(1)],
      },
      {
        address: contracts.address as `0x${string}`,
        abi: contracts.abi,
        functionName: "getSellPriceAfterFee",
        args: [BigInt(shareId), BigInt(1)],
      },
    ],
  });

  const buyPrice = data ? data[0].result : null;
  const sellPrice = data ? data[1].result : null;

  const { config: buyConfig } = usePrepareContractWrite({
    address: contracts.address as `0x${string}`,
    abi: contracts.abi,
    functionName: "buyShare",
    args: [BigInt(shareId), BigInt(1)],
    enabled: Boolean(address),
    value: buyPrice as bigint,
  });

  const { config: sellConfig } = usePrepareContractWrite({
    address: contracts.address as `0x${string}`,
    abi: contracts.abi,
    functionName: "sellShare",
    args: [BigInt(shareId), BigInt(1)],
    enabled: Boolean(address),
  });

  const {
    write: buy,
    isLoading: isBuyLoading,
    isError: isBuyError,
  } = useContractWrite(buyConfig);

  const {
    write: sell,
    isLoading: isSellLoading,
    isError: isSellError,
  } = useContractWrite(sellConfig);

  return {
    read: {
      buyPrice,
      sellPrice,
      dataLoading: isLoading,
      dataError: isError,
    },
    write: {
      buy,
      sell,
      methodLoading: isBuyLoading || isSellLoading,
      methodError: isBuyError || isSellError,
    },
  };
};
