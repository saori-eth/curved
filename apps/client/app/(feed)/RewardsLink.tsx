"use client";

import Image from "next/image";
import Link from "next/link";
import { useContractRead } from "wagmi";

import { CURVED_ABI } from "@/lib/abi/curved";
import { env } from "@/lib/env.mjs";
import { formatUnits } from "@/lib/utils";
import Logo from "@/public/images/favicon-16x16.png";

import { useAuth } from "../AuthProvider";

export function RewardsLink() {
  const { user } = useAuth();

  const { data: earned } = useContractRead({
    abi: CURVED_ABI,
    address: env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    args: user ? [user.address] : undefined,
    enabled: Boolean(user),
    functionName: "earned",
  });

  if (!user) {
    return null;
  }

  return (
    <Link
      href="/rewards"
      title="Rewards"
      className="flex items-center space-x-1 rounded-full border border-slate-600 px-1.5 py-0.5 text-sm font-semibold transition hover:border-slate-500 hover:bg-slate-700 active:opacity-90"
    >
      <Image src={Logo} alt="YUYU Logo" />
      <span>
        {earned
          ? Number(formatUnits(earned)).toLocaleString(undefined, {
            useGrouping: true,
          })
          : "0.00"}
      </span>
      <span className="text-slate-400">YUYU</span>
    </Link>
  );
}
