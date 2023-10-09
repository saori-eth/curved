import { formatEther } from "viem";

import { getSession } from "@/lib/auth/getSession";
import { fetchRoyalties } from "@/lib/fetchRoyalties";
import { ETH_SYMBOL } from "@/lib/utils";

interface Props {
  address: string;
}

export async function RoyaltiesEarned({ address }: Props) {
  const session = await getSession();

  if (session?.user.address !== address) {
    return null;
  }

  const royaltiesEarned = await fetchRoyalties(address);

  return (
    <>
      <p className="text-center text-lg">
        <span className="font-bold">{formatEther(royaltiesEarned ?? 0n)} </span>
        <span className="text-slate-400">{ETH_SYMBOL} earned</span>
      </p>
    </>
  );
}
