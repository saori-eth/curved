"use client";

import { PostCard } from "@/components/PostCard";

import { useFeed } from "./FeedContext";

export function PostFeed() {
  const { posts } = useFeed();

  return (
    <>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </>
  );
}
