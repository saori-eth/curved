import { BiRepost } from "react-icons/bi";

import { Repost } from "@/src/types/post";

import { PostCard } from "./PostCard";
import { PostTopBar } from "./PostTopBar";
import { RepostButton } from "./RepostButton";

interface Props {
  post: Repost;
  layer?: number;
  disableActions?: boolean;
  disableLink?: boolean;
}

export function RepostCard({
  post,
  layer = 1,
  disableActions,
  disableLink,
}: Props) {
  return (
    <>
      <PostTopBar owner={post.owner} disableLink={disableLink}>
        <BiRepost className="text-lg text-slate-400" />
        <span className="text-sm text-slate-400">
          {post.data.repost?.owner.username ?? post.data.repost?.owner.address}
        </span>
      </PostTopBar>

      {post.data.caption ? (
        <h3 className="px-2 text-sm text-slate-400 md:px-0">
          {post.data.caption}
        </h3>
      ) : null}

      {post.data.repost && layer < 2 ? (
        <div className="z-30 rounded-2xl border border-slate-600">
          <PostCard
            post={post.data.repost}
            layer={layer + 1}
            disableActions
            disableLink={disableLink}
          />
        </div>
      ) : null}

      {disableActions ? null : (
        <div className="flex items-center justify-end space-x-1 px-2 md:px-0">
          <RepostButton post={post} />
        </div>
      )}
    </>
  );
}
