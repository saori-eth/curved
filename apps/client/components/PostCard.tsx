import Image from "next/image";
import Link from "next/link";
import { BiRepost } from "react-icons/bi";

import { PostPage } from "@/app/post/[id]/PostPage";
import { Post } from "@/lib/fetchPost";
import { toHex } from "@/lib/toHex";

import Avatar from "./Avatar";
import { DialogContent, DialogRoot, DialogTrigger } from "./Dialog";

interface Props {
  post: Post;
  disableLink?: boolean;
}

export function PostCard({ post, disableLink = false }: Props) {
  const numReposts = 5;

  return (
    <div className={`relative w-full px-2 pb-2 ${disableLink ? "" : ""}`}>
      {disableLink ? null : (
        <Link
          href={`/post/${toHex(post.shareId)}`}
          className="absolute inset-0"
        />
      )}

      <div className="h-11">
        <div className="absolute left-2 top-0 z-10 flex h-11 items-center">
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
        </div>
      </div>

      {post.url && (
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
      )}

      <h3 className="pt-2 text-sm text-slate-400">{post.description}</h3>

      <div className="flex items-center justify-end space-x-1">
        <button
          title="Repost"
          className="group z-10 flex items-center space-x-1 rounded-full px-1 transition hover:text-sky-300"
        >
          {numReposts ? <span className="text-sm">{numReposts}</span> : null}
          <span className="flex h-7 w-7 items-center justify-center rounded-full text-2xl text-slate-400 transition group-hover:bg-slate-600 group-hover:text-sky-300 group-active:bg-slate-600">
            <BiRepost />
          </span>
        </button>

        <DialogRoot>
          <DialogTrigger className="z-10 flex h-8 items-center space-x-1 rounded-full border border-slate-500 px-4 transition hover:border-slate-400 hover:bg-slate-700 active:bg-slate-600">
            Trade
          </DialogTrigger>

          <DialogContent>
            <PostPage post={post} />
          </DialogContent>
        </DialogRoot>
      </div>
    </div>
  );
}
