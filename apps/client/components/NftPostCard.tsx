import { NftPost } from "@/src/types/post";

import { PostImage } from "./PostImage";
import { PostTopBar } from "./PostTopBar";
import { RepostButton } from "./RepostButton";

interface Props {
  post: NftPost;
  disableActions?: boolean;
  disableLink?: boolean;
}

export function NftPostCard({ post, disableActions, disableLink }: Props) {
  return (
    <>
      <PostTopBar owner={post.owner} disableLink={disableLink} />
      <PostImage post={post} />

      {post.data.caption ? (
        <h3 className="px-2 text-sm text-slate-400 md:px-0">
          {post.data.caption}
        </h3>
      ) : null}

      {disableActions ? null : (
        <div className="flex items-center justify-end space-x-1 px-2 md:px-0">
          <RepostButton post={post} />
        </div>
      )}
    </>
  );
}
