import Image from "next/image";
import Link from "next/link";
import { BiRepost } from "react-icons/bi";

import { Post } from "@/lib/fetchPost";
import { toHex } from "@/lib/toHex";

import Avatar from "./Avatar";

interface Props {
  post: Post;
}

export function PostCard({ post }: Props) {
  const numReposts = 5;

  return (
    <div className="w-full space-y-2">
      {post.owner.username ? (
        <Link
          href={`/@${post.owner.username}`}
          className="flex w-fit items-center space-x-2 pr-2 hover:underline"
        >
          <Avatar
            src={post.owner.avatar}
            uniqueKey={post.owner.username}
            size={32}
          />
          <span className="text-sm font-bold">{post.owner.username}</span>
        </Link>
      ) : (
        <div className="flex items-center space-x-2">
          <Avatar
            src={post.owner.avatar}
            uniqueKey={post.owner.address}
            size={32}
          />
          <span className="truncate text-sm font-bold">
            {post.owner.address}
          </span>
        </div>
      )}

      {post.url ? (
        <Image
          src={post.url}
          alt="Post image"
          width={0}
          height={0}
          sizes="517px"
          draggable={false}
          priority
          className="h-auto max-h-[1000px] w-full rounded-lg object-contain"
        />
      ) : (
        <div className="h-80 w-full" />
      )}

      <h3 className="text-sm text-slate-400">{post.description}</h3>

      <div className="flex items-center justify-end space-x-1">
        <button
          title="Repost"
          className="group z-10 flex items-center space-x-1 rounded-full px-1 transition hover:text-sky-300"
        >
          {numReposts ? <span className="text-sm">{numReposts}</span> : null}
          <span className="flex h-7 w-7 items-center justify-center rounded-full text-2xl text-slate-400 transition group-hover:bg-slate-700 group-hover:text-sky-300 group-active:bg-slate-600">
            <BiRepost />
          </span>
        </button>

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
