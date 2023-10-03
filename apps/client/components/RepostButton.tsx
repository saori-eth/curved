"use client";

import { MAX_CAPTION_LENGTH } from "db";
import { useRef, useTransition } from "react";
import { BiRepost } from "react-icons/bi";

import { useAuth } from "@/app/AuthProvider";
import { Post } from "@/src/types/post";

import { DialogContent, DialogRoot, DialogTrigger } from "./Dialog";
import { PostImage } from "./PostImage";
import { PostTopBar } from "./PostTopBar";
import { SubmitButton } from "./SubmitButton";

interface Props {
  post: Post;
}

export function RepostButton({ post }: Props) {
  const captionRef = useRef<HTMLTextAreaElement>(null);

  const { user } = useAuth();
  const [pending, startTransition] = useTransition();

  const numReposts = 0;

  if (!user) {
    return null;
  }

  const disabled = pending;

  function repost(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (disabled) {
      return;
    }

    startTransition(async () => {
      const res = await fetch("/api/user/repost", {
        body: JSON.stringify({
          caption: captionRef.current?.value,
          publicId: post.id,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!res.ok) {
        console.error(await res.text());
        return;
      }

      console.log("Reposted");
    });
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
        <form onSubmit={repost} className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <PostTopBar owner={user} disableLink />
            <BiRepost className="text-lg text-slate-400" />
            <span className="text-sm text-slate-400">
              {post.owner.username ?? post.owner.address}
            </span>
          </div>

          <div className="space-y-2 px-8 opacity-80">
            <PostTopBar owner={post.owner} disableLink />
            <PostImage post={post} />
            <p className="text-sm text-slate-400">{post.data.caption}</p>
          </div>

          <textarea
            ref={captionRef}
            disabled={disabled}
            placeholder="Add a comment..."
            maxLength={MAX_CAPTION_LENGTH}
            rows={2}
            className={`w-full rounded-lg bg-slate-900 px-3 py-1 placeholder:text-slate-400 ${
              disabled ? "opacity-50" : ""
            }`}
          />

          <div className="flex justify-center">
            <SubmitButton disabled={disabled}>Post</SubmitButton>
          </div>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}
