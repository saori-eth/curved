"use client";

import { useEffect, useState, useTransition } from "react";
import { useInView } from "react-intersection-observer";

import { FEED_PAGE_SIZE } from "./constants";
import { useFeed } from "./FeedContext";
import { fetchLatestPosts } from "./fetchLatestPosts";

export function LoadMore() {
  const { start, page, setPage, setPosts, posts } = useFeed();
  const { ref, inView } = useInView({});
  const [_, startTransition] = useTransition();

  const [fetchingPage, setFetchingPage] = useState(page);
  const [reachedBottom, setReachedBottom] = useState(
    posts.length < FEED_PAGE_SIZE,
  );

  useEffect(() => {
    if (!inView || reachedBottom) return;

    const nextPage = page + 1;
    if (nextPage <= fetchingPage) return;
    setFetchingPage(nextPage);

    startTransition(async () => {
      const posts = await fetchLatestPosts({
        page: nextPage,
        start,
      });

      setPosts((prev) => [...prev, ...posts]);
      setPage(nextPage);

      if (posts.length < FEED_PAGE_SIZE) {
        setReachedBottom(true);
      }
    });
  }, [inView, fetchingPage, page, reachedBottom, setPage, setPosts, start]);

  if (reachedBottom) {
    return <div className="py-4 text-center text-slate-500">End of feed!</div>;
  }

  return (
    <div
      ref={ref}
      className="group block w-full select-none space-y-2 rounded-xl bg-slate-800 transition"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 animate-pulse rounded-full bg-slate-700" />
        </div>
      </div>

      <div className="relative aspect-square w-full animate-pulse rounded-lg bg-slate-700"></div>
    </div>
  );
}
