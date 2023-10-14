import { post, repost } from "db";
import { and, desc, eq } from "drizzle-orm";

import { PostCard } from "@/components/PostCard";
import { formatPostQuery, postQuery } from "@/src/server/postQuery";
import { Repost } from "@/src/types/post";

interface Props {
  postId: string;
}

export async function Comments({ postId }: Props) {
  const data = await postQuery()
    .where(and(eq(repost.referencePostId, postId), eq(post.deleted, false)))
    .orderBy(desc(post.createdAt))
    .limit(16);

  const posts = formatPostQuery(data)
    .filter((p) => Boolean(p.data.caption))
    .map((_p) => {
      const p = _p as Repost;

      return {
        ...p,
        data: {
          ...p.data,
          repost: null,
        },
      };
    });

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1">
      <h3 className="mx-3 text-sm font-semibold leading-4 text-slate-400">
        Comments
      </h3>

      <ul className="space-y-1">
        {posts.map((p) => (
          <li key={p.id}>
            <PostCard post={p} disableActions />
          </li>
        ))}
      </ul>
    </div>
  );
}
