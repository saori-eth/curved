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
      card: "summary_large_image",
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
    <>
      <div className="z-20 col-span-5 md:col-span-3">
        <PostCard post={post} disablePostLink />
      </div>

      {post.type === PostType.Post ? (
        <div className="z-20 col-span-5 mx-4 flex flex-col-reverse pb-12 md:col-span-2 md:ml-0 md:flex-col md:pb-0 md:pt-11">
          <Trades shareId={post.data.shareId} />
          <TradeButtons shareId={post.data.shareId} />
        </div>
      ) : null}
    </>
  );
}
