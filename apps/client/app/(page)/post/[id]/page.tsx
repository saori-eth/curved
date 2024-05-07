import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BiLoaderAlt } from "react-icons/bi";

import { baseMetadata } from "@/app/baseMetadata";
import { PostCard } from "@/components/PostCard";
import { fetchPost } from "@/lib/fetchPost";
import { formatAddress } from "@/lib/utils";
import { PostType } from "@/src/types/post";

import { Comments } from "./Comments";
import { TradeButtons } from "./TradeButtons";
import { Trades } from "./Trades";

export const revalidate = 5;

interface Props {
  params: {
    id: string;
  };
}

type NotNull<T> = T extends null | undefined ? never : T;
type MetadataImages = NotNull<Metadata["openGraph"]>["images"];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await fetchPost(params.id);
  if (!post) return {};

  const user = post.owner.username || formatAddress(post.owner.address);
  const description = "Trade shares on yuyu.social and earn YUYU rewards!";

  let title = "";
  let images: MetadataImages = [];

  switch (post.type) {
    case PostType.Post: {
      images = [{ url: post.data.url }];

      if (post.data.caption) {
        title = `"${post.data.caption}" • Post by ${user}`;
      } else {
        title = `Post by ${user}`;
      }

      break;
    }

    case PostType.Repost: {
      if (post.data.repost?.type === PostType.Post) {
        images = [{ url: post.data.repost.data.url }];
      }

      if (post.data.caption) {
        title = `"${post.data.caption}" • Repost by ${user}`;
      } else if (post.data.repost?.data.caption) {
        title = `Repost of "${post.data.repost.data.caption}"`;
      } else {
        title = `Repost by ${user}`;
      }

      break;
    }
  }

  return {
    description,
    openGraph: {
      ...baseMetadata.openGraph,
      description,
      images,
      title,
    },
    title,
    twitter: {
      ...baseMetadata.twitter,
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
    <>
      <div className="z-20 col-span-5 md:col-span-3">
        <PostCard post={post} disablePostLink />
      </div>

      <div className="z-20 col-span-5 pb-12 md:col-span-2 md:ml-0 md:mr-3 md:pb-0">
        {post.type === PostType.Post ? (
          <div className="space-y-4 md:pt-12">
            <Trades shareId={post.data.shareId} />
            <TradeButtons shareId={post.data.shareId} />
          </div>
        ) : null}

        <div className="pt-[20px]">
          <Suspense
            fallback={
              <div className="flex w-full justify-center">
                <BiLoaderAlt className="animate-spin" />
              </div>
            }
          >
            <Comments postId={post.id} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
