import { notFound } from "next/navigation";

import { PostPage } from "@/app/post/[id]/PostPage";
import { fetchPost } from "@/lib/fetchPost";

interface Props {
  params: { id: string };
}

export default async function Post({ params }: Props) {
  const post = await fetchPost(params.id);
  if (!post) {
    notFound();
  }

  return (
    <div className="h-full w-full max-w-5xl rounded-2xl bg-neutral-800 p-8 shadow-xl">
      <PostPage post={post} />
    </div>
  );
}
