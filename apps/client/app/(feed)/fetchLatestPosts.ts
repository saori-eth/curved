"use server";

import { post } from "db";
import { and, desc, eq, lte } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db";
import { postQuery } from "@/src/server/postQuery";
import {
  formatRepostCountQuery,
  queryPostRepostCounts,
} from "@/src/server/repostCountQuery";
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

    const data = await postQuery(db)
      .orderBy(desc(post.createdAt))
      .where(and(lte(post.createdAt, new Date(start)), eq(post.deleted, false)))
      .limit(FEED_PAGE_SIZE)
      .offset(page * FEED_PAGE_SIZE);

    const repostCounts = await queryPostRepostCounts(data, db);

    return formatRepostCountQuery(data, repostCounts);
  } catch (e) {
    console.error(e);
    return [];
  }
}
