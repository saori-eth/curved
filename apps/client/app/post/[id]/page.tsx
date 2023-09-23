import { notFound } from "next/navigation";

import { fetchPost } from "@/lib/fetchPost";

import { PostPage } from "./PostPage";

export const revalidate = 30;

interface Props {
  params: { id: string };
}

export default async function Post({ params }: Props) {
  const post = await fetchPost(params.id);
  if (!post) {
    notFound();
  }

  return (
    <div className="flex w-full justify-center pt-20">
      <div className="w-full max-w-5xl">
        <PostPage post={post} />
      </div>
    </div>
  );
}
