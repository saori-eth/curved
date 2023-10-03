import Image from "next/image";

import { Post } from "@/lib/fetchPost";

interface Props {
  post: Post;
  sizes?: string;
}

export function PostImage({ post, sizes = "517px" }: Props) {
  if (post.url) {
    return (
      <Image
        src={post.url}
        alt="Post image"
        width={0}
        height={0}
        sizes={sizes}
        draggable={false}
        priority
        className="h-auto max-h-[1000px] w-full object-contain md:rounded-lg"
      />
    );
  }

  return <div className="h-80 w-full" />;
}
