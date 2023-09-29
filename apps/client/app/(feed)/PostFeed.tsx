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
        <PostCard
          key={post.shareId}
          owner={post.owner.address}
          avatar={post.owner.avatar}
          username={post.owner.username}
          shareId={post.shareId}
          url={post.url}
          createdAt={post.createdAt}
          description={post.description ?? ""}
        />
      ))}
    </>
  );
}
