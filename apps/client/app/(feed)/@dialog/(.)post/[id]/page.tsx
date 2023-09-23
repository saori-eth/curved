import { notFound } from "next/navigation";

import { PostPage } from "@/app/post/[id]/PostPage";
import { fetchPost } from "@/lib/fetchPost";

import { Dialog } from "./Dialog";

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
    <Dialog>
      <PostPage post={post} />
    </Dialog>
  );
}
