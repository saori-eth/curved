import { formatEther } from "viem";
export const formatUnits = (value: bigint) => {
  const ethValue = formatEther(value);
  const twoDecimalValue = Number(ethValue).toFixed(2);
  return twoDecimalValue;
};
