"use server";

import { z } from "zod";

import { db } from "@/lib/db";
import { getAvatarUrl } from "@/lib/getAvatarUrl";

const GetTradesSchema = z.object({
  shareId: z.number(),
});

type GetTradesArgs = z.infer<typeof GetTradesSchema>;

export async function getTrades(args: GetTradesArgs) {
  const { shareId } = GetTradesSchema.parse(args);

  const trades = await db.query.trades.findMany({
    columns: {
      amount: true,
      hash: true,
      price: true,
      side: true,
      trader: true,
    },
    limit: 10,
    orderBy: (row, { desc }) => desc(row.id),
    where: (row, { eq }) => eq(row.shareId, shareId),
  });

  const traders = trades.map((trade) => trade.trader);

  const profiles = await db.query.user.findMany({
    columns: {
      address: true,
      avatarId: true,
      username: true,
    },
    where: (row, { inArray }) => inArray(row.address, traders),
  });

  const withProfiles = trades.map((trade) => {
    const profile = profiles.find(
      (profile) => profile.address.toLowerCase() === trade.trader.toLowerCase(),
    );

    return {
      ...trade,
      trader: {
        address: trade.trader,
        avatar: getAvatarUrl(profile?.avatarId),
        username: profile?.username ?? null,
      },
    };
  });

  return withProfiles;
}
