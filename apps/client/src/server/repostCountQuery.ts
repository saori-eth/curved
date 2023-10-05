import { repost } from "db";
import { eq, sql } from "drizzle-orm";

import { db } from "@/lib/db";

import { Post } from "../types/post";
import { formatPostQueryRow, PostQueryResponse } from "./postQuery";

export const repostCountQuery = (id: string, tx = db) =>
  tx
    .select({
      repostCount: sql<number>`count(*)`,
    })
    .from(repost)
    .where(eq(repost.referencePostId, id));

export const queryPostRepostCounts = async (
  data: PostQueryResponse,
  tx = db,
) => {
  const ids = data.map((post) => post.id);

  const repostCounts = await Promise.all(
    ids.map(async (id) => {
      const count = await repostCountQuery(id, tx);
      return { id, repostCount: Number(count[0]?.repostCount) };
    }),
  );

  return repostCounts.flat();
};

type RepostCountResponse = Awaited<ReturnType<typeof queryPostRepostCounts>>;

export function formatRepostCountQuery(
  data: PostQueryResponse,
  repostCounts: RepostCountResponse,
): Post[] {
  return data
    .map((row) => {
      const formatted = formatPostQueryRow(row);

      if (formatted) {
        const repostCount = repostCounts.find(
          (repostCount) => repostCount.id === row.id,
        );

        if (repostCount?.repostCount) {
          formatted.repostCount = repostCount.repostCount;
        }
      }

      return formatted;
    })
    .filter((post): post is Post => post !== null);
}
