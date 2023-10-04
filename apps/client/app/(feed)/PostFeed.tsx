"use client";

import { useEffect } from "react";

import { PostCard } from "@/components/PostCard";

import { useFeed } from "./FeedContext";

export function PostFeed() {
  const { posts } = useFeed();

  useEffect(() => {
    // On refresh, scroll to the top of the page
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </>
  );
}
