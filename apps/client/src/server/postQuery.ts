import { nftPost, post, repost, user } from "db";
import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { getAvatarUrl } from "@/lib/getAvatarUrl";
import { Post, PostType } from "@/src/types/post";

export const postQuery = db
  .select({
    createdAt: post.createdAt,
    id: post.publicId,
    nftCaption: nftPost.caption,
    nftShareId: nftPost.shareId,
    nftUrl: nftPost.url,
    ownerAddress: post.owner,
    ownerAvatarId: user.avatarId,
    ownerUsername: user.username,
    repostCaption: repost.caption,
    repostReference: repost.referencePostId,
    type: post.type,
  })
  .from(post)
  .leftJoin(user, eq(post.owner, user.address))
  .leftJoin(
    nftPost,
    and(eq(post.type, "post"), eq(post.publicId, nftPost.postId)),
  )
  .leftJoin(
    repost,
    and(eq(post.type, "repost"), eq(post.publicId, repost.postId)),
  );

export function formatPostQuery(data: Awaited<typeof postQuery>): Post[] {
  return data.map((row) => {
    switch (row.type) {
      case "post": {
        if (!row.nftShareId || !row.nftUrl) {
          throw new Error("Invalid post");
        }

        return {
          createdAt: row.createdAt.toISOString(),
          data: {
            caption: row.nftCaption,
            shareId: row.nftShareId,
            url: row.nftUrl,
          },
          id: row.id,
          owner: {
            address: row.ownerAddress,
            avatar: getAvatarUrl(row.ownerAvatarId),
            username: row.ownerUsername,
          },
          type: PostType.Post,
        };
      }
      case "repost": {
        return {
          createdAt: row.createdAt.toISOString(),
          data: {
            caption: row.repostCaption,
          },
          id: row.id,
          owner: {
            address: row.ownerAddress,
            avatar: getAvatarUrl(row.ownerAvatarId),
            username: row.ownerUsername,
          },
          type: PostType.Repost,
        };
      }
    }
  });
}
