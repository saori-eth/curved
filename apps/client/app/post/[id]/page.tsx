import { notFound } from "next/navigation";

import { fetchPost } from "@/lib/fetchPost";

import { PostPage } from "./PostPage";

interface Props {
  params: { id: string };
}

export default async function Post({ params }: Props) {
  const post = await fetchPost(params.id);
  if (!post) {
    notFound();
  }

  return <PostPage post={post} />;
}
