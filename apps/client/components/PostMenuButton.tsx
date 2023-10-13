"use client";

import {
  BiDotsHorizontalRounded,
  BiShareAlt,
  BiTrashAlt,
} from "react-icons/bi";

import { useAuth } from "@/app/AuthProvider";
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

  async function handleDelete() {
    const { success } = await deletePost({ id: post.id });
    if (success) {
      console.log("Post deleted");
    }
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
        {user?.address.toLowerCase() === post.owner.address.toLowerCase() ? (
          <DropdownItem
            onClick={handleDelete}
            icon={<BiTrashAlt />}
            className="text-amber-500"
          >
            Delete
          </DropdownItem>
        ) : null}

        <DropdownItem icon={<BiShareAlt />}>Share</DropdownItem>
      </DropdownContent>
    </DropdownRoot>
  );
}
