import { notFound } from "next/navigation";

import { PostCard } from "@/components/PostCard";
import { fetchPost } from "@/lib/fetchPost";

export const revalidate = 30;

interface Props {
  params: {
    id: string;
  };
}

export default async function Post({ params }: Props) {
  const shareId = parseInt(params.id);

  const post = await fetchPost(shareId);
  if (!post) notFound();

  return <PostCard post={post} disableLink />;
}
