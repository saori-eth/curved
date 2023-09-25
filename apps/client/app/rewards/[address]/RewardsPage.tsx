"use client";
import { formatUnits } from "@/lib/utils";
import { useRewards } from "@/hooks/useRewards";
import { useState, useEffect } from "react";

interface Props {
  user: any;
}

export function RewardsPage({ user }: Props) {
  const [earnedStatus, setEarnedStatus] = useState("");
  const [claimStatus, setClaimStatus] = useState("");
  const { read, write } = useRewards(user.address);
  const { earned, dataLoading, dataError } = read;
  const { getReward, methodLoading, methodError, methodSuccess } = write;

  useEffect(() => {
    if (dataLoading) {
      setEarnedStatus("Loading...");
    } else if (dataError) {
      setEarnedStatus("Error loading rewards");
    } else if (earned) {
      setEarnedStatus(`${formatUnits(earned)} CURVED`);
    }
  }, [dataLoading, dataError, earned]);

  useEffect(() => {
    if (methodLoading) {
      setClaimStatus("Loading...");
    } else if (methodError) {
      setClaimStatus("Error claiming rewards");
      setTimeout(() => {
        setClaimStatus("Claim");
      }, 3000);
    } else if (methodSuccess) {
      setClaimStatus("Claimed!");
      setTimeout(() => {
        setClaimStatus("Claim");
      }, 3000);
    } else {
      setClaimStatus("Claim");
    }
  }, [methodLoading, methodError]);

  return (
    <div className="flex flex-col items-center justify-start py-2">
      <h1 className="text-6xl font-bold">Rewards</h1>
      <div className="mt-6 flex max-w-4xl flex-wrap items-center justify-around sm:w-full">
        <div className="mt-6 w-96 rounded-xl border p-6 text-left shadow-2xl">
          <h3 className="text-2xl font-bold">Your Rewards</h3>
          <p className="mt-4 text-xl">{earnedStatus}</p>
          <button
            className="mt-4 rounded-lg bg-black px-4 py-2 text-xl font-bold text-white"
            onClick={getReward ? getReward : undefined}
          >
            {claimStatus || "Claim"}
          </button>
        </div>
      </div>
    </div>
  );
}
