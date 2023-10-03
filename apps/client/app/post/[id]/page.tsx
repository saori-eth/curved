import { notFound } from "next/navigation";

import { PostImage } from "@/components/PostImage";
import { PostTopBar } from "@/components/PostTopBar";
import { fetchPost } from "@/lib/fetchPost";

import { TradeButtons } from "./TradeButtons";
import { Trades } from "./Trades";

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

  return (
    <div className="space-y-2 px-2 md:px-0 md:pt-14">
      <PostTopBar owner={post.owner} />
      <PostImage post={post} />
      <h3 className="text-sm text-slate-400">{post.caption}</h3>

      <div className="space-y-2 py-4">
        <TradeButtons shareId={shareId} />
        <Trades shareId={shareId} />
      </div>
    </div>
  );
}
