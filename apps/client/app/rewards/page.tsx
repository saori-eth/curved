"use client";

import { useRewards } from "@/hooks/useRewards";
import { formatUnits } from "@/lib/utils";

import { useAuth } from "../AuthProvider";

export default function Post() {
  const { user } = useAuth();
  const { read, write } = useRewards(user?.address);

  const { earned, dataLoading, dataError } = read;
  const {
    getReward,
    isTransactionSuccess,
    isWaitingForTransaction,
    methodLoading,
    methodError,
  } = write;

  const disabled =
    !user || !getReward || methodLoading || dataLoading || dataError;

  function claim() {
    if (disabled) return;
    getReward();
  }

  return (
    <div className="m-4 space-y-2 pt-4">
      <h1 className="text-center text-5xl">🎁</h1>
      <h2 className="text-center text-3xl font-bold">Your Rewards</h2>

      <div className="flex flex-col justify-center space-y-4 pt-2">
        <div className="rounded-xl border border-slate-400 py-6">
          {dataLoading ? (
            <p className="text-center text-lg">Loading...</p>
          ) : dataError ? (
            <p className="text-center text-lg">Error loading rewards.</p>
          ) : (
            <p className="text-center text-lg">
              <span className="font-bold">{formatUnits(earned ?? 0n)} </span>
              <span className="text-slate-400">YUYU</span>
            </p>
          )}
        </div>

        <button
          disabled={disabled}
          onClick={claim}
          className={`mx-auto w-fit rounded-full bg-slate-900 px-4 py-1 text-lg font-bold transition ${
            disabled ? "opacity-50" : "hover:bg-slate-950 active:scale-95"
          }`}
        >
          Claim
        </button>

        {!user ? (
          <p className="text-center text-slate-500">
            You must be logged in to claim rewards.
          </p>
        ) : methodError ? (
          <p className="text-center text-red-500">Error claiming rewards.</p>
        ) : isWaitingForTransaction ? (
          <p className="text-center text-slate-500">
            Waiting for transaction...
          </p>
        ) : isTransactionSuccess ? (
          <p className="text-center text-sky-400">
            Successfully claimed rewards! 🎉
          </p>
        ) : null}
      </div>
    </div>
  );
}
