"use client";

import { MAX_CAPTION_LENGTH } from "db";
import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";
import { BiRepost } from "react-icons/bi";

import { RepostArgs, RepostResponse } from "@/app/api/user/repost/types";
import { useAuth } from "@/app/AuthProvider";
import { Post, PostType } from "@/src/types/post";

import { DialogContent, DialogRoot, DialogTrigger } from "./Dialog";
import { PostCard } from "./PostCard";
import { SubmitButton } from "./SubmitButton";

interface Props {
  post: Post;
}

export function RepostButton({ post }: Props) {
  const captionRef = useRef<HTMLTextAreaElement>(null);

  const { user } = useAuth();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const disabled = !user || pending;

  function repost(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (disabled) {
      return;
    }

    startTransition(async () => {
      const args: RepostArgs = {
        caption: captionRef.current?.value,
        postId: post.id,
      };

      const res = await fetch("/api/user/repost", {
        body: JSON.stringify(args),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!res.ok) {
        console.error(await res.text());
        return;
      }

      const { postId } = (await res.json()) as RepostResponse;

      console.log("Reposted");

      router.push(`/post/${postId}`);
    });
  }

  return (
    <DialogRoot>
      <DialogTrigger
        title="Repost"
        disabled={disabled}
        className={`group z-40 flex items-center space-x-1 rounded-full px-1 transition ${
          post.repostCount ? "" : "aspect-square"
        } ${disabled ? "opacity-50" : "hover:text-sky-300"}`}
      >
        {post.repostCount ? (
          <span className="text-sm">{post.repostCount}</span>
        ) : null}
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full text-2xl text-slate-400 transition ${
            disabled
              ? ""
              : "group-active:bg-slate-600 group-active:text-sky-300 md:group-hover:bg-slate-600 md:group-hover:text-sky-300 md:group-active:opacity-90"
          }`}
        >
          <BiRepost />
        </span>
      </DialogTrigger>

      <DialogContent title="Repost" disabled={disabled}>
        {user ? (
          <form onSubmit={repost} className="flex flex-col space-y-4">
            <PostCard
              disableLink
              disableActions
              post={{
                createdAt: new Date().toLocaleString(),
                data: {
                  caption: null,
                  repost: post,
                },
                deleted: false,
                id: "fake",
                owner: user,
                repostCount: 0,
                type: PostType.Repost,
              }}
            />

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
              <SubmitButton type="submit" disabled={disabled}>
                Post
              </SubmitButton>
            </div>
          </form>
        ) : null}
      </DialogContent>
    </DialogRoot>
  );
}
