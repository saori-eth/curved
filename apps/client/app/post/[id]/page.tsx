import { Metadata } from "next";
import { notFound } from "next/navigation";

import { PostCard } from "@/components/PostCard";
import { fetchPost } from "@/lib/fetchPost";
import { PostType } from "@/src/types/post";

import { TradeButtons } from "./TradeButtons";
import { Trades } from "./Trades";

export const revalidate = 5;

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await fetchPost(params.id);
  if (!post) return {};

  const user = post.owner.username
    ? `@${post.owner.username}`
    : post.owner.address;
  const description = `Post by ${user}`;

  let title = "";
  let images = undefined;

  switch (post.type) {
    case PostType.Post: {
      title = post.data.caption || `Post #${post.id}`;
      images = [{ url: post.data.url }];
      break;
    }

    case PostType.Repost: {
      title = `Repost #${post.id}`;
      images = undefined;
      break;
    }
  }

  return {
    description,
    openGraph: {
      description,
      images,
      title,
    },
    title,
    twitter: {
      card: "summary",
      description,
      images,
      title,
    },
  };
}

export default async function Post({ params }: Props) {
  const post = await fetchPost(params.id);
  if (!post) notFound();

  return (
    <div className="space-y-2 md:pt-14">
      <PostCard post={post} disablePostLink />

      {post.type === PostType.Post ? (
        <div className="space-y-2 py-4">
          <TradeButtons shareId={post.data.shareId} />
          <Trades shareId={post.data.shareId} />
        </div>
      ) : null}
    </div>
  );
}
