import { post } from "db";
import { and, eq } from "drizzle-orm";
import { cache } from "react";

import { formatPostQuery, postQuery } from "@/src/server/postQuery";
import { repostCountQuery } from "@/src/server/repostCountQuery";
import { Post } from "@/src/types/post";

export const fetchPost = cache(async (id: string): Promise<Post | null> => {
  try {
    const [data, repostCount] = await Promise.all([
      postQuery()
        .where(and(eq(post.publicId, id), eq(post.deleted, false)))
        .limit(1),
      repostCountQuery(id),
    ]);

    const item = formatPostQuery(data)[0];

    if (!item) {
      return null;
    }

    if (repostCount[0]) {
      item.repostCount = Number(repostCount[0].repostCount);
    }

    return item;
  } catch (e) {
    console.error(e);
    return null;
  }
});
