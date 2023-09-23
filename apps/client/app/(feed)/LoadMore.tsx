"use client";

import { useEffect, useTransition } from "react";
import { useInView } from "react-intersection-observer";

import { useFeed } from "./FeedContext";
import { fetchLatestPosts } from "./fetchLatestPosts";

export function LoadMore() {
  const { start, page, setPage, setPosts } = useFeed();

  const { ref, inView } = useInView({});

  const [_, startTransition] = useTransition();

  useEffect(() => {
    if (!inView) return;

    startTransition(async () => {
      const nextPage = page + 1;

      const posts = await fetchLatestPosts({
        page: nextPage,
        start,
      });

      setPosts((prev) => [...prev, ...posts]);
      setPage(nextPage);
    });
  }, [inView, page, setPage, setPosts, start]);

  return (
    <div
      ref={ref}
      className="group block w-full select-none space-y-3 rounded-xl border border-neutral-500 bg-neutral-800 p-4 transition hover:cursor-pointer hover:border-neutral-400 hover:bg-neutral-700 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-neutral-700" />
        </div>
      </div>

      <div className="relative aspect-square w-full animate-pulse rounded-lg bg-neutral-700"></div>
    </div>
  );
}
