import { formatEther } from "viem";

export const formatUnits = (value: bigint, decimals?: number) => {
  const ethValue = formatEther(value);
  const formatted = Number(ethValue).toFixed(decimals || 2);
  return formatted;
};

export const formatAddress = (address: string) => {
  return `${address.slice(0, 2)}...${address.slice(-4)}`;
};
