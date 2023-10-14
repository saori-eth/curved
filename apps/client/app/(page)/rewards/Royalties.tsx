import { formatEther } from "viem";

import { fetchRoyalties } from "@/lib/fetchRoyalties";

import { Stat } from "./Stat";

interface Props {
  address: string;
}

export async function Royalties({ address }: Props) {
  const earned = await fetchRoyalties(address);

  return (
    <Stat
      title="Royalties earned"
      value={earned ? formatEther(earned) : undefined}
      currency="ETH"
    />
  );
}
