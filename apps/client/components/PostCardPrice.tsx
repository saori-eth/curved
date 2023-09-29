"use client";

import { usePostPrice } from "@/hooks/usePostPrice";

interface Props {
  shareId: number;
}

export function PostCardPrice({ shareId }: Props) {
  const { price, isError } = usePostPrice(shareId);

  if (price) {
    return <div className="text-sm text-slate-400">{price} ETH</div>;
  }

  if (isError) {
    return <div className="text-sm text-slate-400">??? ETH</div>;
  }

  return null;
}
