"use client";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";

import { CURVED_ABI } from "@/lib/abi/curved";

const contracts = {
  abi: CURVED_ABI,
  address: process.env.NEXT_PUBLIC_CURVED_ADDRESS,
};

export const useRewards = (address: string) => {
  const {
    data: earned,
    isLoading: dataLoading,
    isError: dataError,
  } = useContractRead({
    abi: contracts.abi,
    address: contracts.address as `0x${string}`,
    args: [address as `0x${string}`],
    functionName: "earned",
    watch: Boolean(address),
  });

  const { config } = usePrepareContractWrite({
    abi: contracts.abi,
    address: contracts.address as `0x${string}`,
    enabled: Boolean(address),
    functionName: "getReward",
  });

  const {
    write: getReward,
    isLoading: isGetRewardLoading,
    isError: isGetRewardError,
    isSuccess: isGetRewardSuccess,
  } = useContractWrite(config);

  return {
    read: {
      dataError,
      dataLoading,
      earned,
    },
    write: {
      getReward,
      methodError: isGetRewardError,
      methodLoading: isGetRewardLoading,
      methodSuccess: isGetRewardSuccess,
    },
  };
};
