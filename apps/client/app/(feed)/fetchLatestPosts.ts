"use server";

import { post, repost } from "db";
import { desc, eq, lte, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db";
import { formatPostQuery, postQuery } from "@/src/server/postQuery";
import { Post } from "@/src/types/post";

import { FEED_PAGE_SIZE } from "./constants";

const FetchLatestSchema = z.object({
  page: z.number().int().min(0),
  start: z.number().int().min(0).optional(),
});

type FetchLatestArgs = z.infer<typeof FetchLatestSchema>;

export async function fetchLatestPosts(
  _args: FetchLatestArgs,
): Promise<Post[]> {
  try {
    const args = FetchLatestSchema.parse(_args);
    const page = args.page;
    const start = args.start ?? Date.now();

    const data = await postQuery
      .orderBy(desc(post.createdAt))
      .where(lte(post.createdAt, new Date(start)))
      .limit(FEED_PAGE_SIZE)
      .offset(page * FEED_PAGE_SIZE);

    console.log(data);

    await Promise.all(
      data.map(async (post) => {
        const data = await db
          .select({
            repostCount: sql<number>`count(*)`,
          })
          .from(repost)
          .where(eq(repost.postId, post.id));

        console.log(data[0]?.repostCount);
      }),
    );

    return formatPostQuery(data);
  } catch (e) {
    console.error(e);
    return [];
  }
}
