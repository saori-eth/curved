"use server";

import { post } from "db";
import { and, desc, inArray, lte } from "drizzle-orm";
import { z } from "zod";

import { getSession } from "@/lib/auth/getSession";
import { db } from "@/lib/db";
import { formatPostQuery, postQuery } from "@/src/server/postQuery";
import { Post } from "@/src/types/post";

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
  const args = FetchFollowingSchema.parse(_args);

  const session = await getSession();
  if (!session) {
    // TODO: prompt sign in
    return [];
  }

  try {
    // Get following list
    const following = await db.query.follow.findMany({
      where: (row, { eq }) => eq(row.userId, session.user.userId),
    });

    if (following.length === 0) {
      return [];
    }

    const followingAddresses = following.map((row) =>
      row.following.toLowerCase(),
    );

    // Get posts
    const start = args.start ?? Date.now();

    const data = await postQuery
      .where(
        and(
          inArray(post.owner, followingAddresses),
          lte(post.createdAt, new Date(start)),
        ),
      )
      .orderBy(desc(post.createdAt))
      .offset(args.page * FEED_PAGE_SIZE)
      .limit(FEED_PAGE_SIZE);

    const posts = formatPostQuery(data);

    return posts;
  } catch (e) {
    console.error(e);
    return [];
  }
}
