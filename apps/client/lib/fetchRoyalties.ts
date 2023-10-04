import { cache } from "react";
import { db } from "./db";
import { nftPost, post, shareData, user } from "db";
import { and, eq, like, sql } from "drizzle-orm";

export const fetchRoyalties = cache(
  async (creator: string): Promise<bigint | null> => {
    try {
      const lifetimeCreatorSharesVolume = await db
        .select({
          totalVolume: sql<string>`sum(${shareData.volume})`,
        })
        .from(post)
        .leftJoin(
          nftPost,
          and(eq(post.type, "post"), eq(post.publicId, nftPost.postId)),
        )
        .leftJoin(
          shareData,
          and(eq(post.type, "post"), eq(nftPost.shareId, shareData.shareId)),
        )
        .where(and(eq(post.owner, creator), eq(post.type, "post")));

      if (!lifetimeCreatorSharesVolume) {
        return null;
      }

      /**
       * todo: fetch royaltyFeePercent from chain since it can change.
       * nice to have: avoid hitting the chain for each time this query is calculated.
       *
       *    i think the ideal solution is:
       *     - when `share_accounting` starts we fetch `royaltyFeePercent`
       *     - add an event `royaltyFeePercentChanged` and track that on `share_accounting`
       *     - we calculate the royalties on the indexer on each trade and add to `shareData`
       */
      const royaltiesFee = 5n;

      return (
        (BigInt(lifetimeCreatorSharesVolume[0]?.totalVolume || 0) *
          royaltiesFee) /
        100n
      );
    } catch (e) {
      console.error(e);
      return null;
    }
  },
);
