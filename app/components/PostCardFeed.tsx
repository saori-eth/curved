import { db } from "@/lib/db";

import { PostCard } from "./PostCard";

type Post = {
  id: string;
  title: string;
  description: string;
  image: string;
  author: string;
  avatar: string;
  price: number;
};

const mockPost: Post[] = [];

for (let i = 0; i < 6; i++) {
  mockPost.push({
    author: "Saori",
    avatar:
      "https://pbs.twimg.com/profile_images/1699999020679139328/8pur40mN_400x400.jpg",
    description: "This is a sample description for the first card.",
    id: i.toString(),
    image: "https://i.imgur.com/6T3pNMB.jpeg",
    price: 0.0156,
    title: "Sample Title 1",
  });
}

export async function PostCardFeed() {
  const data = await db.query.content.findMany({
    limit: 10,
    orderBy: (row, { desc }) => [desc(row.createdAt)],
  });

  return (
    <div className="no-scrollbar flex w-full justify-center overflow-y-auto pt-4">
      <div className="w-full max-w-sm space-y-4">
        {data.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
