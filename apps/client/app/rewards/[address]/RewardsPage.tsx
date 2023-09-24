"use client";
import Image from "next/image";
import { useAuth } from "../../AuthProvider";
import {
  useAccount,
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
} from "wagmi";
import { CURVED_ABI } from "@/lib/abi/curved";

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
    address: process.env.NEXT_PUBLIC_CURVED_ADDRESS as `0x${string}`,
    abi: CURVED_ABI,
    functionName: "earned",
    args: [address],
    enabled: Boolean(address),
    onSuccess: (data) => {
      console.log("data", data);
    },
    onError: (error) => {
      console.log("error", error);
    },
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">Rewards</h1>
        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <div className="p-6 mt-6 text-left border w-96 rounded-xl shadow-2xl">
            <h3 className="text-2xl font-bold">Your Rewards</h3>
            <p className="mt-4 text-xl">
              {isLoading ? "Loading..." : data?.toString()}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
