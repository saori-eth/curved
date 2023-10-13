import { NftPost } from "@/src/types/post";

import { PostImage } from "./PostImage";
import { PostTopBar } from "./PostTopBar";

interface Props {
  post: NftPost;
  disableLink?: boolean;
}

export function NftPostCard({ post, disableLink }: Props) {
  return (
    <>
      <PostTopBar
        createdAt={post.createdAt}
        owner={post.owner}
        disableLink={disableLink}
      />

      <PostImage post={post} />

      {post.data.caption ? (
        <h3 className="px-2 text-sm text-slate-400 md:px-0">
          {post.data.caption}
        </h3>
      ) : null}
    </>
  );
}
