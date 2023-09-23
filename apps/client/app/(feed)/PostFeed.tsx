"use client";

import { PostCard } from "@/components/PostCard";

import { useFeed } from "./FeedContext";

export function PostFeed() {
  const { posts } = useFeed();

  return (
    <>
      {posts.map((post) => (
        <PostCard
          key={post.shareId}
          owner={post.owner}
          shareId={post.shareId}
          url={post.url}
          description={post.description ?? ""}
        />
      ))}
    </>
  );
}
