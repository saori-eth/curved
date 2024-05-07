import { formatEther } from "viem";

export const formatUnits = (value: bigint, decimals = 2) => {
  const ethValue = formatEther(value);
  const formatted = Number(ethValue).toFixed(decimals);
  return formatted;
};

export const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const ETH_SYMBOL = "Ξ";
