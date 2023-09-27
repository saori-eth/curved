import Link from "next/link";

import { db } from "@/lib/db";
import { ethSymbol, formatAddress, formatUnits } from "@/lib/utils";

interface Props {
  shareId: number;
}

export const Trades = async ({ shareId }: Props) => {
  const trades = await db.query.trades.findMany({
    limit: 10,
    orderBy: (row, { desc }) => desc(row.id),
    where: (row, { eq }) => eq(row.shareId, shareId),
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
        <li className="w-full cursor-pointer rounded-md bg-slate-900 px-4 py-1 hover:bg-gray-700">
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
