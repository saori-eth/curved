"use client";
import { formatEther } from "viem";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";

import { CURVED_ABI } from "@/lib/abi/curved";

import { useAuth } from "../../AuthProvider";

interface Props {
  user: any;
}

export function RewardsPage({ user }: Props) {
  const { address } = useAccount();
  const { status } = useAuth();

  console.log("user", user);
  console.log("address", address);
  console.log("status", status);

  const { data, isError, isLoading } = useContractRead({
    abi: CURVED_ABI,
    address: process.env.NEXT_PUBLIC_CURVED_ADDRESS as `0x${string}`,
    args: [address],
    enabled: Boolean(address),
    functionName: "earned",
    watch: true,
  });

  const {
    config,
    isError: isErrorPrepare,
    error: errorPrepare,
    isLoading: isLoadingPrepare,
  } = usePrepareContractWrite({
    abi: CURVED_ABI,
    account: address,
    address: process.env.NEXT_PUBLIC_CURVED_ADDRESS as `0x${string}`,
    enabled: Boolean(address),
    functionName: "getReward",
  });

  const {
    write,
    isLoading: isLoadingWrite,
    error: errorWrite,
  } = useContractWrite(config);

  const formatUnits = (value: bigint) => {
    const ethValue = formatEther(value);
    const twoDecimalValue = Number(ethValue).toFixed(2);
    return twoDecimalValue;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <main className="flex flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-6xl font-bold">Rewards</h1>
        <div className="mt-6 flex max-w-4xl flex-wrap items-center justify-around sm:w-full">
          <div className="mt-6 w-96 rounded-xl border p-6 text-left shadow-2xl">
            <h3 className="text-2xl font-bold">Your Rewards</h3>
            <p className="mt-4 text-xl">
              {isLoading
                ? "Loading..."
                : `${formatUnits(data as bigint)} CURVED`}
            </p>
            <button
              className="mt-4 rounded-lg bg-black px-4 py-2 text-xl font-bold text-white"
              onClick={write}
            >
              {isLoadingWrite ? "Loading..." : "Claim"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
