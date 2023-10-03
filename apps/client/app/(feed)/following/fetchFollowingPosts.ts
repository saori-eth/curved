"use server";

import { post } from "db";
import { desc, inArray } from "drizzle-orm";
import { z } from "zod";

import { getSession } from "@/lib/auth/getSession";
import { db } from "@/lib/db";
import { Post } from "@/lib/fetchPost";
import { getAvatarUrl } from "@/lib/getAvatarUrl";

import { FEED_PAGE_SIZE } from "../constants";

// TODO: add reposts

const FetchFollowingSchema = z.object({
  page: z.number().int().min(0),
  start: z.number().int().min(0).optional(),
});

type FetchFollowingArgs = z.infer<typeof FetchFollowingSchema>;

export async function fetchFollowingPosts(
  _args: FetchFollowingArgs,
): Promise<Post[]> {
  const session = await getSession();
  if (!session) {
    // TODO: prompt sign in
    return [];
  }

  const following = await db.query.follow.findMany({
    where: (row, { eq }) => eq(row.userId, session.user.userId),
  });

  if (!following) {
    return [];
  }

  const followingAddresses = following.map((row) =>
    row.following.toLowerCase(),
  );

  try {
    const args = FetchFollowingSchema.parse(_args);

    let page = args.page;
    let offset = 0;

    if (args.start) {
      const latestShare = await db.query.post.findFirst({
        columns: {
          shareId: true,
        },
        orderBy: (row, { desc }) => [desc(row.shareId)],
      });

      if (!latestShare) {
        return [];
      }

      // latestShare is page 0, calculate what page we will find start on
      if (latestShare.shareId > args.start) {
        const diff = latestShare.shareId - args.start;
        page = Math.floor(diff / FEED_PAGE_SIZE);
        offset = diff % FEED_PAGE_SIZE;
      }
    }

    const data = await db
      .select()
      .from(post)
      .orderBy(desc(post.shareId))
      .where(inArray(post.owner, followingAddresses));

    const ownerInfo = await db.query.user.findMany({
      columns: {
        address: true,
        avatarId: true,
        username: true,
      },
      where: (row, { inArray }) => inArray(row.address, followingAddresses),
    });

    const withProfiles: Post[] = data.map((post) => {
      const owner = ownerInfo.find(
        (info) => info.address.toLowerCase() === post.owner.toLowerCase(),
      );

      return {
        ...post,
        createdAt: post.createdAt.toISOString(),
        owner: {
          address: post.owner,
          avatar: getAvatarUrl(owner?.avatarId),
          username: owner?.username ?? null,
        },
      };
    });

    return withProfiles;
  } catch (e) {
    console.error(e);
    return [];
  }
}
