import { nftPost, post, userBalances } from "db";
import { and, eq, inArray, like, not } from "drizzle-orm";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { baseMetadata } from "@/app/baseMetadata";
import { PostCard } from "@/components/PostCard";
import { db } from "@/lib/db";
import { fetchProfileFromUsername } from "@/lib/fetchProfile";
import { formatPostQuery, postQuery } from "@/src/server/postQuery";

interface Props {
  params: {
    user: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Strip @ from username
  const username = params.user.replace("%40", "");

  const title = `@${username}'s collection`;

  return {
    openGraph: {
      ...baseMetadata.openGraph,
      title,
    },
    title,
    twitter: {
      ...baseMetadata.twitter,
      title,
    },
  };
}

export default async function Collection({ params }: Props) {
  // Strip @ from username
  const username = params.user.replace("%40", "");

  const profile = await fetchProfileFromUsername(username);
  if (!profile) notFound();

  const balanceData = await db
    .select({
      id: post.publicId,
    })
    .from(userBalances)
    .where(like(userBalances.address, profile.address))
    .leftJoin(nftPost, eq(nftPost.shareId, userBalances.shareId))
    .leftJoin(
      post,
      and(
        eq(post.publicId, nftPost.postId),
        not(like(post.owner, profile.address)),
      ),
    );

  const postIds = balanceData
    .map((row) => row.id)
    .filter((id): id is string => id !== null);

  if (postIds.length === 0) {
    return (
      <p className="pt-2 text-center text-slate-500">
        This user has not collected any posts.
      </p>
    );
  }

  const data = await postQuery().where(inArray(post.publicId, postIds));

  const posts = formatPostQuery(data);

  return (
    <div className="grid w-full gap-2 pt-2 md:grid-cols-2">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} disableActions />
      ))}
    </div>
  );
}
