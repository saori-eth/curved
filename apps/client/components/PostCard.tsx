import { Post, PostType } from "@/src/types/post";

import { NftPostCard } from "./NftPostCard";
import { PostCardBase } from "./PostCardBase";
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
        <NftPostCard
          post={post}
          disableActions={disableActions}
          disableLink={disableLink}
        />
      ) : (
        <RepostCard
          post={post}
          layer={layer}
          disableActions={disableActions}
          disableLink={disableLink}
        />
      )}
    </PostCardBase>
  );
}
