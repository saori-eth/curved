import { db } from "@/lib/db";

import { PostCard } from "./PostCard";

export async function PostCardFeed() {
  const data = await db.query.content.findMany({
    columns: {
      description: true,
      owner: true,
      shareId: true,
      url: true,
    },
    limit: 10,
    orderBy: (row, { desc }) => [desc(row.createdAt)],
  });

  return (
    <div className="no-scrollbar flex w-full justify-center overflow-y-auto pt-4">
      <div className="w-full max-w-sm space-y-4 pb-4">
        {data.map((post) => (
          <PostCard
            key={post.shareId}
            owner={post.owner}
            shareId={post.shareId}
            url={post.url}
            description={post.description ?? ""}
          />
        ))}
      </div>
    </div>
  );
}
