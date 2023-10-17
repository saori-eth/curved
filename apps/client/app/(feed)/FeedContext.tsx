"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import { Post } from "@/src/types/post";

import { useRefresh } from "./RefreshButton";

export interface IFeedContext {
  posts: Post[];
  setPosts: Dispatch<SetStateAction<Post[]>>;
  start: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}

export const FeedContext = createContext<IFeedContext>({
  page: 0,
  posts: [],
  setPage: () => {},
  setPosts: () => {},
  start: 0,
});

interface Props {
  initialPosts?: Post[];
  children: React.ReactNode;
}

export function FeedProvider({ initialPosts = [], children }: Props) {
  const { time, timeChanged } = useRefresh();

  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(0);

  // Clear posts when refreshing
  useEffect(() => {
    if (!timeChanged) {
      return;
    }

    setPosts([]);
    setPage(-1);
  }, [time, timeChanged]);

  return (
    <FeedContext.Provider
      value={{
        page,
        posts,
        setPage,
        setPosts,
        start: time,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
}

export function useFeed() {
  return useContext(FeedContext);
}
