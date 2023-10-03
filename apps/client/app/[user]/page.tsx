import { Metadata } from "next";
import { notFound } from "next/navigation";

import { PostCard } from "@/components/PostCard";
import { db } from "@/lib/db";
import { Post } from "@/lib/fetchPost";
import { fetchProfileFromUsername } from "@/lib/fetchProfile";

import { FollowButton } from "./FollowButton";
import { UserAvatar } from "./UserAvatar";
import { Username } from "./Username";

export const revalidate = 10;

interface Props {
  params: {
    user: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Strip @ from username
  const username = params.user.replace("%40", "");

  const profile = await fetchProfileFromUsername(username);
  if (!profile) return {};

  const title = `@${profile.username}`;
  const images = profile.avatar ? [{ url: profile.avatar }] : [];

  return {
    description: "",
    openGraph: {
      description: "",
      images,
      title,
      type: "profile",
    },
    title,
    twitter: {
      card: "summary",
      description: "",
      images,
      title,
    },
  };
}

export default async function User({ params }: Props) {
  // Strip @ from username
  const username = params.user.replace("%40", "");

  const profile = await fetchProfileFromUsername(username);
  if (!profile) notFound();

  const dbPosts = await db.query.post.findMany({
    columns: {
      caption: true,
      createdAt: true,
      shareId: true,
      url: true,
    },
    limit: 20,
    orderBy: (row, { desc }) => desc(row.shareId),
    where: (row, { eq }) => eq(row.owner, profile.address),
  });

  const posts: Post[] = dbPosts.map((post) => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
    owner: {
      address: profile.address,
      avatar: profile.avatar,
      username: profile.username,
    },
  }));

  return (
    <div className="flex flex-col items-center space-y-2 py-4 md:pt-14">
      <div className="relative flex w-full flex-col items-center space-y-2">
        <UserAvatar username={profile.username} avatar={profile.avatar} />
        <Username username={profile.username} />
      </div>

      <div className="flex h-8 items-center">
        <FollowButton address={profile.address} username={profile.username} />
      </div>

      <div className="w-full space-y-6 pt-2">
        {posts.map((post) => (
          <PostCard key={post.shareId} post={post} />
        ))}
      </div>
    </div>
  );
}
