"use client";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";

import { CURVED_ABI } from "@/lib/abi/curved";

const contracts = {
  abi: CURVED_ABI,
  address: process.env.NEXT_PUBLIC_CURVED_ADDRESS as `0x${string}`,
};

export const useRewards = (address: `0x${string}` | undefined) => {
  const {
    data: earned,
    isLoading: dataLoading,
    isError: dataError,
  } = useContractRead({
    abi: contracts.abi,
    address: contracts.address,
    args: address ? [address] : undefined,
    enabled: Boolean(address),
    functionName: "earned",
    watch: true,
  });

  const { config } = usePrepareContractWrite({
    abi: contracts.abi,
    address: contracts.address,
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
