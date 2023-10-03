import { post } from "db";
import { eq } from "drizzle-orm";
import { cache } from "react";

import { formatPostQuery, postQuery } from "@/src/server/postQuery";
import { Post } from "@/src/types/post";

export const fetchPost = cache(async (id: string): Promise<Post | null> => {
  try {
    const data = await postQuery.where(eq(post.publicId, id)).limit(1);
    const item = formatPostQuery(data)[0];

    if (!item) {
      return null;
    }

    return item;
  } catch (e) {
    console.error(e);
    return null;
  }
});
