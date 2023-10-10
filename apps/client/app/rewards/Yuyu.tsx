"use client";

import { SubmitButton } from "@/components/SubmitButton";
import { useRewards } from "@/hooks/useRewards";
import { formatUnits } from "@/lib/utils";

import { Stat } from "./Stat";

interface Props {
  address: `0x${string}`;
}

export function Yuyu({ address }: Props) {
  const { read, write } = useRewards(address);

  const { earned, dataLoading, dataError } = read;
  const {
    getReward,
    isTransactionSuccess,
    isWaitingForTransaction,
    methodLoading,
    methodError,
  } = write;

  const disabled = !getReward || methodLoading || dataLoading || dataError;

  function claim() {
    if (disabled) return;
    getReward();
  }

  const value = dataLoading
    ? "..."
    : dataError
      ? "Error loading rewards."
      : earned
        ? formatUnits(earned)
        : "0.00";

  const currency = dataError ? "" : "YUYU";

  return (
    <Stat title="Claimable rewards" value={value} currency={currency}>
      <div className="absolute inset-y-0 right-4 flex items-center pt-2">
        <SubmitButton disabled={disabled} onClick={claim}>
          Claim
        </SubmitButton>
      </div>

      {methodError ? (
        <p className="text-red-500">Error claiming rewards.</p>
      ) : isWaitingForTransaction ? (
        <p className="text-slate-500">Waiting for transaction...</p>
      ) : isTransactionSuccess ? (
        <p className="text-sky-400">Successfully claimed rewards! 🎉</p>
      ) : null}
    </Stat>
  );
}
