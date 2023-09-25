"use client";
import { useEffect, useState } from "react";

import { useRewards } from "@/hooks/useRewards";
import { formatUnits } from "@/lib/utils";

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
      <div className="mt-6 flex w-full flex-wrap items-center justify-around">
        <div className="mt-6 w-full min-w-[200px] max-w-[400px] rounded-xl border p-6 text-left sm:w-96">
          <h3 className="text-xl font-bold sm:text-2xl">Your Rewards</h3>
          <p className="mt-4 text-lg sm:text-xl">{earnedStatus}</p>
          <button
            className="mt-4 rounded-lg bg-black px-4 py-2 text-lg font-bold text-white sm:text-xl"
            onClick={getReward ? getReward : undefined}
          >
            {claimStatus || "Claim"}
          </button>
        </div>
      </div>
    </div>
  );
}
