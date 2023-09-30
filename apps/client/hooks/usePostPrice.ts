import { formatEther } from "viem";
import { useContractRead } from "wagmi";

import { CURVED_ABI } from "@/lib/abi/curved";
import { env } from "@/lib/env.mjs";

export function usePostPrice(shareId: number) {
  const { data, isLoading, isError } = useContractRead({
    abi: CURVED_ABI,
    address: env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    args: [BigInt(shareId), BigInt(1)],
    functionName: "getBuyPriceAfterFee",
    suspense: true,
  });

  const price = data ? formatEther(data) : null;

  return { isError, isLoading, price };
}
