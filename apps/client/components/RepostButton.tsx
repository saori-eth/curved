"use client";

import { useTransition } from "react";
import { BiRepost } from "react-icons/bi";

import { useAuth } from "@/app/AuthProvider";
import { Post } from "@/lib/fetchPost";

import { DialogContent, DialogRoot, DialogTrigger } from "./Dialog";
import { PostImage } from "./PostImage";
import { PostTopBar } from "./PostTopBar";
import { SubmitButton } from "./SubmitButton";

interface Props {
  post: Post;
}

export function RepostButton({ post }: Props) {
  const { user } = useAuth();
  const [pending, startTransition] = useTransition();

  const numReposts = 0;

  if (!user) {
    return null;
  }

  function repost(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    startTransition(async () => {});
  }

  return (
    <DialogRoot>
      <DialogTrigger
        title="Repost"
        className="group flex items-center space-x-1 rounded-full px-1 transition hover:text-sky-300"
      >
        {numReposts ? <span className="text-sm">{numReposts}</span> : null}
        <span className="flex h-7 w-7 items-center justify-center rounded-full text-2xl text-slate-400 transition group-hover:bg-slate-700 group-hover:text-sky-300 group-active:bg-slate-600">
          <BiRepost />
        </span>
      </DialogTrigger>

      <DialogContent title="Repost">
        <form onSubmit={repost} className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <PostTopBar owner={user} disableLink />
            <BiRepost className="text-lg text-slate-400" />
            <span className="text-sm text-slate-400">
              {post.owner.username ?? post.owner.address}
            </span>
          </div>

          <div className="space-y-2 px-8">
            <PostTopBar owner={post.owner} disableLink />
            <PostImage post={post} />
            <p className="text-sm text-slate-400">{post.caption}</p>
          </div>

          <textarea
            placeholder="Add a comment..."
            rows={2}
            className="w-full rounded-lg bg-slate-900 px-2 py-1 placeholder:text-slate-400"
          />

          <div className="flex justify-center pt-2">
            <SubmitButton>Post</SubmitButton>
          </div>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}
