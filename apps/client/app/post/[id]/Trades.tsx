import Image from "next/image";
import Link from "next/link";

import Avatar from "@/components/Avatar";
import { db } from "@/lib/db";
import { fetchProfileFromAddress } from "@/lib/fetchProfile";
import { ETH_SYMBOL, formatAddress, formatUnits } from "@/lib/utils";

import etherscan from "./etherscan-logo-circle-light.svg";

interface Props {
  shareId: number;
}

export const Trades = async ({ shareId }: Props) => {
  const trades = await db.query.trades.findMany({
    limit: 10,
    orderBy: (row, { desc }) => desc(row.id),
    where: (row, { eq }) => eq(row.shareId, shareId),
  });

  const tradesList = trades.map(async (trade) => {
    const sign = trade.side === 0 ? "+" : "-";
    const verb = trade.side === 0 ? "bought" : "sold";
    const trader = trade.trader;
    const price = BigInt(trade.price);
    const amount = trade.amount;
    const hash = trade.hash;

    const profile = await fetchProfileFromAddress(trader);

    return (
      <li key={hash} className="flex items-center space-x-2 text-sm">
        <Avatar
          uniqueKey={profile ? profile.username : trader}
          size={24}
          src={profile ? profile.avatar : undefined}
          draggable={false}
        />

        <div className="space-x-1">
          <span>
            {profile ? (
              <Link href={`/@${profile.username}`} className="font-bold">
                {profile.username}
              </Link>
            ) : (
              <p>{formatAddress(trader)}</p>
            )}
          </span>
          <span className="text-slate-400">{verb}</span>
          <span className="font-bold text-white">{amount}</span>
          <span className="text-slate-400">share{amount > 1 ? "s" : ""}</span>
        </div>

        <div className="flex w-full items-center justify-end space-x-2">
          <div
            className={`text-sm ${sign === "+" ? "text-sky-500" : "text-amber-500"
              }`}
          >
            {sign}
            {formatUnits(price, 4)} {ETH_SYMBOL}
          </div>

          <Link
            href={`https://etherscan.io/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:opacity-80 active:opacity-70"
          >
            <Image src={etherscan} width={16} height={16} alt="Etherscan" />
          </Link>
        </div>
      </li>
    );
  });

  await Promise.all(tradesList);

  return (
    <div className="space-y-2">
      <div className="text-lg font-bold text-slate-400">Trades</div>
      <ul className="space-y-2">{tradesList}</ul>
    </div>
  );
};
