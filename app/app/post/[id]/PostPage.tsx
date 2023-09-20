import { Post } from "@/lib/fetchPost";

interface Props {
  post: Post;
}

export function PostPage({ post }: Props) {
  return (
    <div>
      <div>{post.shareId}</div>
      <div>{post.title}</div>
      <div>{post.description}</div>
      <div>{post.owner}</div>
      <div>{post.url}</div>
    </div>
  );
}
