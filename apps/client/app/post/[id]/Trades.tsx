import { db } from "@/lib/db";
import { formatUnits, formatAddress, ethSymbol } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Props {
  shareId: number;
}

export const Trades = async ({ shareId }: Props) => {
  const trades = await db.query.trades.findMany({
    limit: 10,
    where: (row, { eq }) => eq(row.shareId, shareId),
    orderBy: (row, { desc }) => desc(row.id),
  });

  console.log("trades: ", trades);

  const tradesList = trades.map((trade) => {
    const side = trade.side === 0 ? "Buy" : "Sell";
    const trader = trade.trader;
    const price = BigInt(trade.price);
    const amount = trade.amount;
    const hash = trade.hash;
    return (
      <Link
        href={`https://goerli.etherscan.io/tx/${hash}`}
        key={hash}
        rel="noopener noreferrer"
        target="_blank"
      >
        <li className="w-full rounded-md bg-slate-900 px-4 py-1 hover:bg-gray-700 cursor-pointer">
          <div className="flex justify-between">
            <div className="text-sm text-gray-400">{formatAddress(trader)}</div>
            <div className="text-sm text-gray-400">{side}</div>
          </div>
          <div className="flex justify-between">
            <div className="text-sm text-gray-400">
              {formatUnits(price, 4)} {ethSymbol}
            </div>
            <div className="text-sm text-gray-400">{amount}</div>
          </div>
        </li>
      </Link>
    );
  });

  return (
    <div className="space-y-2">
      <div className="text-lg font-bold">Trades</div>
      <ul className="space-y-2">{tradesList}</ul>
    </div>
  );
};
