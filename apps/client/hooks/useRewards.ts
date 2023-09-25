"use client";
import { CURVED_ABI } from "@/lib/abi/curved";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";

const contracts = {
  address: process.env.NEXT_PUBLIC_CURVED_ADDRESS,
  abi: CURVED_ABI,
};

export const useRewards = (address: string) => {
  const {
    data: earned,
    isLoading: dataLoading,
    isError: dataError,
  } = useContractRead({
    address: contracts.address as `0x${string}`,
    abi: contracts.abi,
    functionName: "earned",
    args: [address as `0x${string}`],
  });

  const { config } = usePrepareContractWrite({
    address: contracts.address as `0x${string}`,
    abi: contracts.abi,
    functionName: "getReward",
    enabled: Boolean(address),
  });

  const {
    write: getReward,
    isLoading: isGetRewardLoading,
    isError: isGetRewardError,
    isSuccess: isGetRewardSuccess,
  } = useContractWrite(config);

  return {
    read: {
      earned,
      dataLoading,
      dataError,
    },
    write: {
      getReward,
      methodLoading: isGetRewardLoading,
      methodError: isGetRewardError,
      methodSuccess: isGetRewardSuccess,
    },
  };
};
