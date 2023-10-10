import { Quicksand } from "next/font/google";
import Link from "next/link";

import { FeedButton } from "./FeedButton";
import { AppTitle } from "../AppTitle";

interface Props {
  children: React.ReactNode;
}

export default function FeedLayout({ children }: Props) {
  return (
    <div className="z-20 col-span-3 flex justify-center md:relative">
      <div className="fixed top-0 z-50 w-full bg-slate-800/95 px-3 py-2 shadow backdrop-blur-lg md:h-16 md:w-1/2 md:py-0 md:shadow-none">
        <div className="md:hidden">
          <AppTitle />
        </div >

        <div className="hidden h-full md:flex md:items-center md:justify-center">
          <FeedButton href="/">Latest</FeedButton>
          <FeedButton href="/following">Following</FeedButton>
        </div>
      </div>

      <div className="w-full pt-14 md:pt-2">
        <div className="mb-2 flex items-center justify-center md:hidden">
          <FeedButton href="/">Latest</FeedButton>
          <FeedButton href="/following">Following</FeedButton>
        </div>

        {children}
      </div>
    </div>
  );
}
