import { Post, PostType } from "@/src/types/post";

import { NftPostCard } from "./NftPostCard";
import { PostCardBase } from "./PostCardBase";
import { PostMenuButton } from "./PostMenuButton";
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
  return (
    <PostCardBase
      id={post.id}
      layer={layer}
      disableLink={disablePostLink ?? disableLink}
    >
      {post.type === PostType.Post ? (
        <NftPostCard post={post} disableLink={disableLink} />
      ) : (
        <RepostCard post={post} layer={layer} disableLink={disableLink} />
      )}

      {disableActions ? null : (
        <div className="flex items-center justify-end space-x-1 px-2 md:px-0">
          <RepostButton post={post} />
          <PostMenuButton post={post} />
        </div>
      )}
    </PostCardBase>
  );
}
