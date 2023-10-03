"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

import { Post } from "@/src/types/post";

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
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [start] = useState(Date.now());
  const [page, setPage] = useState(0);

  return (
    <FeedContext.Provider
      value={{
        page,
        posts,
        setPage,
        setPosts,
        start,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
}

export function useFeed() {
  return useContext(FeedContext);
}
