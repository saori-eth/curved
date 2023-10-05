import { post } from "db";
import { desc, like } from "drizzle-orm";
import { notFound } from "next/navigation";

import { PostCard } from "@/components/PostCard";
import { fetchProfileFromUsername } from "@/lib/fetchProfile";
import { formatPostQuery, postQuery } from "@/src/server/postQuery";

interface Props {
  params: {
    user: string;
  };
}

export default async function User({ params }: Props) {
  // Strip @ from username
  const username = params.user.replace("%40", "");

  const profile = await fetchProfileFromUsername(username);
  if (!profile) notFound();

  const data = await postQuery()
    .where(like(post.owner, profile.address))
    .orderBy(desc(post.createdAt))
    .limit(20);

  const posts = formatPostQuery(data);

  return (
    <div className="w-full space-y-2 pt-2">
      {posts.map((post) => (
        <PostCard key={`${post.owner.address}-${post.createdAt}`} post={post} />
      ))}
    </div>
  );
}
