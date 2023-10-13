"use client";

import { useEffect, useState, useTransition } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { useInView } from "react-intersection-observer";

import { FEED_PAGE_SIZE } from "./constants";
import { useFeed } from "./FeedContext";
import { fetchLatestPosts } from "./fetchLatestPosts";
import { fetchFollowingPosts } from "./following/fetchFollowingPosts";

interface Props {
  fetchType: "latest" | "following";
}

export function LoadMore({ fetchType }: Props) {
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

    const fetchPosts =
      fetchType === "latest" ? fetchLatestPosts : fetchFollowingPosts;

    startTransition(async () => {
      const posts = await fetchPosts({
        page: nextPage,
        start,
      });

      setPosts((prev) => [...prev, ...posts]);
      setPage(nextPage);

      if (posts.length < FEED_PAGE_SIZE) {
        setReachedBottom(true);
      }
    });
  }, [
    inView,
    fetchingPage,
    page,
    reachedBottom,
    setPage,
    setPosts,
    start,
    fetchType,
  ]);

  if (reachedBottom) {
    return <div className="py-4 text-center text-slate-500">End of feed!</div>;
  }

  return (
    <div ref={ref} className="flex justify-center text-slate-500">
      <BiLoaderAlt className="animate-spin" />
    </div>
  );
}
