import Link from "next/link";

import { Post } from "@/lib/fetchPost";
import { toHex } from "@/lib/toHex";

import { PostImage } from "./PostImage";
import { PostTopBar } from "./PostTopBar";
import { RepostButton } from "./RepostButton";

interface Props {
  post: Post;
}

export function PostCard({ post }: Props) {
  return (
    <div className="w-full space-y-2">
      <div className="px-2 md:px-0">
        <PostTopBar owner={post.owner} />
      </div>

      <PostImage post={post} />

      <h3 className="px-2 text-sm text-slate-400 md:px-0">{post.caption}</h3>

      <div className="flex items-center justify-end space-x-1 px-2 md:px-0">
        <RepostButton post={post} />

        <Link
          href={`/post/${toHex(post.shareId)}`}
          className="flex h-8 items-center space-x-1 rounded-full border border-slate-500 px-4 transition hover:border-slate-400 hover:bg-slate-700 active:bg-slate-600"
        >
          Trade
        </Link>
      </div>
    </div>
  );
}
