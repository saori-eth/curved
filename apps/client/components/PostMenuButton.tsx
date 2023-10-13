"use client";

import { useMemo } from "react";
import {
  BiDotsHorizontalRounded,
  BiShareAlt,
  BiTrashAlt,
} from "react-icons/bi";

import { useAuth } from "@/app/AuthProvider";
import { env } from "@/lib/env.mjs";
import { Post } from "@/src/types/post";

import { deletePost } from "./deletePost";
import {
  DropdownContent,
  DropdownItem,
  DropdownRoot,
  DropdownTrigger,
} from "./Dropdown";

interface Props {
  post: Post;
}

export function PostMenuButton({ post }: Props) {
  const { user } = useAuth();

  const shareObj = useMemo(
    () => ({
      text: "Test text",
      title: "Test title",
      url: `${env.NEXT_PUBLIC_DEPLOYED_URL}/post/${post.id}`,
    }),
    [post],
  );

  const canShare = useMemo(() => {
    if (typeof navigator === "undefined") {
      return false;
    }

    if (!navigator.share) {
      return false;
    }

    return navigator.canShare(shareObj);
  }, [shareObj]);

  const canDelete =
    user?.address.toLowerCase() === post.owner.address.toLowerCase();

  if (!canDelete && !canShare) {
    return null;
  }

  async function handleDelete() {
    const { success } = await deletePost({ id: post.id });
    if (success) {
      console.log("Post deleted");
    }
  }

  function handleShare() {
    navigator.share({
      text: "Test share",
      title: "Test share 2",
      url: `${env.NEXT_PUBLIC_DEPLOYED_URL}/post/${post.id}`,
    });
  }

  return (
    <DropdownRoot>
      <DropdownTrigger
        title="More"
        className="z-20 flex h-7 w-7 items-center justify-center rounded-full text-2xl text-slate-400 transition active:bg-slate-600 active:text-white md:hover:bg-slate-600 md:hover:text-white md:active:opacity-90"
      >
        <BiDotsHorizontalRounded />
      </DropdownTrigger>

      <DropdownContent>
        {canDelete ? (
          <DropdownItem
            onClick={handleDelete}
            icon={<BiTrashAlt />}
            className="text-amber-500"
          >
            Delete
          </DropdownItem>
        ) : null}

        {canShare ? (
          <DropdownItem onClick={handleShare} icon={<BiShareAlt />}>
            Share
          </DropdownItem>
        ) : null}
      </DropdownContent>
    </DropdownRoot>
  );
}
