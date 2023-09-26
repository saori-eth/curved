import { db } from "@/lib/db";
import { formatUnits, formatAddress } from "@/lib/utils";

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
    return (
      <li className="w-full rounded-md bg-slate-900 px-4 py-1">
        <div className="flex justify-between">
          <div className="text-sm text-gray-400">{formatAddress(trader)}</div>
          <div className="text-sm text-gray-400">{side}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-sm text-gray-400">{formatUnits(price, 4)}</div>
          <div className="text-sm text-gray-400">{amount}</div>
        </div>
      </li>
    );
  });

  return (
    <div className="space-y-2">
      <div className="text-lg font-bold">Trades</div>
      <ul className="space-y-2">{tradesList}</ul>
    </div>
  );
};
