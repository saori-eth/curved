import { BiGhost } from "react-icons/bi";

import { Post, PostType } from "@/src/types/post";

import { NftPostCard } from "./NftPostCard";
import { PostCardBase } from "./PostCardBase";
import { PostMenuButton } from "./PostMenuButton";
import { PostTopBar } from "./PostTopBar";
import { RepostButton } from "./RepostButton";
import { RepostCard } from "./RepostCard";

interface Props {
  post: Post;
  layer?: number;
  disableActions?: boolean;
  disableLink?: boolean;
  disablePostLink?: boolean;
}

export function PostCard({
  post,
  layer = 1,
  disableActions,
  disableLink,
  disablePostLink,
}: Props) {
  const showActions = !disableActions && !post.deleted;

  return (
    <PostCardBase
      id={post.id}
      layer={layer}
      disableLink={disablePostLink ?? disableLink}
    >
      {post.deleted ? (
        <>
          <PostTopBar
            createdAt={post.createdAt}
            owner={post.owner}
            disableLink={disableLink}
          />
          <p className="flex items-center justify-center space-x-1 pb-3 pt-1 text-slate-500">
            <BiGhost />
            <span className="text-sm">Post deleted.</span>
          </p>
        </>
      ) : post.type === PostType.Post ? (
        <NftPostCard post={post} disableLink={disableLink} />
      ) : (
        <RepostCard post={post} layer={layer} disableLink={disableLink} />
      )}

      {showActions ? (
        <div className="flex items-center justify-end space-x-1 px-2 md:px-0">
          <RepostButton post={post} />
          <PostMenuButton post={post} />
        </div>
      ) : null}
    </PostCardBase>
  );
}
