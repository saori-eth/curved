"use client";
import { CURVED_ABI } from "@/lib/abi/curved";
import { useContractRead } from "wagmi";
import { formatUnits } from "@/lib/utils";
import { useEffect, useState } from "react";

export const useBalance = (address: string) => {
  const [formattedBalance, setFormattedBalance] = useState<string>();
  const {
    data: balance,
    isLoading: dataLoading,
    isError: dataError,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_CURVED_ADDRESS as `0x${string}`,
    abi: CURVED_ABI,
    functionName: "balanceOf",
    enabled: Boolean(address),
    args: [address as `0x${string}`],
    watch: true,
  });

  useEffect(() => {
    if (balance) {
      setFormattedBalance(formatUnits(balance as bigint));
    }
  }, [balance]);

  return {
    balance,
    formattedBalance,
    dataLoading,
    dataError,
  };
};
